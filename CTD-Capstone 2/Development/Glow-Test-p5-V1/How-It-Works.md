# Glow test V1: how it works (Nov 15, 2026)

A plain-language explanation of every piece of the p5.js + Arduino glow test, so any of us can explain it.

**How it was made:** built with an AI coding assistant (Claude). Kaitlyn designed and wired the circuit, uploaded and debugged the code, connected it in Chrome and ran the test. Check the course's AI policy for what to disclose when presenting it.

## The four pieces

1. **The circuit** (from our two-button test): two buttons on pins 2 and 3, their LEDs on pins 8 and 9, red LED on pin 11, green LED on pin 12.
2. **`arduino/glow_test_controllers/glow_test_controllers.ino`:** the program on the Arduino.
3. **`display/index.html`:** a tiny web page that loads the p5.js library and our sketch.
4. **`display/sketch.js`:** the p5.js program that draws the world.

Two helpers connect them:

- **The local server** (`python3 -m http.server 8000`) serves the page at `localhost`, because Chrome only allows USB serial access from a secure address like that.
- **Web Serial** is the Chrome feature that lets a web page talk to a USB device.

## How the data flows

**Button → Arduino → USB → Chrome → screen, and back to the LEDs.**

1. **Arduino reads the buttons.** Each pin uses `INPUT_PULLUP`, so it reads HIGH normally and LOW when the button connects it to ground. That is why the buttons need no resistors.
2. **Arduino sends a line of text every 30 ms** at 115200 baud, like `1,0,512,300`. That is button 1, button 2, knob A0, knob A1.
3. **The page reads those lines.** Pressing C runs `connectSerial()`, which opens the port, splits each line at the commas and stores the numbers.
4. **Buttons become element levels.** While a button is held, its level rises (`riseRate`); when it is released, the level drains (`fallRate`). Each level runs from 0 to 1.
5. **Balance check.** Each element has a sweet spot, `band` (0.42 to 0.68). If both are inside it, a `progress` timer counts up; if not, it drains. At 6 seconds (`holdSeconds`) the butterfly starts.
6. **The page sends one letter back:** `G` for both balanced, `R` for only one in its sweet spot, `O` for neither. The Arduino reads the letter and switches the green or red LED.

## How the visuals work

- **`life`** is one number from 0 to 1 that says how alive the world is. It comes from how close both elements are to the sweet spot, plus the hold progress. Nearly everything is drawn from it.
- **Sky and ground:** colours blend from grey-brown (barren) to deep indigo (alive) using `life`. Too much sun tints the sky orange; too much water tints it blue.
- **Plants:** 46 stems at fixed random positions, drawn as curves. Their height and colour depend on `life`.
- **Glow:** a soft dot is drawn once per colour and saved, then stamped many times with "lighter" blending, so overlapping dots add up to brighter light. That is the glow effect, and it is why it runs fast.
- **Particles:** 700 floating dots that drift upward. Their brightness follows `life`.
- **Butterfly:** each particle has a target point on a butterfly-shaped math curve. During the reveal the particles glide to their targets, and the wings "flap" by squeezing the shape's width in and out.

## The steps to build it by hand

1. Wire and test the circuit.
2. Write the Arduino code: read the buttons, print a comma-separated line, listen for a letter.
3. Check the output in the Serial Monitor.
4. Write a p5.js sketch that draws something simple from two numbers, using the keyboard first.
5. Add Web Serial to replace the keyboard with the Arduino's lines.
6. Add the game rules: levels, sweet spot, hold timer.
7. Build up the visuals: sky, plants, glow, particles, butterfly.
8. Add the LED feedback.
9. Test and tune the settings.

## What Kaitlyn did

- Designed and wired the circuit, and fixed the original button-leg bug.
- Uploaded the code and solved the wrong-port error (`usbmodem1101` vs `usbmodem101`).
- Connected it in Chrome and ran the test.
- Chose what the test should show and directed the design.

## To understand it hands-on

Open `display/sketch.js` and change the `SETTINGS` at the top, one at a time, then refresh the page:

| Setting | What it changes |
|---|---|
| `band` | Where the sweet spot is and how wide |
| `riseRate`, `fallRate` | How fast a level rises while held and drains when released |
| `holdSeconds` | How long both must stay balanced for the butterfly |
| `drainRate` | How fast hold progress is lost when balance breaks |
| `revealSeconds` | How long the butterfly flies |

If you can predict what each change does before refreshing, you can explain the test to anyone.
