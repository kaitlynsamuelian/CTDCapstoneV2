# MetamorphUs: Arduino feasibility test V1 (Nov 9, 2026)

**Question this test answers:** can an Arduino Uno read three stand-in controllers (Sunlight knob, Water knob, Bloom hold-button), send them to a p5.js page over USB, and only unlock the butterfly when all three are kept in balance for 10 seconds? And can one person do it alone, or does it take a group?

## Parts (from a starter kit)
- Arduino Uno + USB cable
- Breadboard + jumper wires
- 2 potentiometers (knobs). **Only have 1?** See "If you only have one knob" below.
- 1 push button
- 3 LEDs (yellow, blue, green if you have them) + 3 resistors, 220 Ω (red-red-brown)

## Wiring
Breadboard rails: Uno **5V → + rail**, Uno **GND → – rail**.

| Part | Connect |
|---|---|
| Sunlight knob | outer legs → + rail and – rail; **middle leg → A0** |
| Water knob | outer legs → + rail and – rail; **middle leg → A1** |
| Bloom button | one leg → **pin 2**; the diagonally opposite leg → – rail (no resistor needed) |
| Yellow LED (Sunlight) | long leg → **pin 9**; short leg → 220 Ω resistor → – rail |
| Blue LED (Water) | long leg → **pin 10**; short leg → 220 Ω resistor → – rail |
| Green LED (Bloom) | long leg → **pin 11**; short leg → 220 Ω resistor → – rail |

Spread the three controls apart on long jumper wires (or separate breadboards) so three people can each stand at one.

## Step 1: Arduino on its own
1. Install the free Arduino IDE (arduino.cc/en/software).
2. Open `arduino/metamorphus_controllers/metamorphus_controllers.ino`, choose **Tools → Board → Arduino Uno** and the port, then click **Upload**.
3. Check: turning a knob dims/brightens its LED; holding the button lights the green LED.
4. **Tools → Serial Plotter**, set to **115200 baud**: you should see three live lines. Screenshot this for the feasibility doc.
5. Close the Serial Plotter before Step 2 (only one program can use the port at a time).

## Step 2: Arduino → p5.js ecosystem
1. In Terminal: `cd` into this folder's `display` folder, then run `python3 -m http.server 8000`.
2. In **Chrome**, open `http://localhost:8000`. (Web Serial only works in Chrome/Edge, and from localhost, not by double-clicking the file.)
3. Press **C**, pick the Arduino's port, click Connect.
4. Hold all three in their green bands for 10 s → the butterfly appears, then a new round starts.

No Arduino plugged in? The page runs in mouse mode (mouse left/right = Sunlight, up/down = Water, hold Space = Bloom), useful for showing the idea.

Keys: **C** connect · **R** new round (press when a new group starts) · **D** download the round log as CSV (round, seconds to reveal, breaks, settings). The log stores no names or recordings.

## Step 3: Run it with people (suggested plan)
1. **Solo try:** one person tries to do all three at once. Note whether they can and how long it takes.
2. **Group rounds:** three people, one per station, no instructions beyond "make the ecosystem healthy." Press R as they start. Run 3+ groups if you can.
3. **Change one setting per round** in the `SETTINGS` block at the top of `display/sketch.js`, then refresh the page:
   - `holdSeconds`: 8 vs 12
   - `onBreak`: `'reset'` vs `'drain'` (which one is fun, and which one is frustrating?)
   - `requireMovement: true`: a knob only counts if someone touched it in the last 3 s, so nobody can set it and walk away. This tests the "how do we know everyone is taking part" question.
4. Ask each group: "This would be better if…" (your teacher asked for this), and note how they talked to each other.
5. Take photos/video of the circuit and of people playing (with their consent). Press **D** to save the log.

## What to record (fill in with real results only)
- Did the hardware → browser connection work? Any lag you could notice?
- Solo attempt: succeeded? time?
- Group rounds: seconds to reveal, number of breaks (from the CSV)
- Which settings felt best
- "This would be better if…" quotes
- Surprises

## If you only have one knob
Use a second push button for Water: wire it to **pin 3** like the Bloom button, and in the `.ino` change `int water = analogRead(WATER_PIN);` to `int water = digitalRead(3) == LOW ? 400 : 0;` and add `pinMode(3, INPUT_PULLUP);` in `setup()`. Holding it puts Water in the healthy band.
