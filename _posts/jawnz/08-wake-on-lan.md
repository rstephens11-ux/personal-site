---
title: Wake-on-LAN — turning the rig off without losing it
id: wake-on-lan
category: hardware
tag: wake-on-lan · one BIOS switch · one-click app
date: 2026-10
order: 8
accent: lime
layout: side-by-side
image: photos/forge-power-icon.png
image_alt: Forge Power app icon — a green monkey throwing a big power lever
specs:
  Board: ASUS ProArt X870E-Creator
  Wakes from: sleep (~20 s) · full power-off (~1 min)
  What fixed it: BIOS → APM Configuration → Power On By PCI-E = Enabled
  Who sends the packet: this laptop, over the LAN
  Status: working
---

The rig in the basement sits there drawing about 100 watts doing nothing. That's somewhere north of $200 a year to keep a room nobody's in a little bit warmer. The obvious answer is to shut it down at night — and that was the one thing I couldn't do, because off meant gone. No screen on it, no keyboard on it, no way back in. The last time I shut it down I walked down the basement stairs and pressed the button. On purpose. At 11pm.

So this is about fixing that. The annoying part is how small the fix turned out to be.

**What wake-on-LAN actually is.** You shout a specific pattern of bytes at the local network — six `0xFF` bytes, then the machine's hardware address repeated sixteen times — and everything ignores it except a network card that's been told to listen for it. That card stays awake when the rest of the machine is off. It hears the pattern, and it powers the board back up. That's the whole trick.

Three things have to be true, and I only knew about one of them.

- **The card has to be told to listen.** On Linux that's `ethtool -s enp12s0 wol g`, and it has to survive a reboot, which takes a udev rule and a setting in NetworkManager. This part was already done, and I could see it was working.
- **The board has to give the card permission to wake it.** That's a setting in the BIOS, and it was off.
- **It has to be the right network port.** This board has two, and only the 10-gigabit one can wake the machine. The other one — a 2.5-gigabit Intel — can't, and that's a known limitation of these boards rather than anything I broke. I happened to have the cable in the good one.

The middle one is the whole story. **Nothing anywhere tells you that setting is off.** No error, no warning, no failed message, nothing in the operating system that reports it. The machine just doesn't wake — which looks exactly like a machine that's broken, or a packet that's wrong, or a network problem. I spent a while sending packets with increasing confidence. The packets were fine the whole time. The box had simply never been given permission to listen. (The setting right next to it, the one every forum thread blames first, was already correct.)

Once it was enabled, the test:

- From sleep: back in about **20 seconds**.
- From a full shutdown — the case that had never once worked: about **a minute**, and most of that is just the machine booting.

Then I wanted a button, because typing a command into a terminal to switch something on defeats the point of an off switch. So now there's a small app: two buttons, a status light, and the rig's uptime and load, so at a glance I can see whether it's even on.

Two honest limits.

- **A magic packet never leaves the local network.** It isn't addressed to anything in particular — it's shouted at everything, and that's the only reason an off machine can hear it — so it can't be routed over the internet to the house. Whatever sends it has to be on the same network as the machine. Right now that's this laptop, which is fine while I'm home. To wake it from somewhere else, something small and always-on has to do the shouting, and I've got a spare Raspberry Pi for exactly that. Later.
- **The 10-gigabit port has been running at 100 Mb/s since the day it was built.** Different problem, same port, still not fixed. It doesn't matter here — the packet couldn't care less how slow the link is — but it's on the list.

What actually changed: off used to be a decision I couldn't take back, so the machine just stayed on for weeks at a time. Now off costs a minute. A computer you can switch off is a computer you can actually own.

Not finished. But I shut it down on purpose last night, and it came back on its own. Thanks to my Hermes agent for this one — I'd been treating it as a packet problem, and it turned out to be a permission problem, and the agent found a write-up for this exact board that named the setting.
