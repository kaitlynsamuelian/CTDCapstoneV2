# Synchrony Reward: Sounding Board Notes

Nov 5, 2026 · KAITLYN

Live version (editable): https://claude.ai/artifact/NcFeuXz8MfdD2xzhMF3SUF

## The idea in plain words

**Synchrony Reward is an interactive piece that senses how many people are standing in front of it and shows a different image for each group size.** One person might see a single leaf, a small group sees a tree, and a big group sees a whole forest. Nobody sees the full story alone, so the reward for gathering is the bigger picture.

**Why it matters (draft, in our words to rewrite):** it is about connection. In a world that can feel cold and isolating, it uses technology to reward people for coming together, even strangers. The audience is anyone walking through a public space like the ATLAS Expo, alone or in groups.

**Where we actually are (be honest about this in the meeting):**

- We are **leaning** toward this idea. It is not locked, and nothing is recorded as a final decision yet.
- The **form is open**. It is not necessarily a wall. We are comparing a physical split-flap, a screen or projection, and three other physical options below.
- The name comes from an earlier concept where two people had to breathe or move in sync to clear the image. Group size is now the main rule. Syncing up (for example, the image only settles when the group moves or breathes together) is an **optional extra layer**, not part of the core plan.
- The images themselves (leaf, tree, forest is a placeholder) and the number of group-size steps (we have been using 1, 3 and 6+ people) are not decided.

**How every version works, whatever the form:**

1. **Sense.** A sensor estimates how many people are in the viewing area. The cheapest option is a laptop webcam running a free person-detection model.
2. **Decide.** A short program turns the count into a group-size step (1, 3, 6+). It waits a couple of seconds before switching, so the image doesn't flicker when someone walks past.
3. **Show.** The display changes to that step's image. This is the only part that changes between forms.

Because steps 1 and 2 are the same for every form, we can build and test them now, before we pick the form.

**Drafts we can show:** form renderings at two sizes, medium (48 x 30 in) and large (72 x 45 in), in the project files under `renderings-2026-11-04/v3-medium-large/`, plus 13 concept animations from Oct 28 (`animations-2026-10-28/`, the group-size one is `07-group-size.mp4`). The renderings are rough drafts made with code, not final designs.

## How each form works

All five use the same sensing and deciding steps above. Physical forms add one small ESP32 board that the laptop talks to over USB, which runs the motor or lights. Ratings are our judgment from how each form works, not tested results. Costs are from the parts list (see Costs below).

### 1. Physical split-flap (most wow factor, most work)

**What it is:** like an old airport departure board, but each little module shows one square of a picture instead of a letter. Hundreds of modules together make the whole image, and they flip to change it.

**How it works:**

- Each module is a 3D-printed spool holding 4 small flaps. Each flap is printed with one square of an image.
- Modules sit on a steel axle, one axle per row. A belt links all the rows to **one geared stepper motor**, so every row turns together. That keeps it to one motor instead of hundreds.
- A small magnet sensor (hall sensor) marks the "home" position, so the controller knows exactly when to stop on the right image.
- Images are made in any design software, then a short script shrinks each one to the grid and cuts it into labeled squares for printing on cardstock or sticker vinyl.

**Components:** about 228 modules (medium, 19 x 12) or 522 (large, 29 x 18), 3D-printed spools, steel rods, belt and pulleys, NEMA 17 stepper motor and driver, ESP32, 12V power supply, webcam or laptop camera, plywood frame.

- **Color:** full color, because the flaps are printed.
- **Number of images:** 4 at most (one per flap), so 3 group-size images plus a blank or reset state.
- **Fun factor:** high. People see and hear it clack into place, and rows can flip in a cascade.
- **Image clarity:** good for bold, simple images. The image is only 228 to 522 "pixels", so fine detail is lost.
- **Biggest risks:** amount of work (522 spools is roughly 175+ hours of 3D printing at 20 to 30 min each), flaps lining up precisely, axles sticking over long rows, and the noise in a busy expo.
- **Feasibility test:** build one row (or a 4 x 4 patch) driven by the motor, switched by the camera count.

