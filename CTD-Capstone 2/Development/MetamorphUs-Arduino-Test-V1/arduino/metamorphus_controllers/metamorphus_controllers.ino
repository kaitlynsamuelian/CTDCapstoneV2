// MetamorphUs feasibility test V1: three stand-in controllers on an Arduino Uno.
//   Sunlight = knob on A0, Water = knob on A1, Bloom = hold button on pin 2.
// Each LED shows its own controller, so you can check the wiring without a laptop display.
// It sends one line per reading over USB, e.g. "512,300,1" (sun 0-1023, water 0-1023, bloom 0/1).
// The balance and hold logic lives in the p5.js page (display/sketch.js).

const int SUN_PIN = A0;
const int WATER_PIN = A1;
const int BLOOM_PIN = 2;

const int SUN_LED = 9;     // yellow LED: brighter as the Sunlight knob turns up
const int WATER_LED = 10;  // blue LED: brighter as the Water knob turns up
const int BLOOM_LED = 11;  // green LED: on while Bloom is held

void setup() {
  Serial.begin(115200);
  pinMode(BLOOM_PIN, INPUT_PULLUP);  // button connects pin 2 to GND, so pressed reads LOW
  pinMode(SUN_LED, OUTPUT);
  pinMode(WATER_LED, OUTPUT);
  pinMode(BLOOM_LED, OUTPUT);
}

void loop() {
  int sun = analogRead(SUN_PIN);
  int water = analogRead(WATER_PIN);
  int bloom = digitalRead(BLOOM_PIN) == LOW ? 1 : 0;

  analogWrite(SUN_LED, sun / 4);      // 0-1023 -> 0-255
  analogWrite(WATER_LED, water / 4);
  digitalWrite(BLOOM_LED, bloom);

  Serial.print(sun);
  Serial.print(',');
  Serial.print(water);
  Serial.print(',');
  Serial.println(bloom);

  delay(50);  // about 20 readings per second
}
