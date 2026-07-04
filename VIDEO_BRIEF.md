# Wan2GP — Fun InP Image-to-Video Brief

Use this file whenever generating or planning **Fun InP** image-to-video jobs in Wan2GP.

Reference docs (read when unsure):
- `app/docs/PROMPTS.md` — multiline prompts, image pairing, sliding windows
- `app/docs/MODELS.md` — Fun InP 1.3B vs 14B
- `app/docs/CLI.md` — headless `--process` with exported `.json` / `.zip`

---

## Default model

| VRAM | Model | `model_type` | When to use |
|------|-------|--------------|-------------|
| 6–8 GB | **Fun InP image2video 1.3B** | `fun_inp_1.3B` | Fast previews, playful loops, low VRAM |
| 10–12 GB+ | **Fun InP image2video 14B** | `fun_inp` | Better quality + **End Image** interpolation |

Fun InP specialty: **Start Image → motion → optional End Image** (morph / arrive-at-pose). Use End Image when you want a clear before/after or landing frame.

**LoRA note:** existing I2V LoRAs work better on other Wan I2V models; on Fun InP 14B they often underperform. Prefer strong prompts over LoRA stacking unless testing.

---

## Prompt rules (I2V — motion only)

The **Start Image** already defines subject, face, clothes, and composition.

**Do describe:**
- Motion, gesture, expression change
- Camera move (push-in, orbit, pan, tilt, handheld wobble)
- Environment reaction (wind, rain, lights flicker, bokeh drift)
- Pace (slow, snappy, bouncy, dreamy)

**Do not re-describe** what's visible in the image (hair color, outfit, background objects) unless you want the model to *change* them.

### Good vs weak

```text
# Weak (re-describes the photo)
A woman in a red dress standing in a cafe smiling at the camera

# Strong (Fun InP — playful motion)
She breaks into a slow grin, tilts her head, steam rises from the cup,
camera gently pushes in, warm lights pulse once like a heartbeat
```

```text
# Weak
A cartoon cat on a windowsill

# Strong
The cat's ears twitch, tail swishes twice, then it pounces toward the lens
with exaggerated squash-and-stretch energy, camera shakes slightly on impact
```

---

## Fun InP motion vocabulary

Pick 1–2 motion ideas + 1 camera idea. Keep prompts **short** (1–3 sentences).

| Vibe | Motion keywords |
|------|-----------------|
| Playful | bounce, wiggle, pop, overshoot, double-take, cartoon squash |
| Cozy | blink, soft smile, steam drift, candle flicker, slow breath |
| Epic | hair whip, cloth billow, particles burst, lens flare sweep |
| Silly | cross-eye, tongue out, sudden zoom, rubber-limb wave |
| Chill | subtle sway, cloud drift, lazy orbit, parallax slide |

**End Image workflows:** prompt the *journey* between start and end, not two separate scenes.

```text
Character leans from surprised to laughing, arms unfold outward,
camera arcs 20 degrees left as background bokeh brightens
```

---

## Recommended settings (starting point)

Tune in UI, then **Export Settings** to `jobs/<name>.json` for repeat runs.

| Setting | 1.3B fun test | 14B quality |
|---------|---------------|-------------|
| Frames | 49 (~2 s) | 73–97 (~3–4 s) |
| Steps | 20 | 25–30 |
| Guidance | 5–7 (playful) | 6–8 |
| Resolution | match image aspect | match image aspect |
| Seed | `-1` explore, fix when happy | same |

**Multiline mode:** `Each New Line Will Add a new Video/Image/Audio Request to the Generation Queue` — best for trying several fun motions on the **same** Start Image.

**Image pairing:** `Match images and text prompts` when each image has its own motion line.

---

## Shot templates (copy & adapt)

### 1 — Single playful loop
```text
Subject does a tiny victory dance, hops once, lands with a cheeky grin,
camera handheld micro-shake, saturated joyful energy
```

### 2 — Start → End morph
- Start Image: neutral pose
- End Image: big smile / jump / wave
```text
Smooth transition from stillness to full excited wave at camera,
ease-in then snap on the final pose, slight motion blur on hands
```

### 3 — Batch same image, 3 vibes
```text
# Line 1 — silly
Crosses eyes and puffs cheeks, then pops back to normal, quick zoom punch-in

# Line 2 — dreamy
Slow blink, hair floats as if underwater, soft orbit right

# Line 3 — hype
Fist pump with confetti-like particles, camera whips around 45 degrees
```

---

## Agent workflow (Cursor → Wan2GP)

When the user asks for a video from an image:

1. Read this brief + `app/docs/PROMPTS.md` (I2V sections).
2. Confirm **Start Image** path (prefer `refs/` in launcher root or user-provided path).
3. Ask whether they want **1.3B** (fast/fun) or **14B** (+ optional **End Image**).
4. Write **motion-only** prompts; avoid scene re-description.
5. Prefer **3 prompt variants** for exploration unless they want one final render.
6. To run headless after UI export:
   ```bash
   cd app && python wgp.py --process ../jobs/<file>.json --output-dir ../outputs
   ```
7. Or use WanGP UI: model **Fun InP**, paste prompt, Generate.

---

## Assets

| Path | Purpose |
|------|---------|
| `refs/` | Drop Start (and optional End) images here |
| `jobs/` | Exported `.json` settings from Wan2GP |
| `outputs/` | Headless / batch output (create as needed) |
| `app/loras_i2v/` | I2V LoRAs (optional; see LoRA note above) |

---

## Avoid list

- Re-describing the whole scene from the photo
- Conflicting motion ("stands still" + "runs away")
- Too many effects in one prompt (pick 2–3 beats max)
- Ultra-long prompts — Fun InP responds better to clear, short motion cues
- Expecting perfect lip-sync or dialogue from I2V alone
