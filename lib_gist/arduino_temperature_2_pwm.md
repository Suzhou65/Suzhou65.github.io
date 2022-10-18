## Arduino Nano based temperature control PWM Fan
```diff
- FAN speed (RPM) output by serial port only.
```
```c++
// Libraries
#include <Wire.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include <Adafruit_SSD1306.h>
// SSD1306 Config
#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, -1);
// DS18B20 OneWire Config
#define ONE_WIRE_BUS 2
OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature DS18B20(&oneWire);
// Read Hall sensor
const int HallSensor = 3;
#define DEBOUNCE 20
#define THRESHOLD 100
// Button
const int FullSpeed = 4;
// PWM output
const int PWMSignal = 10;
// Integer
int InterruptCounter, Tn, PWMconfig, FANspeed;
// String
String mode_select, separator, print_log;
String prefix_temperature, display_temperature, prefix_pwm, display_pwm;
// Interrupt
unsigned long volatile ts1=0, ts2=0;

// Config
void setup(){
  // Manual override
  pinMode(FullSpeed, INPUT);
  digitalWrite(FullSpeed, INPUT_PULLUP);
  // Output PWM
  pinMode(PWMSignal, OUTPUT);
  // Initialize Timer
  setupTimer1();
  // Reading RPM
  pinMode(HallSensor, INPUT_PULLUP);
  attachInterrupt(digitalPinToInterrupt(HallSensor),tachISR,FALLING);
  // Display config
  display.begin(SSD1306_SWITCHCAPVCC,0x3C);
  display.clearDisplay();
  // Reset DS18B20
  DS18B20.begin();
  // Serial_Speed 
  Serial.begin(9600);
  // Prefix
  prefix_temperature = F("Temperature: ");
  prefix_pwm = F("PWM Config: ");
  separator = F(", ");
  // Preparing
  status(10,10,1,F("Temperature2PWM"), 10,32,1,F("Loading program ..."), 10,52,1,F(" "));
  setPWM1B(0.95f);
  delay(3000);
}
void loop(){
  // Measure temperature
  DS18B20.requestTemperatures();
  Tn = DS18B20.getTempCByIndex(0);
  // Thermostat
  Temperature2PWM(Tn);
  // Measure RPM
  calcRPM();  
  // Display format
  display_temperature = prefix_temperature + Tn;
  display_pwm = prefix_pwm + PWMconfig;
  // Display
  status(10,10,1,display_temperature, 10,32,1,display_pwm, 10,52,1,mode_select);
  // Serial format
  print_log = Tn + separator + PWMconfig + separator + FANspeed;
  // Serial Print
  Serial.println(print_log);
  delay(50);
}

// Interrupt
void tachISR(){
  unsigned long m=millis();
  if((m-ts2)>DEBOUNCE){
    ts1=ts2;
    ts2=m;
  }
}
// Calculates Fan RPM
unsigned long calcRPM(){
  if(millis()-ts2<THRESHOLD&&ts2!=0){
    FANspeed = (60000/(ts2-ts1))/2;
    return;
  }else{
    FANspeed = 0;
    return;
  }
}

// Timer
void setupTimer1(){
  TCCR1A = (1 << COM1A1) | (1 << COM1B1) | (1 << WGM11);
  TCCR1B = (1 << CS10) | (1 << WGM13);
  ICR1 = 320;
  // Pin9, Pin10
  OCR1A = 0;
  OCR1B = 0;
}
// PWN control
void setPWM1B(float f){
  f=f<0?0:f>1?1:f;
  OCR1B = (uint16_t)(320*f);
  PWMconfig = 100*(f);
  return;
}

// Temperature control
void Temperature2PWM(int Tn){
  // Mode selecting
  if(digitalRead(FullSpeed) == LOW){
    // Disable
    mode_select = F("Full Speed");
    setPWM1B(1.00f);
    return Tn;
  }else{
    // Enable
    mode_select = F("Thermostat Mode");
    switch(Tn){
      case 20:
      case 21:
      case 22:
      case 23:
      case 24:
      case 25:
        setPWM1B(0.50f);
        return Tn;
      case 26:
      case 27:
      case 28:
      case 29:
      case 30:
      case 31:
        setPWM1B(0.55f);
        return Tn;
      case 32:
      case 33:
      case 34:
      case 35:
      case 36:
      case 37:
        setPWM1B(0.65f);
        return Tn;
      case 38:
      case 39:
      case 40:
      case 41:
      case 42:
      case 43:
        setPWM1B(0.80f);
        return Tn;
      case 44:
      case 45:
      case 46:
      case 47:
      case 48:
      case 49:
      case 50:
        setPWM1B(1.00f);
        return Tn;
      default:
        setPWM1B(0.85f);
        return Tn;
    }    
  }
}

// Desplay function
void status(
  int x1,int y1,int z1, String w1,
  int x2,int y2,int z2, String w2,
  int x3,int y3,int z3, String w3)
  {
  // Clean Cache
  display.clearDisplay();
  // String 1
  display.setTextSize(z1);
  display.setTextColor(WHITE);
  display.setCursor(x1,y1);
  display.println(w1);
  // Line
  display.drawLine(05,25,123,25,WHITE);
  // String 2
  display.setTextSize(z2);
  display.setTextColor(WHITE);
  display.setCursor(x2,y2);
  display.println(w2);
  // Line
  display.drawLine(05,45,123,45,WHITE);
  // String 3
  display.setTextSize(z3);
  display.setTextColor(WHITE);
  display.setCursor(x3,y3);
  display.println(w3);
  // Display Text
  display.display();
}
```

### Reference
+ [Read fan speed with Arduino](https://www.aeq-web.com/arduino-pc-lufter-drehzahl-messen-uber-tachosignal/)
+ [PWN Fan controller with temp sensing and button override](https://create.arduino.cc/projecthub/KaptenJansson/pwn-fan-controller-with-temp-sensing-and-button-override-4f2e8d)
+ [HOW TO PROPERLY CONTROL PWM FANS WITH ARDUINO](https://fdossena.com/?p=ArduinoFanControl/i.md)
+ [Guide for I2C OLED Display with Arduino](https://randomnerdtutorials.com/guide-for-oled-display-with-arduino/)
