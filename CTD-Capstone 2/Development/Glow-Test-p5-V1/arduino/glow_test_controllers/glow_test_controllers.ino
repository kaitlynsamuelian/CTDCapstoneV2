// MetamorphUs glow test V1: Arduino side (Arduino Uno).
// Uses the SAME wiring as our two-button cooperative test, so nothing needs to be rewired:
//   Button 1 (Sunlight) -> pin 2 and GND      Button 2 (Water) -> pin 3 and GND
//   Button 1 LED -> pin 8    Button 2 LED -> pin 9    Red LED -> pin 11    Green LED -> pin 12
// Optional: knobs on A0 (Sunlight) and A1 (Water). Leave them out if you only have buttons.
//
// Every 30 ms it sends one line over USB:  button1,button2,knobA0,knobA1   e.g.  1,0,512,300
// The p5.js page sends one letter back to drive the feedback LEDs:
//   G = both elements balanced (green on)   R = only one is in its sweet spot (red on)   O = off

const int BUTTON_PINS[2] = {2, 3};
const int BUTTON_LEDS[2] = {8, 9};
const int RED_LED = 11;
const int GREEN_LED = 12;

unsigned long lastSend = 0;

void setup() {
  Serial.begin(115200);
  for (int i = 0; i < 2; i++) {
    pinMode(BUTTON_PINS[i], INPUT_PULLUP);  // pressed reads LOW
    pinMode(BUTTON_LEDS[i], OUTPUT);
  }
  pinMode(RED_LED, OUTPUT);
  pinMode(GREEN_LED, OUTPUT);
}

void loop() {
  int b1 = digitalRead(BUTTON_PINS[0]) == LOW ? 1 : 0;
  int b2 = digitalRead(BUTTON_PINS[1]) == LOW ? 1 : 0;
  digitalWrite(BUTTON_LEDS[0], b1);
  digitalWrite(BUTTON_LEDS[1], b2);

  while (Serial.available() > 0) {
    char c = Serial.read();
    if (c == 'G') { digitalWrite(GREEN_LED, HIGH); digitalWrite(RED_LED, LOW); }
    if (c == 'R') { digitalWrite(GREEN_LED, LOW);  digitalWrite(RED_LED, HIGH); }
    if (c == 'O') { digitalWrite(GREEN_LED, LOW);  digitalWrite(RED_LED, LOW); }
  }

  if (millis() - lastSend >= 30) {
    lastSend = millis();
    Serial.print(b1); Serial.print(',');
    Serial.print(b2); Serial.print(',');
    Serial.print(analogRead(A0)); Serial.print(',');
    Serial.println(analogRead(A1));
  }
}
