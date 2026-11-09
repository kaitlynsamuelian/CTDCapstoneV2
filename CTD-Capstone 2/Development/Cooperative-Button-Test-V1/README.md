# MetamorphUs: Cooperative button test V1 (Nov 9, 2026)

**Question this test answers:** can an Arduino tell when three people act together, meaning all three buttons are pressed within a set number of milliseconds, and respond with a simple output (an LED)? This is the core "you need other people" check for MetamorphUs, with no screen.

## Start simpler: two-button version
Same test with 2 people: `cooperative_buttons_2p/cooperative_buttons_2p.ino`, wired with `wiring-steps-V3-two-buttons/step-1…7` (pins 2, 3 → buttons; 8, 9 → button LEDs; 11 red; 12 green). Parts: 2 buttons, 4 LEDs, 4 × 220 Ω. Put the buttons **more than an arm span apart** so one person can't press both. To go to 3 buttons later, add Button 3 (pin 4) and its LED (pin 10) and upload the 3-button sketch.

## Parts (starter kit)
- Arduino Uno + USB cable, breadboard, jumper wires
- 3 push buttons
- 5 LEDs: 3 for the buttons (any color), 1 green (success), 1 red (miss)
- 5 × 220 Ω resistors (red-red-brown)

Only have 1 green LED? The 3 button LEDs and the red one are optional; the test still works with just the green success LED.

## Wiring
**Picture guide:** follow `wiring-steps-V2/step-1-ground-wire.png` through `step-7-complete.png` (source: `wiring-diagram-V2.html`).

Uno **GND → – rail** on the breadboard.

| Part | Connect |
|---|---|
| Button 1 / 2 / 3 | one leg → **pin 2 / 3 / 4**; diagonally opposite leg → – rail (no resistor needed) |
| Button LEDs 1 / 2 / 3 | long leg → **pin 8 / 9 / 10**; short leg → 220 Ω → – rail |
| Red LED (miss) | long leg → **pin 11**; short leg → 220 Ω → – rail |
| Green LED (success) | long leg → **pin 12**; short leg → 220 Ω → – rail |

**Spread the buttons apart** on long jumper wires (or tape them to three sides of a table) so one person can't reach them all. That spacing is what makes it cooperative.

## Running it
1. Open `cooperative_buttons/cooperative_buttons.ino` in the Arduino IDE, choose **Tools → Board → Arduino Uno** and the port, and click **Upload**.
2. Open **Tools → Serial Monitor**, set it to **115200 baud**.
3. Press buttons. Each attempt starts at the first press and prints, e.g.
   - `Attempt 3: SUCCESS - all 3 pressed within 143 ms (window 500 ms). Press times after first press:  B1=0  B2=97  B3=143`
   - `Attempt 4: MISS - only 2 of 3 pressed within 500 ms`
4. To change the difficulty, type a number (e.g. `250`) in the Serial Monitor and press Enter. No re-upload needed.

Rules built in: a press only counts when it's new (holding a button down doesn't count), and pressing your own button twice doesn't help.

## Suggested test plan
1. **Hardware check:** each button lights its LED; all three together light the green LED.
2. **Solo try:** one person tries all three buttons. Can they?
3. **Three people, no countdown:** say only "make the green light turn on." Note how long it takes them to figure out they have to coordinate, and how (counting "3, 2, 1", eye contact, someone leading).
4. **Change the window:** try 1000, 500, 250 and 100 ms, about 5 attempts each. Copy the Serial Monitor lines into your doc. Which window feels hard but fair?
5. Ask: "This would be better if…"
6. Photos/video of the circuit and of people pressing together (with consent).

## What to record (real results only)
- Did it detect presses reliably? Any missed or double presses?
- Success rate and press spreads at each window (from the Serial Monitor)
- Solo attempt result
- How groups coordinated; quotes
- Surprises, and what it means for MetamorphUs's controllers
