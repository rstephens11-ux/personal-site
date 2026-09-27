---
title: Forge Lab
id: forge-lab
category: software
tag: macOS app · studio for the rig
date: 2026-09
order: 6
accent: gold
layout: side-by-side
image: photos/forge-lab-icon.png
image_alt: Forge Lab app icon — a green monkey leaning over an anvil
specs:
  Built with: Hermes agent
  Runs: image and video models on the 3090 rig
  Platform: macOS
  Status: in use, still growing
---

The rig runs ComfyUI, which has a web interface. That's fine if you enjoy thinking in node graphs. I wanted buttons. So this is a small macOS app that talks to the rig over the network — no terminal, no graphs, no screen sharing.

The parts that earned their place:

- **Estimate before spending.** Every run tells you what it will cost in time *before* you start it. Video on this machine ranges from under two minutes to over half an hour, so "just try it" isn't a plan.
- **Everything is kept.** Every run is archived with its prompt and settings and can be reloaded later, so rerolling is a comparison instead of a memory test.
- **Image work:** text to image, image editing, and background removal — one set of models, three different wirings.
- **Video work:** text only, first frame, first *and* last frame, continue an existing clip, a character reference mode, and a song mode where you hand it an audio file and it lip-syncs to it.

Then the part I'd been putting off: making something longer than one shot. That gets its own window. Scenes are a queue, one row each, and each scene holds takes — reroll it or keep it, edit that one scene's prompt in place, and watch a step bar that tells you how many keepers you have. The stitch button refuses to run until every scene has one. The audio is a single continuous track laid under the whole thing rather than sliced up per scene, which is the difference between a piece of music and a stutter.

The number that shapes all of it: about **23.5 seconds of compute per second of finished video**, and it stays flat no matter how long the scenes are. A three-minute piece is roughly 70 minutes of rendering either way. So the question is never how to make it cheaper — it's whether you'd rather reroll cheap short scenes, or have fewer seams to hide.

Honest limits. A piece is one engine from start to finish, because one does 16 frames a second and the other does 24 and they can't be mixed in one timeline. The sound has to be muxed on the Mac afterwards, because the rig's encoder chokes on that step. And it's a tool for one person, not a product — one window, no accounts, no sharing.

Like the other things on this page, it got built by asking for it. I describe what I want, and Hermes agent writes it while I test it by using it.