## Arduino Nano based temperature sensor
### Change
```diff
+ Rewrite into Multitasking with Millis, some code improvement.
- Serial data output need USB communication.
```
### PCB Design and BOM
* [Bill of materials](https://github.com/Suzhou65/Suzhou65.github.io/blob/master/lib_circuit/bom_arduino_waterloop_sensor.md)
* [Gerber](https://github.com/Suzhou65/Suzhou65.github.io/raw/master/lib_circuit/gerber_arduino_waterloop_sensor.zip)
### Arduino Code
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
// Pin config
int ThermistorPin = A0;
float Resistor = 9950; // Pull-up resistor value, 9500~10500
// MultuTask, Loop Temperature
unsigned long previousTimeLoop = millis();
long timeIntervalLoop = 500;
int ThermistorValue; // Thermistor
float TemperatureKelvin, TemperatureCelsius; // Temperature float
float logR2, R2; // Float Config
float c1 = 1.009249522e-03, c2 = 2.378405444e-04, c3 = 2.019202697e-07;
// MultuTask, Case Temperature
unsigned long previousTimeCase = millis();
long timeIntervalCase = 500;
float TemperatureDS; // Temperature float
// MultuTask, Display and Serial
unsigned long previousTimeDISP = millis();
long timeIntervalDISP = 1000;
// Text
String BootText1, BootText2, BootText3;
String PrefixRadiator, PrefixPanel, TextSep, PrintOut;

// Config
void setup(){
  // Reset DS18B20
  DS18B20.begin();
  // Serial Speed 
  Serial.begin(9600);
  // Display separator
  TextSep = F(", ");
  PrefixRadiator = F("Radiator");
  PrefixPanel = F("Panel");
  BootText1 = F("Arduino Bsased");
  BootText2 = F("Watercooling");
  BootText3 = F("Temperature Monitor");
  // Display Config
  display.begin(SSD1306_SWITCHCAPVCC,0x3C);
  display.clearDisplay();
  //BOOT_TEXT
  display.setTextSize(1);
  display.setTextColor(WHITE);
  display.setCursor(3, 5);
  display.println(BootText1);
  display.setCursor(3, 16);
  display.println(BootText2);
  display.setCursor(3, 27);
  display.println(BootText3);
  display.display();
  delay(5000);
}

// Loop
void loop(){
  // Task Timer
  unsigned long currentTime = millis();
  // Loop Tempture Task
  if (currentTime - previousTimeLoop > timeIntervalLoop){
    previousTimeLoop = currentTime;
    // Measure temperature
    ThermistorValue = analogRead(ThermistorPin);
    R2 = Resistor * (1023.0 / (float)ThermistorValue - 1.0);
    logR2 = log(R2);
    TemperatureKelvin = (1.0 / (c1 + c2*logR2 + c3*logR2*logR2*logR2));
    TemperatureCelsius = TemperatureKelvin - 273.15;
  }
  // Case Tempture Task
  if (currentTime - previousTimeCase > timeIntervalCase){
    previousTimeCase = currentTime;
    // DS18B20
    DS18B20.requestTemperatures();
    TemperatureDS = DS18B20.getTempCByIndex(0);
  }
  // Display-Task
  if (currentTime - previousTimeDISP > timeIntervalDISP){
    previousTimeDISP = currentTime;
    // Serial
    PrintOut = TemperatureCelsius + TextSep + TemperatureDS;
    Serial.println(PrintOut);
    // Clean Display Cache
    display.clearDisplay();
    // Loop, Thermistor
    display.setTextSize(1);
    display.setTextColor(WHITE);
    display.setCursor(3, 7);
    display.println(PrefixRadiator);
    display.setTextSize(2);
    display.setTextColor(WHITE);
    display.setCursor(66, 3);
    display.println(TemperatureCelsius);
    // Case, DS18B20
    display.setTextSize(1);
    display.setTextColor(WHITE);
    display.setCursor(3, 33);
    display.println(PrefixPanel);
    display.setTextSize(2);
    display.setTextColor(WHITE);
    display.setCursor(66, 28);
    display.println(TemperatureDS);
    // Display
    display.display();
  }
}
```
## About Pull-up resistor
Due to the manufacturing tolerance, the truly resistance won't fit perfectly to the color code mark up, as the tolerance ring meaning.

Using multimeter get the precise resistance will improve the calculation result.

### Reference
+ [DS18B20 sensor and SSD1306](https://simple-circuit.com/arduino-ds18b20-ssd1306-oled/)
+ [Thermistor and SSD1306](https://www.hackster.io/Arnov_Sharma_makes/temperature-meter-thermometer-with-ntc-and-oled-display-83faa7)