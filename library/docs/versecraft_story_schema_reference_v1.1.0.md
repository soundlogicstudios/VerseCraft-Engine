# VerseCraft Canon Story Schema Reference (v1.1.0)

This document defines the canonical JSON structure for VerseCraft interactive stories.

## 1. Overview
Each story is a self-contained JSON file stored in the `/library/` directory. The engine reads it to generate scenes, choices, and endings dynamically.

---

## 2. Top-Level Fields

| Field | Type | Required | Description |
|-------|------|-----------|--------------|
| `meta` | Object | ✅ | Core metadata about the story |
| `assets` | Object | ✅ | Visual and audio asset paths |
| `blurb` | String | ✅ | Summary or teaser shown in the library |
| `start` | String | ✅ | Starting section key, e.g. `"S01"` |
| `scenes` | Object | ✅ | All narrative scenes and endings |

---

## 3. `meta` Object

| Key | Description | Example |
|-----|--------------|----------|
| `title` | Full story title | `"World of Lorecraft: Ashes of the Everpath"` |
| `subtitle` | Optional tagline | `"The Shatterfall Has Begun"` |
| `author` | Author or studio name | `"Sound Logic Studios"` |
| `version` | Schema version | `"1.1.0-canon"` |
| `checkpoint` | Range of save-supported sections | `"S01–S150"` |
| `packId` | Story folder name in `/library/` | `"world_of_lorecraft"` |
| `buildTimestamp` | ISO build date | `"2026-01-15T00:00:00Z"` |

---

## 4. `assets` Object

Defines the paths for the cover, background, and audio used by the story.

| Field | Description | Example |
|-------|--------------|----------|
| `cover` | Cover image path | `"content/packs/starter/covers/lorecraft.png"` |
| `background` | Background art path | `"content/packs/starter/backgrounds/ruins.png"` |
| `music` | Background music path | `"content/packs/starter/audio/lore_theme.mp3"` |

---

## 5. `scenes` Object

Each key (`S01`, `S02`, etc.) defines a section of the story.

| Field | Type | Description |
|--------|------|-------------|
| `text` | String | Full prose for that scene |
| `options` | Array | List of interactive choices |
| `checkpoint` | String (optional) | Save point tag |

---

## 6. `options` Array

Each element in `options` defines a player choice.

| Field | Description | Example |
|--------|-------------|----------|
| `label` | Display text for the button | `"Enter the ruin"` |
| `next` | Target scene or ending ID | `"S02"` or `"GOOD_END"` |

---

## 7. Endings

| ID | Description |
|----|--------------|
| `GOOD_END` | Victorious or positive conclusion |
| `BAD_END` | Failure or death |
| `SPECIAL_END` | Hidden or lore-driven ending |
| `NEUTRAL_END` | Ambiguous or balanced resolution |
| `LOOP_END` | Restarts story from `"S01"` |

---

## 8. `blurb` Field

The `blurb` is shown in the story library before launch.  
It should be 1–2 sentences describing the premise or emotional hook.

Example:
```
"A first run into a ruin that watches you back. Learn VerseCraft’s rules through choices, consequences, and lore."
```

---

## 9. Example Start

```
{
  "meta": {
    "title": "World of Lorecraft: Ashes of the Everpath",
    "subtitle": "The World That Notices",
    "author": "Sound Logic Studios",
    "version": "1.1.0-canon",
    "checkpoint": "S01–S149",
    "packId": "world_of_lorecraft",
    "buildTimestamp": "2026-01-15T00:00:00Z"
  },
  "assets": {
    "cover": "content/packs/starter/covers/world_of_lorecraft.png"
  },
  "blurb": "You wake to the sound of trees screaming...",
  "start": "S01"
}
```

---

**VerseCraft Schema Reference v1.1.0 — maintained by Sound Logic Studios**
