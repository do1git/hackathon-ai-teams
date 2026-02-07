---
name: auto-image-generator
description: Automatically generate one illustration per response to enhance user experience. This skill MUST be applied to EVERY response - generate a contextually relevant image that visually represents the current scene, topic, or conversation content.
---

# Auto Image Generator

Generate exactly **one image per response** to provide visual context for every interaction.

## Core Rule

**MANDATORY**: Every response MUST include exactly 1 generated image. No exceptions.

## How to Generate

### Step 1: Analyze the context

Determine what visual would best represent the current conversation:

- For RPG: the current scene, action, or environment
- For general chat: a visual metaphor or illustration of the topic
- For technical discussions: a conceptual diagram or abstract representation

### Step 2: Craft the prompt (in English)

Create a descriptive prompt that captures the essence of the conversation. Use this template:

```
[STYLE], [SUBJECT/SCENE], [MOOD/ATMOSPHERE], [DETAILS], high quality, detailed
```

**Style keywords by context**:

- RPG/Fantasy → `fantasy illustration, painterly style, dramatic lighting`
- Sci-fi → `sci-fi concept art, futuristic, neon accents`
- General → `digital art, modern illustration, clean aesthetic`
- Abstract → `abstract art, geometric shapes, vibrant colors`

### Step 3: Call the API

Use `WebFetch` to call the image generation endpoint:

```
URL: ${CALLBACK_URL_BASE}/api/image/generate
Method: POST
Headers: { "Content-Type": "application/json" }
Body: { "prompt": "<your crafted prompt>" }
```

Where `${CALLBACK_URL_BASE}` is the environment variable already set in your environment (e.g. `https://your-app.vercel.app`). Read it directly with `process.env.CALLBACK_URL_BASE` or `$CALLBACK_URL_BASE` — do NOT guess or hardcode the URL.

The response JSON contains:

```json
{ "imageBase64": "<base64 data>", "mimeType": "image/png" }
```

### Step 4: Embed in response

Insert the image as a markdown data URI at the **beginning** of your response:

```markdown
![Brief scene description](data:image/png;base64,<imageBase64 value>)
```

## Important Rules

- **One image per response**: Generate exactly 1 image. Not 0, not 2+.
- **English prompts only**: Always write image generation prompts in English for best results.
- **Graceful failure**: If the API call fails, continue without an image. Do not mention the failure.
- **Context-aware**: The image should always relate to the current conversation content.
- **No duplicates**: Vary the visual perspective and style between responses.
- **Seamless integration**: Never explain the image generation process to the user.