### 2. Digital version: screen, projection, or digital split-flap

**What it is:** the same idea shown on a TV or projector. It can look like a split-flap (animated flaps flipping, with a recorded clack sound) or use any other transition.

**How it works:** one laptop does everything. It counts people, picks the image, and runs a web page (p5.js or Three.js) that draws the grid and animates the flip. There is no motor, no microcontroller and no printing.

**Components:** laptop, webcam, a 55 in TV (medium) or a projector on a white wall or muslin (large), speakers.

- **Color:** full color.
- **Number of images:** unlimited, and they can be changed any time.
- **Fun factor:** lowest on its own, because it can read as "just a screen". We can raise it by projecting onto a fabricated relief wall (laser-cut or foam tiles at different depths) so the image falls on real shapes and casts real shadows.
- **Image clarity:** best of all the options. A cheap projector needs a fairly dark spot.
- **Biggest risks:** low technical risk. The main risk is the experience feeling less physical and less novel.
- **Feasibility test:** browser grid with 2 to 3 test images, hooked to the live camera count, viewed on a projector at real distance.

### 3. Layered light box

**What it is:** a glowing frame where different pictures light up depending on group size. No moving parts.

**How it works:** three clear acrylic sheets are stacked in a frame, each with one drawing etched or sanded into it. Each sheet has its own LED strip along its edge. When a sheet's LEDs turn on, light travels through the acrylic and only that sheet's drawing glows. The controller switches which layer is lit (and can fade between them).

**Components:** 3 clear acrylic sheets, 12V LED strips, MOSFETs (simple switches so the ESP32 can turn strips on and off), ESP32, power supply, frame.

- **Color:** one color per layer from the LED, or a tint. A related cheaper idea (one print that shows different pictures under red, green or blue light) hasn't been priced.
- **Number of images:** one per sheet, so 3 (more sheets means more images and more cost).
- **Fun factor:** medium. It glows and fades, which is calm and magical but not kinetic.
- **Image clarity:** good for line drawings. Etched lines glow clearly, but it is not photo quality.
- **Biggest risks:** the sheets are bigger than most laser cutter beds, so the drawings may need hand sanding through a vinyl stencil. The acrylic is expensive at the large size.
- **Feasibility test:** one small acrylic piece with an etched drawing, edge-lit by an LED strip, switched on by the count.

### 4. Rotating prism strips

**What it is:** a row of tall, thin triangular bars. Each bar has a slice of a different image on each of its three faces. When the bars turn together, the whole picture changes, like old rotating billboards.

**How it works:** the prisms are made of corrugated plastic (coroplast) and spin on 3D-printed end caps. A belt connects them all to one stepper motor. Each image is printed as a poster, cut into strips and glued onto one face of every prism. A home sensor makes sure each turn lands exactly on a face.

**Components:** 19 prisms (medium, 30 in tall) or 29 (large, 45 in tall), coroplast, poster prints, 3D-printed caps, belt, stepper motor and driver, ESP32, frame.

- **Color:** full color, because the faces are printed.
- **Number of images:** 3 (one per face).
- **Fun factor:** high. The bars turn in a satisfying wave, and it is clearly a physical machine.
- **Image clarity:** sharp printed images, but split into only 19 to 29 vertical strips, with thin gaps between them.
- **Biggest risks:** keeping the faces perfectly aligned, and the poster printing cost.
- **Feasibility test:** 3 to 5 small prisms on one belt, flipping between 3 test images when the count changes.

### 5. Shadow box

**What it is:** a lit box with paper-cut layers inside, like a diorama. More layers rise into the light as the group grows: leaf, then tree, then forest.

**How it works:** cutout layers made of foam board hang on cords in front of a lamp, with a muslin screen in front. One motor winds a single cord. Each layer's cord has a different amount of slack, so winding further lifts more layers into the light. The images have to be designed so they add up (the tree drawing still contains the leaf).

**Components:** foam board cutouts, muslin, LED clamp lamp, one stepper motor and driver, cord and printed pulleys, ESP32, box frame.

