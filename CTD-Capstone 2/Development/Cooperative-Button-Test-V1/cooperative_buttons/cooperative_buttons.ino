// MetamorphUs: Cooperative button test V1 (Arduino Uno)
// Three people must each press their button within WINDOW_MS of each other.
//   All three in time -> green LED turns on (success).
//   Window runs out first -> red LED blinks (miss).
// Each button also has its own LED, so every person can see their press registered.
// Every attempt is printed to the Serial Monitor (115200 baud) with its timing.
// Type a number in the Serial Monitor (e.g. 300) and press Enter to change the window live.

const int NUM_BUTTONS = 3;
const int BUTTON_PINS[NUM_BUTTONS] = {2, 3, 4};   // each button: pin -> button -> GND
const int BUTTON_LEDS[NUM_BUTTONS] = {8, 9, 10};  // lights while that button is held
const int SUCCESS_LED = 12;                       // green
const int MISS_LED = 11;                          // red

unsigned long windowMs = 500;              // how close together the presses must be
const unsigned long SUCCESS_SHOW_MS = 2000;  // how long the green LED stays on
const unsigned long MISS_SHOW_MS = 300;      // how long the red LED blinks
const unsigned long DEBOUNCE_MS = 20;        // ignores the electrical "bounce" of a button

bool isPressed[NUM_BUTTONS];         // debounced state
bool lastReading[NUM_BUTTONS];
unsigned long lastChange[NUM_BUTTONS];

bool inAttempt = false;              // an attempt starts at the first press
unsigned long attemptStart = 0;
bool pressedThisAttempt[NUM_BUTTONS];
unsigned long pressOffset[NUM_BUTTONS];  // ms after the first press
int attempts = 0;
int successes = 0;

void setup() {
  Serial.begin(115200);
  for (int i = 0; i < NUM_BUTTONS; i++) {
    pinMode(BUTTON_PINS[i], INPUT_PULLUP);  // pressed reads LOW
    pinMode(BUTTON_LEDS[i], OUTPUT);
  }
  pinMode(SUCCESS_LED, OUTPUT);
  pinMode(MISS_LED, OUTPUT);
  Serial.print("Cooperative button test ready. Window = ");
  Serial.print(windowMs);
  Serial.println(" ms. Type a number + Enter to change it.");
}

void loop() {
  unsigned long now = millis();
  readWindowFromSerial();

  for (int i = 0; i < NUM_BUTTONS; i++) {
    bool reading = digitalRead(BUTTON_PINS[i]) == LOW;
    if (reading != lastReading[i]) {
      lastReading[i] = reading;
      lastChange[i] = now;
    }
    if (now - lastChange[i] >= DEBOUNCE_MS && reading != isPressed[i]) {
      isPressed[i] = reading;
      digitalWrite(BUTTON_LEDS[i], reading ? HIGH : LOW);
      if (reading) onPress(i, now);  // only a new press counts, not holding it down
    }
  }

  if (inAttempt && now - attemptStart > windowMs) {
    attempts++;
    Serial.print("Attempt ");
    Serial.print(attempts);
    Serial.print(": MISS - only ");
    Serial.print(countPressed());
    Serial.print(" of ");
    Serial.print(NUM_BUTTONS);
    Serial.print(" pressed within ");
    Serial.print(windowMs);
    Serial.println(" ms");
    printScore();
    inAttempt = false;
    digitalWrite(MISS_LED, HIGH);
    delay(MISS_SHOW_MS);
    digitalWrite(MISS_LED, LOW);
  }
}

void onPress(int i, unsigned long now) {
  if (!inAttempt) {
    inAttempt = true;
    attemptStart = now;
    for (int j = 0; j < NUM_BUTTONS; j++) pressedThisAttempt[j] = false;
  }
  if (pressedThisAttempt[i]) return;  // pressing your own button twice doesn't help
  pressedThisAttempt[i] = true;
  pressOffset[i] = now - attemptStart;

  if (countPressed() == NUM_BUTTONS) {
    attempts++;
    successes++;
    Serial.print("Attempt ");
    Serial.print(attempts);
    Serial.print(": SUCCESS - all ");
    Serial.print(NUM_BUTTONS);
    Serial.print(" pressed within ");
    Serial.print(now - attemptStart);
    Serial.print(" ms (window ");
    Serial.print(windowMs);
    Serial.print(" ms). Press times after first press:");
    for (int j = 0; j < NUM_BUTTONS; j++) {
      Serial.print("  B");
      Serial.print(j + 1);
      Serial.print("=");
      Serial.print(pressOffset[j]);
    }
    Serial.println();
    printScore();
    inAttempt = false;
    digitalWrite(SUCCESS_LED, HIGH);
    delay(SUCCESS_SHOW_MS);
    digitalWrite(SUCCESS_LED, LOW);
  }
}

int countPressed() {
  int n = 0;
  for (int j = 0; j < NUM_BUTTONS; j++) if (pressedThisAttempt[j]) n++;
  return n;
}

void printScore() {
  Serial.print("   Score: ");
  Serial.print(successes);
  Serial.print(" / ");
  Serial.print(attempts);
  Serial.println(" successful");
}

void readWindowFromSerial() {
  if (Serial.available() > 0) {
    long v = Serial.parseInt();
    while (Serial.available() > 0) Serial.read();  // clear the rest of the line
    if (v > 0) {
      windowMs = v;
      Serial.print("Window set to ");
      Serial.print(windowMs);
      Serial.println(" ms");
    }
  }
}
