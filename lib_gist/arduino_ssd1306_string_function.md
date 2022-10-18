## Arduino SSD1306 String function
Let ```println``` working as function.  
Input ```row```, ```column```, ```text size``` and ```string``` into parameters.

```c++
// Libraries
#include <Wire.h>
#include <Adafruit_SSD1306.h>
// SSD1306 Config
#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, -1);
// Counter
int counter = 0;

// Setup
void setup(){
  // Serial_Speed 
  Serial.begin(9600);
  // Display config
  display.begin(SSD1306_SWITCHCAPVCC,0x3C);
  // Display initialize
  status(3,15,2, 3,35,1, F("SSD1306"), F("Function Demo"));
  delay(3000);
}

// Main
void loop(){
  // Counter example
  counter = counter + 1;
  String m2 = "Counter: " + String(counter);
  // Display string
  status(3,15,2, 3,45,1, F("EXAMPLE"), m2);
  // Print counter to serial
  Serial.print(m2);
  Serial.print("\r\n");
  delay(10000);
}

// Desplay function
void status(int x1,int y1,int z1,int x2,int y2,int z2,String m1,String m2){
  display.clearDisplay();
  // Row 1
  display.setTextSize(z1);
  display.setTextColor(WHITE);
  display.setCursor(x1,y1);
  display.println(m1);
  // Row 2
  display.setTextSize(z2);
  display.setTextColor(WHITE);
  display.setCursor(x2,y2);
  display.println(m2);
  // Display Text
  display.display();
}
```
