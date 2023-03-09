## Arduino Nano based temperature sensor
### Change
```diff
+
-
```
### PCB Design
[Gerber Archive](https://github.takahashi65.info/lib_circuit/gerber_arduino_waterloop_sensor.zip)
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
// Thermistor Config
int ThermistorPin = A0;
int ThermistorValue;
// Pull-up resistor value
float Resistor = 10000; // 9500~10500
// Tempture float
float Td, Tk, Tn;
// Float Config
float logR2, R2;
float c1 = 1.009249522e-03, c2 = 2.378405444e-04, c3 = 2.019202697e-07;
// Setup Config
void setup(void)
{
  // Reset DS18B20
  DS18B20.begin();
  // Serial Speed 
  Serial.begin(9600);
  // Display Config
  display.begin(SSD1306_SWITCHCAPVCC,0x3C);
  display.clearDisplay();
}
// Main Code
void loop(void)
{
  // DS18B20
  DS18B20.requestTemperatures();
  Td = DS18B20.getTempCByIndex(0);  
  // Thermistor
  ThermistorValue = analogRead(ThermistorPin);
  R2 = Resistor * (1023.0 / (float)ThermistorValue - 1.0);
  logR2 = log(R2);
  Tk = (1.0 / (c1 + c2*logR2 + c3*logR2*logR2*logR2));
  Tn = Tk - 273.15;
  delay(8);
  // Clean Display Cache
  display.clearDisplay();
  // Thermistor
  display.setTextSize(1);
  display.setTextColor(WHITE);
  display.setCursor(3, 7);
  display.println("Radiator");
  display.setTextSize(2);
  display.setTextColor(WHITE);
  display.setCursor(66, 3);
  display.println(Tn);
  // DS18B20
  display.setTextSize(1);
  display.setTextColor(WHITE);
  display.setCursor(3, 33);
  display.println("Panel");
  display.setTextSize(2);
  display.setTextColor(WHITE);
  display.setCursor(66, 28);
  display.println(Td);
  display.display();
  // Debug, Serial Print
  /*
  Serial.print(Tk);
  Serial.print("\t");
  Serial.print(Tn);
  Serial.print("\t");
  Serial.print(Td);
  Serial.print("\n");
  */
  delay(992);
}
```
## About Pull-up resistor
Due to the manufacturing tolerance, the truly resistance won't fit perfectly to the color code mark up, as the tolerance ring meaning.

Using multimeter get the precise resistance will improve the calculation result.

### Reference
+ [DS18B20 sensor and SSD1306](https://simple-circuit.com/arduino-ds18b20-ssd1306-oled/)
+ [Thermistor and SSD1306](https://www.hackster.io/Arnov_Sharma_makes/temperature-meter-thermometer-with-ntc-and-oled-display-83faa7)