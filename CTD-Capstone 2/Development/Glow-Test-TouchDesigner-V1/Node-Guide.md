# TouchDesigner node guide: every box in the glow test (Nov 2026)

A detailed reference for every node in `MetamorphUs-Glow-Test-TouchDesigner-V1.toe`: what family it belongs to, what that kind of node does in general, exactly how ours is set up, and what you could change. Understanding these drives the quality of what we build next.

For the short version, see `How-It-Works.md` in this folder. For lessons, see our TouchDesigner hub page.

---

## Part 1: The big picture

### How to describe it

> "It's a chain of CHOPs doing the number work: reading the buttons, turning them into levels that rise and drain, checking the sweet spot, and running the hold timer. Those numbers feed a GLSL TOP that draws the picture with code, then a Bloom TOP adds the glow. A few DATs hold the text: the Arduino's messages, a small Python helper file and the drawing code."

### The node families

Every box in TouchDesigner is an **operator** (a node). Operators come in families, and each family has its own colour and its own kind of data. A wire only joins boxes of the same family.

| Family | Colour | Holds | In our project |
|---|---|---|---|
| **TOP** (Texture Operator) | purple | pictures and video | drawing, glow, output |
| **CHOP** (Channel Operator) | green | numbers that change over time | buttons, levels, timer, smoothing |
| **DAT** (Data Operator) | pink | text, tables and code | Arduino messages, Python, drawing code |
| SOP (Surface Operator) | blue | 3D shapes | not used yet |
| MAT (Material) | yellow | surface looks for 3D | not used yet |
| COMP (Component) | grey | containers for other nodes | the connector box only |

Families can still talk to each other without wires. Any setting can hold a formula that reads another node, like `op('g_life')['life']`. That's how our numbers get into the picture.

### Where code lives (and where it doesn't)

Most nodes have **no code**. They're built-in tools set up through their settings panel. Python and GLSL show up in only three ways:

1. **In a setting:** any setting can hold a one-line Python formula in place of a fixed number. TouchDesigner re-runs it whenever it's needed, usually every frame.
2. **In a text DAT:** longer Python lives in text boxes, like `glow_helpers`.
3. **In a shader:** the GLSL drawing code lives in a text DAT, and a GLSL TOP runs it.

### Every box at a glance

| # | Box | Family | Kind | Has code? |
|---|---|---|---|---|
| 1 | `serial1` | DAT | Serial | No |
| 2 | `glow_helpers` | DAT | Text | Yes: Python helpers |
| 3 | `g_buttons` | CHOP | Constant | Yes: one-line formulas |
| 4 | `g_rate` | CHOP | Math | No |
| 5 | `g_levels` | CHOP | Speed | No |
| 6 | `g_ok` | CHOP | Constant | Yes: one-line formulas |
| 7 | `g_balrate` | CHOP | Select | No |
| 8 | `g_progress` | CHOP | Speed | No |
| 9 | `g_target` | CHOP | Constant | Yes: one-line formulas |
| 10 | `g_life` | CHOP | Lag | No |
| 11 | `g_shader_pixel` | DAT | Text | Yes: GLSL drawing code |
| 12 | `g_shader` | TOP | GLSL | No (runs `g_shader_pixel`) |
| 13 | `g_bloom` | TOP | Bloom | No |
| 14 | `g_out` | TOP | Null | No |
| 15 | `g_led_feedback` | DAT | CHOP Execute | Yes: Python callback |

---

## Part 2: About CHOPs in general

A CHOP holds one or more **channels**. A channel is a named number that changes over time, like `sun = 0.55`. Each CHOP either makes channels, brings them in from outside, or changes the ones it's given. You set it up through its settings panel. No coding is needed.

**CHOPs are not small Python scripts.** They're ready-made number tools that you pick and configure. A few of ours have one-line formulas typed into their settings, but that's extra.

### Kinds of CHOPs

**Ones that make numbers**
- **Constant:** fixed numbers you type in. Ours hold formulas instead.
- **Noise:** a number that wanders randomly.
- **LFO:** a number that swings back and forth in a steady rhythm.
- **Timer:** counts through a set length of time, with start, end and loop.
- **Pattern:** ramps, curves and other shapes.

