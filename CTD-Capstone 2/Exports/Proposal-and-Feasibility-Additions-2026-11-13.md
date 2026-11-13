# Paste-ready additions: Capstone Proposal + Feasibility Tests Summary (Nov 13, 2026)

Drafts for the team to review, edit and own before pasting. Facts come from our real tests, interview notes and sourced research; `[brackets]` mark what only the team can fill in. Interviewees are referred to by interview number; use names only with their consent.

---

## Part 1: ATLAS Capstone Proposal

### Elevator pitch (limit 250 characters; current draft is 261, 11 over)
Option A (228 characters):
> What if strangers could become Mother Earth together? In MetamorphUs, people work together to restore a living ecosystem, overcome environmental challenges, and awaken a magical butterfly, showing the power of collective action.

Option B (229 characters):
> What if strangers could become Mother Earth together? MetamorphUs is an interactive installation where people restore a living ecosystem, overcome environmental challenges and awaken a magical butterfly through collective action.

### Description (limit 750 characters)
Both drafts fit (727 and 749 characters). Version 2 is at 749, so any edit pushes it over. Pick one version and delete the other. Version 1 mentions environmental crises, which our interview strongly supported; version 2 does not.

### Project renderings: caption updates
Two current captions describe the earlier group-size idea ("0 people present" / "all participants present"). Suggested replacements:
- "An example plant when the elements are out of balance: dry, grey and wilting."
- "The same plant when every element is held in balance: glowing and in bloom."

Visuals worth adding, each with a caption (now made: see `Media/renderings-2026-11-13/` and its `CAPTIONS.md`):
- **System diagram:** physical controllers → Arduino → computer → screen, with the no-playing-alone rule. Caption: "How MetamorphUs works: each controller sends its element’s level to the computer, which checks the balance rules and grows the world."
- **Hero shots from our animation** (`Media/animations-2026-11-11/`): the barren world, the glowing forest, the flower butterfly. Caption: "Animation of one possible version: the world starts barren, glows when balanced, and transforms into a butterfly made of petals."
- **The installation in the space** with dimensions in inches: [footprint, screen size, controller spacing].

### Precedents Research Findings (draft, if your Precedents assignment doc has no final findings yet)
> Our research looked at three kinds of precedents. Immersive digital ecosystems by teamLab (Story of the Forest; Animals of Flowers, Symbiotic Lives) showed us that a living digital world feels worth caring for, and that a creature made of many small pieces, like our butterfly, feels magical, but in those works visitors never need each other. 21 Balançoires, public musical swings in Montreal where strangers who swing in unison unlock secret melodies, is the closest match to our goal: a familiar action and a hidden reward that only cooperation unlocks, though it can still be enjoyed alone. Co-op controller games from alt.ctrl.GDC (Cosmic Crew, Two By 4 Racing) proved that split roles at physical stations make people talk and can be built with Arduino. One of them, Vaccination, failed as a single-player prototype that overwhelmed new players and worked once split between two people. MetamorphUs combines these: a living world that only thrives when 4 to 5 strangers cooperate. Full research: https://claude.ai/artifact/LGZw3BPmUsR6aa8cANnUJo

### Summary of Findings from Interviews (draft)
> i) Who: [number] people from our projected audience: [e.g. CU students and Expo-style visitors], plus our faculty sounding board (Aidan Chopra, Nov 6).
> ii) Why: they represent the strangers who would encounter MetamorphUs in a public space; Aidan brings expertise in [3D modeling and fabrication].
> iii) Main findings so far (Interview 2; more in progress): the experience exists. Our interviewee once moved a fallen tree out of a road with strangers and “felt empowered and connected,” without anyone saying a word. They would feel comfortable cooperating with strangers if there is a shared goal, and their first reaction was that it “requires a lot of communication.” With no instructions, they imagined a lever with a sweet spot in the middle, which matches our balance mechanic. Environmental challenges like droughts or storms would “invoke more conversation and collaboration,” and the butterfly would feel earned if it were difficult. They suggested lighting up where to stand, a reward that uses sound, light and controller vibration, and making events scientifically realistic.

### Outside Advisor
Check that Aidan Chopra is not your course instructor: the proposal requires an advisor “other than your instructor.” If he is, add a second advisor.

### Link to Final Pitch Presentation Slides
If you present the Claude deck, export it to Google Slides from its Share menu, or link it directly: https://claude.ai/artifact/TkqXtZZ6X44ZzAqWZ7hT9z

---

## Part 2: Feasibility Tests Summary

### What is your proposed project / domain & problem you are designing around? (currently blank)
> MetamorphUs is an interactive installation in the domains of social connection, collective play and environmental interdependence. Strangers in public spaces stand side by side but rarely interact; the U.S. Surgeon General reported in 2023 that about half of U.S. adults felt measurable loneliness even before COVID-19. We are designing an experience where connecting with strangers is the only way to succeed: 4 to 5 people each control one element of a dying digital ecosystem, and only by keeping all elements in balance together can they bring it to life and transform it into a glowing butterfly.

### List each test, with who did it
Add a name to each test (for example: Renderings: [name]; Interviews: [name]; Technical tests: [name]; Concept visualization: [name]; Technology research: [name]).

