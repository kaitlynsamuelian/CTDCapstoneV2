# MetamorphUs glow test V1: p5.js with Arduino (Nov 15, 2026)

**Question this test answers:** can p5.js give us the glowing, layered look we want, run smoothly, and respond live to our Arduino controllers? It is the p5.js half of the "choice of display tool" glow test in our timeline. The TouchDesigner half would build the same scene for comparison.

**Status:** built by Claude and checked with screenshots in keyboard mode. **Not yet tested with the Arduino plugged in.** Fill in "What to record" with real results only.

## What it does
- Two elements: **Sunlight** and **Water**. Each has a sweet spot (the bright zone on its meter).
- Out of balance, the world is barren and grey. As both come into the sweet spot, plants grow and glow.
- More sun shifts colours warmer; more water shifts them bluer. Too much of either tints the sky.
- Hold both in balance for 6 seconds and the glowing petals form a butterfly, then it resets.
- The page talks back to the Arduino: **red LED** = only one element is in its sweet spot ("half right"), **green LED** = both are.

## Wiring
**Same as our two-button cooperative test. Nothing to rewire.**

| Part | Pin |
|---|---|
| Button 1 (Sunlight) | pin 2 and GND |
| Button 2 (Water) | pin 3 and GND |
| Button 1 LED / Button 2 LED | pins 8 / 9 |
| Red LED / Green LED | pins 11 / 12 |
| Optional knobs | middle legs to A0 (Sunlight) and A1 (Water), outer legs to 5V and GND |

In buttons mode, holding a button raises that element and letting go lets it drain, so you keep it in the sweet spot by pressing and releasing.

## Run it
1. **Upload the Arduino code:** open `arduino/glow_test_controllers/glow_test_controllers.ino` in the Arduino IDE, pick **Arduino Uno** and the port, click **Upload**. Then **close the Serial Monitor** (only one program can use the port).
2. **Start the page:** in Terminal, `cd` into this folder's `display` folder and run `python3 -m http.server 8000`.
3. In **Chrome**, open `http://localhost:8000`.
4. Press **C**, choose the Arduino's port, click **Connect**.
5. Two people each take a button and try to bring the world to life.

No Arduino? Hold **A** (Sunlight) and **L** (Water) on the keyboard. `http://localhost:8000/?demo=reveal` jumps straight to the butterfly.

**Keys:** C connect · M switch buttons/knobs · + / − more or fewer glowing particles · H hide the overlay · R restart

## What to record (real results only)
- Did the Arduino connect and drive the world? Any lag you could notice?
- Frames per second (top left) at 700 particles, and after pressing + a few times. Where does it start to stutter?
- Did the red and green LEDs follow the screen?
- How did the glow look on the big screen compared with our teamLab references?
- How long did two people take to reach the butterfly? What did they say?
- For the comparison with TouchDesigner: look, smoothness, how easy it was to adjust.

## Settings to try
At the top of `display/sketch.js`: the sweet-spot `band`, `riseRate` and `fallRate` (how twitchy the buttons feel), and `holdSeconds`.
