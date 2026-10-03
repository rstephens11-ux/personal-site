---
title: forge build complete - 2x 3090s
id: second-card-raylight
category: hardware
tag: second card · ray · local AI
date: 2026-10
order: 7
accent: sky
specs:
  Cards: 2× EVGA RTX 3090 FTW3 Ultra
  Two cards with: '[Raylight](https://github.com/komikndr/raylight) (Apache-2.0)'
  Second card: seated — the 6th power cable finally arrived
  Measured on one clip: 37.9 min → 21.7 min
  Power: card 1 capped 300 W, +150 MHz offset
  Status: working, still tuning
---

The last power cable showed up and the second card went in, so the machine is finally the 48GB thing it was supposed to be. Which is where the interesting part starts, because the obvious assumption — two cards make one job faster — turns out to be wrong the way you'd actually expect it to work.

A 3090 wants three power connectors, each on its own cable, and the supply ships with five. That's the whole reason a build stalled for a week over a twenty dollar cable: five cables, six sockets. You can't daisy-chain two connectors off one cable on a card like this, so there's no clever way around it.

With both cards in, the default behaviour is that you still render one job at a time. ComfyUI doesn't pool memory across cards — two cards means two jobs running side by side, not one job going twice as fast. So out of the box, the second card does nothing for a single clip, which is the thing I actually wanted it for.

**Raylight** is the fix — [komikndr/raylight](https://github.com/komikndr/raylight), Apache-2.0. It's a node pack that splits a *single* render across both cards — divides the work up rather than running two separate jobs. Same model, same settings, it just uses both pieces of hardware on one output. Not my work and worth saying so: without it, the second card is just a spare sitting in a slot.

I measured it properly, same clip both ways, nothing else changed:

- One card: **37.9 minutes**
- Two cards: **21.7 minutes**

That's about **1.75×** on a 15-second clip at 1344×768. Not double, but real.

**And it is not a fixed number.** On a very short run the gain was only about 1.1×; on the long clip it was closer to 1.8×. There's a fixed cost to bringing both cards into a job, and on a short clip that cost is most of the runtime, so there's nothing left to divide. The longer the clip, the closer to 2× you get. So there's no single honest number here — only "the longer, the better," which is annoying for planning and exactly why the app quotes a time before you commit instead of after.

Two things I'd rather know now than discover later:

- **The same seed does not give you the same video across card counts.** One card and two cards produce visibly different pixels from identical settings — the same shot, not the same frame. So this is a decision you make before a take, not a way to speed up a take you already like.
- **It held about 21GB per card after it finished.** Idle, nothing running, cards nearly full — which means the *next* render would have run out of memory. I found that by looking at the machine after a run rather than by reading the code, and it was one setting. Fixed, but it would have looked like a broken card.

The rest of the tuning: card 1 is capped at 300 W because it runs hotter than card 2 at the same wattage, and both got a small clock offset. Memory clock sat on the same value the entire run and never throttled, which is the part I actually care about.

What I still can't see: on Linux NVIDIA's driver doesn't expose the memory junction temperature, which is the number that decides whether a 3090 is running safely. On Windows it reads fine. So both cards run on the margin an undervolt buys rather than on a measurement, and I still don't run it unattended overnight.

Not finished. But a clip that was 37 minutes is 21, and the thing it was built for is fast enough to actually use.
