## Arduino Nano based temperature control PWM Fan
### Change
```diff
+ Add some Curve-like PWM Configuration
+ Add SSD1306 display Shutdown Function, Avoid Screen Burn-in
- Delete FullSpeed Function
```
### PCB Design and BOM
* [Bill of materials](https://github.com/Suzhou65/Suzhou65.github.io/blob/master/lib_circuit/bom_arduino_2_pwm_thermostat.md)
* [Gerber](https://github.com/Suzhou65/Suzhou65.github.io/raw/master/lib_circuit/gerber_arduino_2_pwm.zip)
### Arduino Code
```c++
// Libraries
#include <Wire.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include <Adafruit_SSD1306.h>
// SSD1306 config
#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, -1);
// DS18B20 OneWire config
#define ONE_WIRE_BUS 2
OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature DS18B20(&oneWire);
// Pin config
const int HallSensor = 3;
const int SPST = 4;
const int PWMoutput = 10;
// MultuTask, PWM
unsigned long previousTimePWM = millis();
long timeIntervalPWM = 250;
float TemputreRead, PWMSignal;
int PWMConfig;
// Task, RPM
unsigned long previousTimeRPM = millis();
long timeIntervalRPM = 1000;
#define AntiBounce 5
#define FanIsStuck 500
unsigned long volatile ts1=0, ts2=0;
int CurrentSpeed;
// MultuTask, Display
unsigned long previousTimeDISP = millis();
long timeIntervalDISP = 1000;
// Text
String PrintOut, TextSep, PrefixTemperature, PrefixPWM, PrefixRPM;
String String1, String2, String3;

// Config
void setup(){
  // Switch Function
  pinMode(SPST, INPUT);
  digitalWrite(SPST, INPUT_PULLUP);
  // Output PWM
  pinMode(PWMoutput, OUTPUT);
  // Initialize Timer for PWM
  setupTimer1();
  // Reading RPM
  pinMode(HallSensor,INPUT_PULLUP);
  attachInterrupt(digitalPinToInterrupt(HallSensor),TachISR,FALLING);
  // Display config
  display.begin(SSD1306_SWITCHCAPVCC,0x3C);
  display.clearDisplay();
  // Reset DS18B20
  DS18B20.begin();
  // Serial Speed 
  Serial.begin(9600);
  // Serial text separator
  TextSep = F(", ");
  PrefixTemperature = F("Temperature: ");
  PrefixPWM = F("PWM: ");
  PrefixRPM = F("RPM: ");
  // Preparing
  setPWM1B(0.85f);
  delay(500);
}

// Loop
void loop(){
  // Task Timer
  unsigned long currentTime = millis();
  // PWM Task
  if (currentTime - previousTimePWM > timeIntervalPWM){
    previousTimePWM = currentTime;
    // Measure temperature
    DS18B20.requestTemperatures();
    TemputreRead = DS18B20.getTempCByIndex(0);
    // Thermostat
    Temperature2PWM(TemputreRead);
  }
  // RPM Task
  if (currentTime - previousTimeRPM > timeIntervalRPM){
    previousTimeRPM = currentTime;
    // Measure 
    CalcRPM();
  }
  // Display-Task
  if (currentTime - previousTimeDISP > timeIntervalDISP){
    previousTimeDISP = currentTime;
    // Serial Text
    PrintOut = String(TemputreRead)+TextSep+String(PWMConfig)+TextSep+String(CurrentSpeed);
    // Display Function Enable
    if (digitalRead(SPST) == LOW){
      // Serial
      Serial.println(PrintOut);
      display.clearDisplay();
      // String 1
      display.setTextSize(1);
      display.setTextColor(WHITE);
      display.setCursor(10,10);
      String1 = PrefixTemperature+String(TemputreRead);
      display.println(String1);
      // String 2
      display.setTextSize(1);
      display.setTextColor(WHITE);
      display.setCursor(10,32);
      String2 = PrefixPWM+String(PWMConfig);
      display.println(String2);
      // String 3
      display.setTextSize(1);
      display.setTextColor(WHITE);
      display.setCursor(10,52);
      String3 = PrefixRPM+String(CurrentSpeed);
      display.println(String3);
      // Display
      display.display();     
    // Display Function Disable 
    } else if (digitalRead(SPST) == HIGH){
      // Serial
      Serial.println(PrintOut);
      display.clearDisplay();
      display.display();
    }
  }
}

// PWM Timer
void setupTimer1(){
  TCCR1A = (1 << COM1A1) | (1 << COM1B1) | (1 << WGM11);
  TCCR1B = (1 << CS10) | (1 << WGM13);
  ICR1 = 320;
  // Pin9, Pin10
  OCR1A = 0;
  OCR1B = 0;
}
// PWN Output
void setPWM1B(float PWMSignal){
  PWMSignal=PWMSignal<0?0:PWMSignal>1?1:PWMSignal;
  OCR1B = (uint16_t)(320*PWMSignal);
  PWMConfig = 100*(PWMSignal);
  return;
}
// Interrupt handler
void TachISR(){
  unsigned long m=millis();
  if((m-ts2)>AntiBounce){
    ts1=ts2;
    ts2=m;
  }
}
// Calculates RPM
unsigned long CalcRPM(){
  if(millis()-ts2< FanIsStuck &&ts2!=0){
    CurrentSpeed = (60000/(ts2-ts1))/2;
    return CurrentSpeed;
  }else{
    CurrentSpeed = 0;
    return CurrentSpeed;  
  }
}
// Thermostat
void Temperature2PWM(int TemputreRead){
  if (TemputreRead>=21 && TemputreRead<=25){
    PWMSignal = (TemputreRead*1.4)/100;
    setPWM1B(PWMSignal);
    return;
  } else if (TemputreRead>=26 && TemputreRead<=30){
    PWMSignal = (TemputreRead*1.6)/100;
    setPWM1B(PWMSignal);
    return;
  } else if (TemputreRead>=31 && TemputreRead<=35){
    PWMSignal = (TemputreRead*1.8)/100;
    setPWM1B(PWMSignal);
    return;
  } else if (TemputreRead>=36 && TemputreRead<=45){
    PWMSignal = (TemputreRead*2.0)/100;
    setPWM1B(PWMSignal);
    return;
  } else {
    PWMSignal = 0.75;
    setPWM1B(PWMSignal);
    return;
  }
}
```

### Reference
+ [Read fan speed with Arduino](https://www.aeq-web.com/arduino-pc-lufter-drehzahl-messen-uber-tachosignal/)
+ [PWN Fan controller with temp sensing and button override](https://create.arduino.cc/projecthub/KaptenJansson/pwn-fan-controller-with-temp-sensing-and-button-override-4f2e8d)
+ [HOW TO PROPERLY CONTROL PWM FANS WITH ARDUINO](https://fdossena.com/?p=ArduinoFanControl/i.md)
+ [How To Do Multitasking With Arduino](https://roboticsbackend.com/how-to-do-multitasking-with-arduino/)
+ [Guide for I2C OLED Display with Arduino](https://randomnerdtutorials.com/guide-for-oled-display-with-arduino/)
