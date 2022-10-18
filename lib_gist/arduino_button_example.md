## Arduino button function example
Using internal pullup resistance

```c++
// Button connect to D2 and GND
const int button = 2;
// Using internal LED, D13
const int led = 13;

void setup(){
  pinMode(led, INPUT);
  pinMode(button, INPUT);
  digitalWrite(button, INPUT_PULLUP);
  digitalWrite(led, INPUT_PULLUP);
  Serial.begin(9600);
}
void loop(){
  // When press button
  if (digitalRead(button) == LOW){
    Serial.print(F("MANUAL PRESS\n"));
  }
  // Otherwise
  else if (digitalRead(button == HIGH)){
    Serial.print(F("IDLE\n"));
    blink();
  }
  delay(100);
}

// Internal LED blinking
void blink(){
  pinMode(led, OUTPUT);
  digitalWrite(led, HIGH);
  delay(50);
  pinMode(led, INPUT);
}
```