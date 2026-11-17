# Glow test in TouchDesigner V1: how it works (Nov 15, 2026)

A plain-language explanation of every node in the TouchDesigner glow test, so any of us can explain it.

**How it was made:** built with an AI coding assistant (Claude) working inside the open TouchDesigner project. Kaitlyn wired the circuit, set up the Serial node, ran the test with the Arduino and confirmed it works. Check the course's AI policy for what to disclose when presenting it.

**Files**

- `MetamorphUs-Glow-Test-TouchDesigner-V1.toe`: the project (clean copy).
- Arduino code: `../Glow-Test-p5-V1/arduino/glow_test_controllers/glow_test_controllers.ino`. It is the same code as the p5.js test, with no changes.

## The idea

TouchDesigner is a chain of boxes (nodes). Data flows through them from left to right, and each box does one small job. There are three kinds of data in this project:

| Type | Holds | In this project |
|---|---|---|
| **DAT** | text and tables | the Arduino's messages, and the code |
| **CHOP** | numbers that change over time | the button levels, the 6-second timer, how alive the world is |
| **TOP** | images | the glowing picture |

## The chain, in order

| Step | Node(s) | Type | What it does |
|---|---|---|---|
| 1 | `serial1` | DAT | Listens to the Arduino on the USB port at 115200 baud. Keeps only the newest line, like `1,0,512,300` (button 1, button 2, knob 1, knob 2). |
| 2 | `glow_helpers` | DAT | A small Python file. `field(i)` picks number *i* out of the newest line. `ok(v)` and `close(v)` check the sweet spot. |
| 2 | `g_buttons` | CHOP | Two channels, `sun` and `water`: 1 while that button is held, 0 otherwise. |
| 3 | `g_rate` | CHOP | Turns each button into a speed: held is +0.38 per second, released is −0.24 per second. |
| 3 | `g_levels` | CHOP | Adds that speed up over time and clamps it between 0 and 1. These are the element levels. |
| 4 | `g_ok` | CHOP | Checks whether each level is in the sweet spot (0.42 to 0.68). Also outputs `led`: how many elements are in it (0, 1 or 2). |
| 4 | `g_balrate`, `g_progress` | CHOP | The hold timer. It counts up while both are balanced, drains faster when not, and runs from 0 to 6 seconds. |
| 5 | `g_target` | CHOP | Combines closeness to the sweet spot with hold progress into `life` (0 to 1). Sets `reveal` to 1 when the timer reaches 6 seconds. |
| 5 | `g_life` | CHOP | Smooths `life` and `reveal`, so the world fades instead of jumping. |
| 6 | `g_shader_pixel` | DAT | The drawing code (GLSL). It runs once for every pixel. |
| 6 | `g_shader` | TOP | Runs that code at 1280 × 720. It receives `life`, the two levels, `reveal`, the time and the hold progress, and draws the sky, 40 plants, blossoms, 160 fireflies, the butterfly and the meters. |
| 7 | `g_bloom` | TOP | Adds the glow by brightening and blurring the bright parts. |
| 7 | `g_out` | TOP | The final picture. |
| 8 | `g_led_feedback` | DAT | Watches `led` in `g_ok`. When it changes, it sends one letter back through `serial1`: `O` for none, `R` for one element in its sweet spot, `G` for both. |

## How it differs from the p5.js version

- **Where the logic lives:** here it is spread across small number nodes. In p5.js it is all in one code file.
- **The butterfly:** here it stays for as long as both people hold the balance, and scatters when one lets go. In p5.js it flies for a set time, then resets.
- **The glow:** the Bloom node is built in. In p5.js we stamp soft dots by hand.
- **Resolution:** the free TouchDesigner license caps output at 1280 × 1280.

## To understand it hands-on

- Click any node and look at its settings on the right.
- Click `g_levels` and watch its numbers move while you press the buttons.
- On `g_bloom`, change **Bloom Intensity** and **Bloom Threshold** and watch the glow change.
- In `glow_helpers`, change `LO` and `HI` to move the sweet spot, or `HOLD` for the hold time (also change the `max` on `g_progress` to match).
- On `g_rate`, change **Multiply** and **Post-Add** to make the levels rise or drain faster.