**Ones that bring numbers in from the world**
- **Mouse In, Keyboard In:** mouse position, key presses.
- **Audio Device In:** sound from a microphone, as numbers.
- **MIDI In, OSC In:** music controllers, and messages from other programs or devices.
- Others for cameras and sensors, like Kinect and Leap Motion.

**Ones that change numbers** (most of ours)
- **Math:** add, multiply, combine channels.
- **Speed:** adds a rate up over time.
- **Lag** and **Filter:** smooth sudden jumps into glides.
- **Limit:** keeps a number inside a range.
- **Logic:** on/off tests like "is this above 0.5?"
- **Count:** counts how many times something happened.
- **Trigger:** turns a press into a shaped pulse that rises and fades.

**Ones that organize**
- **Select:** picks certain channels out of another CHOP.
- **Merge:** joins several CHOPs into one.
- **Switch:** chooses between inputs.
- **Null:** does nothing; it marks an end point.

**Ones for when the built-in tools aren't enough**
- **Expression:** a CHOP where you write a formula for each channel.
- **Script:** a CHOP driven by a full Python script.

We used neither of those two. We put short formulas inside Constant CHOPs, which does a similar job.

---

## Part 3: Every box in detail

### 1. `serial1` (DAT · Serial)

**What a Serial DAT is:** it opens a serial port (like the Arduino's USB connection) and shows each line of text that arrives as a row in a table. It can also send text back out.

**Ours:**
| Setting | Value | Why |
|---|---|---|
| Port | `/dev/cu.usbmodem101` | Where the Arduino shows up on Kaitlyn's Mac |
| Baud Rate | 115200 | Must match `Serial.begin(115200)` in the Arduino code |
| Row/Callback Format | One Per Line | Each message from the Arduino is one line |
| Maximum Lines | 1 | Keep only the newest line, so we always read fresh data |
| Active | On | |

**What it receives:** about 30 lines a second, like `1,0,512,300` = button 1, button 2, knob A0, knob A1.

**Notes:**
- Only one program can use the port at a time. Close the Arduino Serial Monitor and any Chrome tab using the p5 test first.
- If the Arduino is plugged into a different USB port, the port name may change (e.g. `usbmodem1101`). Pick the new one from the Port menu.
- Derivative's guide warns that `println()` can add blank lines on some setups. Ours works as is.

**Docs:** https://docs.derivative.ca/Serial_DAT

---

### 2. `glow_helpers` (DAT · Text)

**What a Text DAT is:** a plain text box. It can hold notes, data or Python code. Other nodes can load the code in it as a module with `mod('name')`.

**Ours holds Python helper functions:**

```python
LO, HI = 0.42, 0.68          # the sweet spot for each element
HOLD = 6.0                   # seconds of balance needed for the butterfly

def field(i):
    """Number i from the newest Arduino line, e.g. '1,0,512,300'."""
    s = op('/project1/serial1')
    try:
        return float(s[s.numRows-1, 0].val.split(',')[i])
    except Exception:
        return 0.0

def ok(v):                    # is this level in the sweet spot? 1 or 0
    return 1.0 if LO <= v <= HI else 0.0

def close(v):                 # how close is it? 1 inside, fading to 0
    if LO <= v <= HI:
        return 1.0
    d = (LO - v) if v < LO else (v - HI)
    return max(0.0, 1.0 - d / 0.4)
```

**Line by line:**
- `LO, HI`: the edges of the sweet spot, on a 0 to 1 scale.
- `field(i)`: reads the newest row of `serial1`, splits it at commas, and returns number *i*. If anything goes wrong (no data yet), it returns 0 instead of crashing.
- `ok(v)`: 1 if the level is inside the sweet spot, 0 if not.
- `close(v)`: 1 inside the sweet spot, then fades to 0 as the level gets 0.4 away. This makes the world brighten gradually as you approach balance, not only once you hit it.

**What you could change:** `LO` and `HI` to move or widen the sweet spot. Note that `HOLD` is written here as a reminder, but the 6-second limit actually lives on `g_progress` (its `max`) and in `g_target`'s formulas, so change those too.

**To view or edit:** click the box, then **Edit** in its settings (or right-click › Edit Contents).

---

### 3. `g_buttons` (CHOP · Constant)

**What a Constant CHOP is:** it outputs channels with fixed values that you type in. Each channel has a name and a value.

**Ours uses formulas instead of fixed values:**

| Channel | Formula | Meaning |
|---|---|---|
| `sun` | `mod('glow_helpers').field(0) + 0*absTime.frame` | First number from the Arduino (button 1) |
| `water` | `mod('glow_helpers').field(1) + 0*absTime.frame` | Second number (button 2) |

**Why the `+ 0*absTime.frame`:** it adds nothing, but mentioning the frame counter forces TouchDesigner to re-check the formula every frame. Without it, TouchDesigner might not notice that `serial1` changed.

**Output:** two channels, each 1 while that button is held and 0 otherwise.

**To see a formula:** click the box. Formula values show in a different colour in the settings; click one to see the text.

---

### 4. `g_rate` (CHOP · Math)

**What a Math CHOP is:** it does arithmetic on every channel it receives: add, multiply, combine channels, change ranges. Its settings are applied in order: pre-add, multiply, post-add.

**Ours:**
| Setting | Value |
|---|---|
| Multiply | 0.62 |
| Post-Add | −0.24 |

**What it does:** it turns each button into a speed.
- Button held (1): 1 × 0.62 − 0.24 = **+0.38 per second** (rising)
- Button released (0): 0 × 0.62 − 0.24 = **−0.24 per second** (draining)

**What you could change:** raise Multiply to make holding rise faster. Make Post-Add more negative to make letting go drain faster. Rising speed is always Multiply + Post-Add.

**Docs:** https://docs.derivative.ca/Math_CHOP

---

### 5. `g_levels` (CHOP · Speed)

**What a Speed CHOP is:** it treats its input as a speed and adds it up over time. Feed it +0.38 per second for 2 seconds and its output rises by 0.76. It's TouchDesigner's way of turning "how fast" into "how much".

**Ours:**
| Setting | Value | Why |
|---|---|---|
| Limit Type | Clamp | Stop at the limits instead of looping |
| Minimum | 0 | An element can't go below empty |
| Maximum | 1 | Or above full |

**What it does:** turns the rising and draining speeds into two **levels**, `sun` and `water`, between 0 and 1. These are the element levels shown on the meters.

**Why this matters for the design:** a button is only on or off, but this makes it feel like you're filling something up. Players keep their element in the sweet spot by pressing and releasing, the same as in the p5.js version.

**Docs:** https://docs.derivative.ca/Speed_CHOP

---

### 6. `g_ok` (CHOP · Constant)

**Another Constant CHOP with formulas.** It checks the rules.

| Channel | Formula (shortened) | Meaning |
|---|---|---|
| `sun_ok` | `ok(sun level)` | 1 if sun is in the sweet spot |
| `water_ok` | `ok(water level)` | 1 if water is |
| `balrate` | `1 if (sun ok and water ok) else -1.5` | Speed for the hold timer |
| `led` | `ok(sun) + ok(water)` | How many are balanced: 0, 1 or 2 |

The full formulas read the levels with `op('g_levels')['sun']` and call the helpers with `mod('glow_helpers')`.

**Why `balrate` is −1.5 when not balanced:** the hold timer drains 1.5 times faster than it fills, so a near miss costs you. Change −1.5 to −0.5 to make it more forgiving, or to −6 to reset almost instantly.

---

### 7. `g_balrate` (CHOP · Select)

**What a Select CHOP is:** it picks certain channels out of another CHOP, by name. Useful when you only want one channel to flow down a chain.

**Ours:** CHOP = `g_ok`, Channel Names = `balrate`.

**Why it exists:** `g_progress` should only receive the timer speed, not all four channels from `g_ok`.

**Docs:** https://docs.derivative.ca/Select_CHOP

---

### 8. `g_progress` (CHOP · Speed)

**Another Speed CHOP.** This one is the **hold timer**.

| Setting | Value |
|---|---|
| Input | `g_balrate` |
| Limit Type | Clamp |
| Minimum | 0 |
| Maximum | 6 |

**What it does:** counts up 1 second per second while both elements are balanced, and drains 1.5 seconds per second when they aren't. At 6 the butterfly is triggered.

**What you could change:** Maximum, to make the hold longer or shorter. If you change it, also change the `6` in `g_target`'s formulas and in `g_shader`'s `uB` input (`/6`).

---

### 9. `g_target` (CHOP · Constant)

**Another Constant CHOP with formulas.** It works out how alive the world should be.

| Channel | Formula (shortened) | Meaning |
|---|---|---|
| `life` | `close(sun) * close(water) * 0.55 + progress / 6 * 0.45` | 0 = barren, 1 = fully alive |
| `reveal` | `1 if progress >= 5.99 else 0` | Turns on the butterfly |

**Reading `life`:** 55% comes from how close both elements are to the sweet spot, and 45% from how far through the hold you are. So the world brightens as you approach balance, then keeps blooming while you hold it.

**Why `close(sun) * close(water)`:** multiplying means both must be close. If either is far off, the product drops toward 0, so one person can't make the world bloom alone.

---

### 10. `g_life` (CHOP · Lag)

**What a Lag CHOP is:** it smooths sudden changes. When its input jumps, its output glides to the new value over a set time. Lag 1 controls how fast it rises; Lag 2 how fast it falls.

**Ours:**
| Setting | Value |
|---|---|
| Input | `g_target` |
| Lag 1 (up) | 0.7 seconds |
| Lag 2 (down) | 0.7 seconds |

**What it does:** smooths `life` and `reveal`, so the world fades in and out and the butterfly gathers gradually instead of popping.

**What you could change:** raise Lag 2 to make the world fade more slowly when balance breaks, so mistakes feel gentler.

**Docs:** https://docs.derivative.ca/Lag_CHOP

---

### 11. `g_shader_pixel` (DAT · Text)

**A Text DAT holding the drawing code**, written in GLSL (the language graphics cards run).

**How a pixel shader works:** the code runs once for **every pixel** of the picture, all at the same time on the graphics card. Each run answers one question: *what colour is this pixel?* It knows where the pixel is (`vUV`) and receives our numbers through inputs called **uniforms**.

**Inputs it receives:**
| Uniform | Contents |
|---|---|
| `uA` | life, sun level, water level, reveal |
| `uB` | time in seconds, hold progress (0 to 1), sun_ok, water_ok |

**Its sections, in order:**
1. **Sky:** blends from barren grey-brown to living night using `life`. Too much sun tints the top orange; too much water tints the bottom blue. The bottom 10% is ground.
2. **Plants:** loops over 40 stems. For each, it works out whether this pixel is near the stem (draw a line) or near one of 3 blossoms (add a soft glowing dot). Stem height, colour and sway all follow `life`, `sun` and `water`.
3. **Fireflies:** loops over 160 dots. Normally they drift upward. When `reveal` turns on, each one glides to its own target point on a butterfly-shaped curve, and the wings flap by squeezing the shape's width.
4. **Meters:** draws the Sunlight and Water bars, their sweet-spot zones, and the hold-progress bar at the bottom left.
5. **Output:** `fragColor = ...` sets the final colour of the pixel.

**Helper functions at the top:**
- `hash(n)`: turns a number into a repeatable "random" number, so each plant and firefly gets its own fixed position and colour.
- `hsv(h, s, v)`: converts a hue/saturation/brightness colour to red/green/blue.
- `seg(p, a, b)`: distance from a pixel to a line segment (used to draw stems).
- `box(...)`: 1 if the pixel is inside a rectangle (used for meters).

**What you could change:**
- `for (int i = 0; i < 40; i++)` in the plants section: number of plants.
- `for (int i = 0; i < 160; i++)` in the fireflies section: number of fireflies.
- Blossom size: the `float r = (.024+.02*...)` line.
- Colours: the `vec3(...)` values in the sky section.

**Note:** the drawing is all in one code box rather than many small nodes. That made it fast to build but harder to adjust by hand than a node network. A future version could draw plants with instanced geometry or particle nodes instead.

**Docs:** https://docs.derivative.ca/GLSL_TOP and https://docs.derivative.ca/Write_a_GLSL_TOP

---

### 12. `g_shader` (TOP · GLSL)

**What a GLSL TOP is:** a picture node that runs your own shader code to make an image.

**Ours:**
| Setting | Value |
|---|---|
| Pixel Shader | `g_shader_pixel` |
| Output Resolution | Custom, 1280 × 720 |
| Uniform `uA` | `op('g_life')['life']`, `op('g_levels')['sun']`, `op('g_levels')['water']`, `op('g_life')['reveal']` |
| Uniform `uB` | `absTime.seconds`, `op('g_progress')['balrate']/6`, `op('g_ok')['sun_ok']`, `op('g_ok')['water_ok']` |

**This is the bridge between the numbers and the picture.** The uniform settings are formulas that read the CHOPs every frame and pass the results into the shader.

**Resolution:** 1280 × 720 fits under the free license's 1280 × 1280 cap. A full-HD screen (1920 × 1080) would need the Educational license.

---

### 13. `g_bloom` (TOP · Bloom)

**What a Bloom TOP is:** it finds the bright parts of a picture, blurs them, and adds them back on top. Bright things look like they're glowing.

**Ours:**
| Setting | Value | What it means |
|---|---|---|
| Bloom Intensity | 0.7 | How strong the glow is (default 1) |
| Bloom Threshold | 0.5 | How bright a pixel must be to glow (default 0.01) |

**Why these values:** at the defaults everything glowed and the blossoms washed out to white. Raising the threshold means only the brightest parts glow, which keeps the plants and butterfly readable.

**What you could change:** lower the threshold or raise the intensity for a dreamier, softer look; the reverse for a crisper one. Also try Min and Max Bloom Radius for the size of the glow.

**Docs:** https://docs.derivative.ca/Bloom_TOP

---

### 14. `g_out` (TOP · Null)

**What a Null TOP is:** it passes the picture through unchanged. It's used as a clean, named end point.

**Why it's useful:** anything that needs "the final picture" (a full-screen window, a recording, a projector output) can point at `g_out`. You can then change what feeds into it without breaking those connections.

**Ours:** it's also set as the network background, so you see the output behind the nodes.

---

### 15. `g_led_feedback` (DAT · CHOP Execute)

**What a CHOP Execute DAT is:** a text box of Python that runs when a CHOP's numbers change. You choose which CHOP to watch and which events to respond to (value changes, going on, going off).

**Ours:**
| Setting | Value |
|---|---|
| CHOP | `g_ok` |
| Channel | `led` |
| Value Change | On |

**Its code:**

```python
def onValueChange(channel, sampleIndex, val, prev):
    if channel.name == 'led':
        op('/project1/serial1').send('O' if val < 0.5 else ('R' if val < 1.5 else 'G'))
    return
```

**What it does:** whenever the number of balanced elements changes, it sends one letter to the Arduino through `serial1`:
- `O` (0 balanced): both LEDs off
- `R` (1 balanced): red LED, "half right"
- `G` (2 balanced): green LED, success

The Arduino code reads the letter and switches the LEDs.

**Why only on change:** sending only when the value changes, not every frame, keeps the USB connection quiet.

**Docs:** https://docs.derivative.ca/CHOP_Execute_DAT

---

## Part 4: Following one button press through the whole chain

1. You press button 1. The Arduino sends `1,0,512,300`.
2. `serial1` shows that line.
3. `g_buttons` reads it with `field(0)`: `sun = 1`.
4. `g_rate` turns that into +0.38 per second.
5. `g_levels` adds it up: the sun level climbs.
6. When the level passes 0.42, `g_ok` sets `sun_ok = 1` and `led = 1`.
7. `g_led_feedback` sees `led` change and sends `R`. The red LED turns on.
8. The other person brings water into the sweet spot too. `led = 2`, so it sends `G` and the green LED turns on. `balrate = 1`, so `g_progress` starts counting.
9. `g_target` raises `life`, `g_life` smooths it, and `g_shader` draws the world brighter.
10. After 6 seconds held, `reveal = 1`, and the fireflies gather into the butterfly.
11. `g_bloom` adds the glow, and `g_out` shows the result.

---

## Part 5: Ideas for the next version

- **More elements:** add more channels to `g_buttons` and `g_ok` (heat, wind, nutrients), and more uniforms to the shader.
- **Knobs instead of buttons:** read `field(2)` and `field(3)` directly as levels, skipping `g_rate` and `g_levels`.
- **A surprise event:** a **Timer** or **Noise** CHOP that occasionally pushes one level up or down (a drought).
- **Sound:** an **Audio File In** CHOP, with its volume following `life`.
- **A node-based look:** draw plants with instanced geometry or particle nodes, so they can be adjusted without editing shader code.
- **Austin's models:** bring Blender models in as FBX or OBJ through a Geometry COMP.