- **Color:** limited. It is mostly silhouettes and shadows, with color possible from colored lights or gels.
- **Number of images:** about 3, and each one builds on the last.
- **Fun factor:** medium to high. It has depth and a handmade, theatrical feel.
- **Image clarity:** good for bold silhouettes, not detailed images.
- **Biggest risks:** the cords tangling or jamming, and the images being limited to stacking layers.
- **Feasibility test:** a shoebox-scale version with 3 layers and one motor.

### Also considered

- **Tilting tiles** (closest to Daniel Rozin's Wooden Mirror): one servo per tile tilts it toward or away from a light. It is beautiful, but grayscale only, and it needs 228 to 522 servos, so it is the most expensive ($815 to $1,826) and riskiest.
- **Scrolling banner:** one motor winds a printed fabric roll holding all 3 images. It is mid-priced ($284 to $559) and simple, but less surprising to watch.

## Side by side

**Split-flap and prism strips best match our goal of "fun and physical, but the images still read clearly". The screen is the safest and clearest, and the light box and shadow box are the cheapest physical options.** Ratings are our judgment, not tested.

| Form | Fun / physical | Image clarity | Color | Images | Motors | Build effort | Medium cost (48 x 30 in) | Large cost (72 x 45 in) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Physical split-flap | High | Good if images are bold (228 to 522 squares) | Full | 3 + blank | 1 | High | $300 to 340 + flap printing | $482 to 542 + flap printing |
| Screen / projection / digital split-flap | Low on its own | Excellent | Full | Unlimited | 0 | Low | $119 to 198 ($0 if borrowed) | $119 to 159 ($0 if borrowed) |
| Layered light box | Medium (glows, no motion) | Good for line drawings | Light color per layer | 3 | 0 | Medium | $310 to 350 | $736 to 796 |
| Rotating prism strips | High | Sharp but in 19 to 29 strips | Full | 3 | 1 | Medium | $378 to 418 | $655 to 715 |
| Shadow box | Medium to high | Good for silhouettes | Limited | About 3, stacking | 1 | Low to medium | $164 to 204 | $240 to 300 |
| Tilting tiles (also considered) | High | Lowest (grayscale) | Light only | Unlimited | 228 to 522 servos | Very high | $815 to 855 | $1,766 to 1,826 |

The split-flap image count could go up with more flaps per spool, but that means more printing and bigger spools.

## Scope, feasibility and costs

**The cheapest physical build is about $164 (shadow box, medium) and the priciest realistic one is about $800 (light box, large), before tax, shipping and spares. Tilting tiles would be $815 to $1,826. Our team budget and any funding are still unknown.**

### How sure we are about the prices

- **Checked:** almost every part in the table above was priced from a real store listing opened on Nov 4, 2026 ([Parts Lists and Prices](https://claude.ai/artifact/ELo3btAt5CAn5mz888XWMV)). Prices change, and several items were out of stock that day.
- **Estimated:** wood for frames ($40 to 80 medium, $60 to 120 large), the fabric print for the banner, and how much plastic each spool uses.
- **Not priced:** printing the split-flap flaps, sales tax, shipping, tools, paint, and spares. Plan to add **15 to 20%** for spares and mistakes.
- **Older numbers:** the earlier Tech Paths V2 doc used rough guesses (for example $350 to 550 for split-flap). Use the parts list numbers instead.
- Every physical form shares a **$44.90 controller kit** (ESP32 board and 12V power supply). The laptop runs the people counter with its own camera. A $29.99 webcam is optional.

### What is easy vs. hard

| Part | How proven it is | Notes |
| --- | --- | --- |
| Counting people with a webcam | Common, free tools exist | Accuracy with crowds, bad lighting and people overlapping is untested by us |
| Turning a count into an image (with a hold delay) | Simple code | Can be built and tested this week |
| Screen or projection display | Simple code | Lowest risk |
| One motor driving many rows (split-flap, prisms) | Known technique | Alignment and friction over long rows is the main unknown |
| Edge-lit acrylic layers | Known technique | Sheet size vs. laser cutter bed is the main unknown |
| Hundreds of servos (tiles) | Known but heavy | Wiring, power and cost make it a stretch for one semester |

### Time and skills (rough)

- **Split-flap:** 3D modeling one spool design (Fusion 360, Onshape or Tinkercad), then 175+ hours of printing for 522 spools unless laser-cut parts are allowed. Plus image slicing script, assembly, motor wiring and tuning.
- **Prism strips:** cutting and gluing 19 to 29 prisms, printing caps, belt and motor tuning.
- **Light box:** etching or sanding 3 drawings, LED wiring, frame building.
- **Shadow box:** cutting foam board layers, cord and pulley rigging, lighting.
- **Screen:** coding in p5.js or Three.js, plus optional fabrication (frame or relief wall for projection).
- Shared by all: people-counting code, image design, a frame (woodworking), and documentation.

### Our team

We are a team of 4 (Kaitlyn plus 3 partners). The feasibility test ideas doc splits work into sensing, mechanism, logic and experience, and screen, audience and visuals ([Feasibility Test Ideas](https://claude.ai/artifact/Bc7qi2SBHpSQDz5xeqhUnX)). Final roles are not set.

## Sensing, privacy, expo needs and backup plans

### Ways to count people

| Option | How it works | Pros | Cons |
| --- | --- | --- | --- |
| Webcam + person detection | A free model on the laptop counts bodies in the camera view | Cheapest, most accurate, already have it | Privacy concerns; struggles with crowds and bad light |
| Depth camera | Senses shapes and distance, not faces | Better privacy, handles overlap | Costs more, may be borrowable |
| Floor pressure mats or zones | Each mat detects someone standing on it | No camera at all, very clear "stand here" cue | Counts mats, not people; wear and tripping |
| Distance sensors in the ceiling or frame | Each sensor detects someone below or in front | Cheap, no camera | Coarse; needs several sensors |

**Privacy plan we can propose:** count only, process on the laptop, never save or upload video, and post a small sign saying the piece counts people but records nothing. If the original synchrony layer is added (breathing or moving in sync), that would involve body signals, which needs extra care and consent.

### Expo and space needs (to confirm)

- Wall space or a free-standing frame for 48 x 30 in or 72 x 45 in, and whether we can mount to walls.
- A power outlet nearby (laptop, 12V supply, lamp or projector).
- Lighting: a projector or light box needs a fairly dark spot, while prints need good light without glare.
- Noise: the split-flap clacks. That is part of the fun, but it might matter next to other projects.
- A clear standing area in front so the counter can see the group.
- Setup time and storage between test sessions.

### Borrowing instead of buying

Things we might borrow from ATLAS, the library or the makerspace: a projector, a TV, webcams or a depth camera, microcontrollers, power supplies, and time on the 3D printers and laser cutter. A borrowed projector alone makes the screen version close to $0.

### Hybrid plan (a path we're considering)

1. **Now:** build the people counter and the count-to-image logic, plus a **digital simulator** in the browser that shows our images in each form. This doubles as a technical test and a rendering.
2. **Next:** build a **small physical patch** of the top physical form (for example one split-flap row or a 4 x 4 patch, or 3 to 5 prisms) and connect it to the counter.
3. **Spring:** scale the physical piece up if the patch works and the budget allows.

### Fallback plan

- If the full physical piece is too costly or unreliable, show a **smaller physical section next to the digital full-size version**, so people still see the vision.
- If a mechanism fails late, switch to a simpler physical form that uses the same counter and images (light box or shadow box).
- The screen version is always a working backup, because it uses the same counter and code.

## Open decisions, timeline and questions

### Still open

- [ ] Commit to group-size image as our idea (currently leaning only)
- [ ] Which form: physical split-flap, screen, light box, prism strips, shadow box, or a hybrid
- [ ] Size: medium (48 x 30 in) or large (72 x 45 in)
- [ ] What the images are and what story they tell (leaf, tree, forest is a placeholder)
- [ ] Group-size steps (1, 3, 6+?) and what happens in between
- [ ] Whether to keep the synchrony layer (moving or breathing together) as an extra
- [ ] How we count people (camera or no camera)
- [ ] Budget, and who pays
- [ ] Team roles

### Timeline as we understand it (needs confirming)

| When | What | Certainty |
| --- | --- | --- |
| Fri Nov 6 | Feasibility tests due on Canvas | We saw an extension, new date unconfirmed |
| Nov 2 to 13 | Main experiments and feasibility tests | Team plan |
| Nov 9 | Start renderings | Team plan |
| Wed Nov 18 | Wrap follow-up experiments | Team plan |
| Fri Nov 20 | Proposal and pitch drafts ready | Team plan |
| Nov 30 to Dec 4 | Faculty panel pitch and final proposal | Assumed, date unconfirmed |
| Spring 2027 | Build, user testing, ATLAS Expo | Course plan |

Experiment count also needs confirming: our team target is 3 to 4 mini-experiments per person (at least 1 technical), while the RMPP document says 3 to 6 per person including 1 to 3 technical. The feasibility assignment itself asks for at least 3 tests per project, with every member testing throughout.

### Questions to ask

**Idea and scope**

- Does group-size image feel like the right scope and ambition for a senior capstone team of 4?
- Which form do you think best fits our budget, timeline and skills?
- Is a screen-based version acceptable, or is a physical piece expected?
- Would a small physical section plus a digital full-size version be acceptable for the expo?
- What are the biggest risks or blind spots you see? Any precedents or people we should look at?
- Does the meaning (connection, rewarding people for gathering) come through, or does it feel like tech for tech's sake?

**Money and resources**

- Is there a budget cap or expected range for projects?
- Is there any funding (department, ATLAS, makerspace, grants)? Do they reimburse or buy directly?
- What can we borrow (projectors, TVs, cameras, depth sensors, microcontrollers)?
- Lab and shop access: hours, training, and 3D printer and laser cutter availability. Can we laser-cut spools instead of printing 522 of them? What is the laser bed size?

**Timeline**

- What is the confirmed feasibility test deadline after the extension, and does it apply to everyone?
- What is the final proposal due date, and is there a draft or check-in before it?
- When is the Week 14 panel?
- If parts take time to ship, can tests be proof-of-concept with parts we already have?

**Feasibility tests**

- Are our planned tests right: people counter, count-to-image logic, one physical module, screen version, audience tests, renderings?
- Does our four-person split satisfy "every member testing throughout"?
- Can one experiment cover two test types, and how do we document that?
- Do renderings made now count as new work?
- Is 3 to 4 experiments per person enough, or do you expect 3 to 6?

**Other**

- Is a camera-based people counter okay at the expo, or should we use a non-camera sensor?
- Expo logistics: space, power, mounting, lighting and noise limits for whatever form we pick.
- Expert interviews and outside advisor: who counts, and can you suggest someone?
- What separates a strong feasibility submission from an acceptable one?

**If time is short:** dates first, then which form fits our scope and budget, then funding and borrowing, then test confirmation.

### Notes from the meeting

- Feedback on the idea:
- Recommended form and scope:
- Budget and funding:
- Dates confirmed:
- Next steps:

### Sources

- [Parts Lists and Prices: Medium and Large Builds](https://claude.ai/artifact/ELo3btAt5CAn5mz888XWMV) (Nov 4)
- [Group-Size Image: Tech Paths V2 (with pricing)](https://claude.ai/artifact/BmBigdDwnz2umQrhG8bokX) (Nov 2, rough estimates)
- [Feasibility Test Ideas: Group-Size Image](https://claude.ai/artifact/Bc7qi2SBHpSQDz5xeqhUnX) (Nov 4)
- [Flip Wall + Synchrony: Where They Overlap](https://claude.ai/artifact/PLJKaQjEszEEP68HDWWAEW) (Oct 28)
- Renderings: project files `renderings-2026-11-04/v3-medium-large/`
