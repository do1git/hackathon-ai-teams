---
name: rpg-image-generator
description: Generate immersive RPG scene illustrations using the image generation API. Use this skill when narrating key RPG moments that benefit from visual illustration, such as entering new locations, encountering bosses or important NPCs, dramatic combat scenes, discovering legendary items, or witnessing major story events. Triggers on RPG narration, scene transitions, boss encounters, and dramatic story moments.
---

# RPG Image Generator

Generate scene illustrations during RPG gameplay to enhance player immersion.

## When to Generate

Generate an image at **impactful narrative moments** — not every turn.

- **New location**: First time entering a significant area (dungeon, city, throne room)
- **Boss/NPC encounter**: A powerful enemy or key character appears for the first time
- **Combat climax**: A decisive battle moment (final blow, dramatic spell)
- **Discovery**: Finding a legendary item, hidden passage, or ancient artifact
- **Major story beat**: Betrayal, revelation, dramatic escape

**Frequency**: Maximum 1 image per turn. Aim for roughly 1 image every 3-4 turns.

## How to Generate

### Step 1: Craft the prompt (in English)

Use this template:

```
Fantasy RPG illustration, [WORLD_STYLE], [SCENE_DESCRIPTION], [MOOD/LIGHTING], detailed environment, painterly style, no text, no UI elements
```

**World style keywords**:
- 무림 → `wuxia, East Asian martial arts, ink painting aesthetic, bamboo forests, ancient temples`
- 갤럭틱 오디세이 → `sci-fi space opera, starships, neon lights, alien planets, futuristic architecture`
- 아케인 아칸 → `arcane academy, magical runes, mystical creatures, glowing spells, gothic fantasy school`
- 고대 반지의 연대기 → `high fantasy, medieval castles, elven forests, dwarven halls, epic landscapes`

### Step 2: Call the API

Use `WebFetch` to call the image generation endpoint:

```
URL: ${CALLBACK_URL_BASE}/api/image/generate
Method: POST
Headers: { "Content-Type": "application/json" }
Body: { "prompt": "<your crafted prompt>" }
```

Where `${CALLBACK_URL_BASE}` is the base URL derived from `CALLBACK_URL` environment variable (strip the `/api/conversations/...` path suffix — use everything before `/api/`).

The response JSON contains:
```json
{ "imageBase64": "<base64 data>", "mimeType": "image/png" }
```

### Step 3: Embed in response

Insert the image as a markdown data URI in your narrative text:

```markdown
![Brief scene description](data:image/png;base64,<imageBase64 value>)
```

Place the image **before** the narrative text for that scene, so the player sees the visual first, then reads the description.

## Important Rules

- **English prompts only**: Always write image generation prompts in English for best results, regardless of the user's language.
- **Never block on failure**: If the API call fails or returns an error, continue the narrative without an image. Do not mention the failure to the player.
- **No repeated images**: Do not regenerate an image for a scene already illustrated.
- **Stay in character**: Image generation should be seamless. Never explain the technical process to the player.