### Feasibility Test 1 (Project Rendering): updated description
The current text describes the earlier idea (“a sensor to detect how many individuals are standing in front of the screen”). Suggested replacement:
> People walk up to the screen and each takes a controller for one element. As each element comes into balance the scene grows from barren to a glowing forest, and when everyone holds the balance together it transforms into a butterfly. A rule we are still designing makes sure each controller has its own person, so no one can play alone.

### Feasibility Test 2 (Interviews): findings table, from Interview 2
| Finding | What people said | What we’ll change or test |
|---|---|---|
| Does this experience already exist for them? | Moved a tree out of the road with strangers, without talking; “felt empowered and connected.” Running a club where everyone had to do their part felt stressful. | Make each person’s contribution visible so relying on strangers feels rewarding, not stressful. |
| Would they join in with strangers? | “Very comfortable” if there is a shared goal people choose to pursue. | Make the shared goal clear in the first seconds. |
| What they’d do with no instructions | Imagined a lever: up is a lot, down is a little, the sweet spot is in the middle. | Test controls with a visible sweet spot. |
| Balance, setbacks and surprise events | Droughts or storms “would add a lot” and invoke more conversation. Wants events to be scientifically realistic. | Prototype one realistic event (e.g. drought) and see if it sparks talking. |
| Controllers and floor dots | Floor dots should show foot placement and light up when stepped on. | Note for the no-playing-alone research, whichever approach we choose. |
| Reaction to the butterfly ending | Feels earned if it’s difficult; wants sound, light, maybe the controller vibrates. | Test a multisensory reveal. |
| Surprises | Strangers can cooperate without talking. | Test whether people need to talk, or just watch each other. |

Run Interviews 3 to 5 so the table reflects more than one person.

### Feasibility Test 3 (Technical): additions
- Add our **two-button cooperative test**: two buttons an arm span apart must be pressed within 500 ms to light a green LED. Successful presses landed 16–46 ms apart. Our first build read both buttons as always pressed because the wires sat on legs that are always connected; turning the buttons fixed it. Code and wiring: `Development/Cooperative-Button-Test-V1/`.
- Add the **Arduino to p5.js ecosystem test**: Sunlight and Water knobs plus a Bloom hold-button drive a digital world over USB; holding balance for 10 seconds unlocks the butterfly. Built; [add hardware results].
- “Blender is one of the technologies we will be using, in addition to Unity”: our roles say tools are still open, so consider “we are exploring Blender and Unity, alongside p5.js and TouchDesigner.”

### Feasibility Test 5: Controller and Technology Research (new section)
Paste this as its own test, replacing the bare “FEASIBILITY TEST ON TECHNOLOGIES” link:

> **Feasibility Test 5: Controller and Technology Research**
>
> We researched what our controllers could be and every technology needed to build MetamorphUs, then followed up on what our interviews asked us to explore.
>
> **Controller research** (V1, Nov 11): 16 controller ideas in 7 families and six ways to force cooperation, such as split control, keep-moving controls and controllers placed out of reach. https://claude.ai/artifact/7cZ49kqDxMPMYANUr3a76m
>
> **Controller research V2** (Nov 13), driven by our interviews: controls that fit each element and feel distinct (a crank for sunlight, a pump lever with a sweet spot for water, a bellows for wind, a warm stone for heat, seed tokens for nutrients); ways to make each element a little difficult (narrow sweet spot, drift, cross-effects, realistic events like droughts); and feedback you can see, hear and feel (LEDs, sound, controller vibration). https://claude.ai/artifact/GRzcMg8LhHLAHiU3sHW2WC
>
> **Technology research**: options for physical controllers, preventing one person from playing alone, connecting controllers to the computer (Arduino and Web Serial, ESP32), and display (screen, projection, LEDs), with hands-on checks to run next. https://claude.ai/artifact/P9p1jv3v32bVQwy3mt4kBN
>
> **What we learned:** the technology exists and is accessible to us (Arduino, common sensors, p5.js); the open questions are about feel, such as which controls fit each element and how hard balance should be, so our next tests are playtests, not new technology.

---

## Part 3: Feasibility Test Findings (paste into both documents)

### What was surprising / unexpected? (draft)
> Three things surprised us. First, how cheaply the concept can be made: our bill of materials comes to about [$__]. Second, people coordinated more tightly than we expected: in our two-button test, successful presses landed 16 to 46 milliseconds apart, far inside the half-second window, so we can make timing harder. Third, our interviewee described cooperating with strangers to move a fallen tree without saying a word, which challenged our assumption that cooperation has to be spoken.

### How will you move forward with your findings? How will this affect your Capstone? (draft)
> Our findings shape the spring plan. We will design each controller to fit its element and give it a clear sweet spot, add realistic environmental events like droughts to spark conversation, and make the butterfly reveal multisensory (light, sound, possibly vibration). We will choose how to prevent solo play through hands-on tests, run more interviews and playtests with strangers, and tighten the timing and balance rules. Small tests also showed each of us which skills to build next, and our roles now match them: Kaitlyn leads the project, controls and code; Caitlin leads the physical controllers and installation; Austin leads the digital world.
