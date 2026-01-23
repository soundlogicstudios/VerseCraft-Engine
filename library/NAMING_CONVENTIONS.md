# versecraft naming contract (canonical)

**status:** canonical / do-not-violate  
**goal:** eliminate case/path bugs on github pages + ios safari, keep project scalable and predictable.

---

## 1) global rules

- **everything is lowercase.**  
  folders, files, ids, urls, json keys, story ids, pack ids: all lowercase.
- **never rely on case-insensitive behavior.** github pages is case-sensitive.
- **no spaces** in any identifier or filename.
- avoid special characters except:
  - underscores `_` (code/data filenames + ids)
  - hyphens `-` (media + url paths)
- keep names short and descriptive.

---

## 2) naming by category

### 2.1 code + data files (underscores)
Use **underscores** for filenames that are code or data definitions.

**applies to:**
- `.js`, `.css`, `.json`, `.md`, `.txt`

**examples:**
- `screen_manager.js`
- `story_registry.js`
- `state_store.js`
- `library_manifest.json`
- `story_schema.md`

**folders (recommended):**
- folders should be lowercase and may use underscores when they are code/data oriented:
  - `src/core/`
  - `src/screens/`
  - `src/systems/`
  - `styles/screens/`
  - `content/packs/`

---

### 2.2 media + web paths (hyphens)
Use **hyphens** for anything that is media-facing or url-facing.

**applies to:**
- images, covers, ui panels, backgrounds
- web links / url paths
- any asset referenced by `src=""` or `url()` in css

**examples:**
- `backgrounds/ui/story-panels/timecop.webp`
- `backgrounds/ui/global/library-page-1.webp`
- `content/packs/founders/covers/relic-of-cylara.webp`

---

## 3) image format contract

- **all images are webp** (`.webp`)  
- no `.png`, `.jpg`, `.jpeg`, `.gif` in final build.
- any temporary non-webp art must be converted before commit.

---

## 4) ids and identifiers

### 4.1 story id (json id)
- story ids use **underscores** because they are data identifiers.
- example: `relic_of_cylara`

### 4.2 pack id (data id)
- pack ids use **underscores** (data).
- example: `founders_pack` (or `founders` if you keep it simple)

### 4.3 screen id (ui id)
- screen names shown in html `data-screen` use **hyphens** (ui/url-ish).
- example: `story-relic-of-cylara`

### 4.4 bridge rule (required)
Whenever a story id must be used for ui routing or asset naming, the app converts:

- json story id: `relic_of_cylara`
- ui slug: `relic-of-cylara`  (underscore → hyphen)

This conversion happens in **one place only**: the story registry/manifest layer.

---

## 5) repository layout contracts

### 5.1 separation of concerns
- `index.html` = shell only (containers + script/style includes)
- `src/` = javascript only
- `styles/` = css only
- `content/` = json only
- `backgrounds/` and `assets/` = media only
- `docs/` = documentation only

### 5.2 module format
- use **es modules** (`type="module"`)
- prefer small modules over one giant file.
- avoid inline scripts in `index.html`.

---

## 6) path contracts (examples)

### 6.1 story json path
`content/packs/<pack_id>/stories/<story_id>.json`

example:
`content/packs/founders/stories/relic_of_cylara.json`

### 6.2 story panel background (unique per story)
`backgrounds/ui/story-panels/<story_slug>.webp`

example:
`backgrounds/ui/story-panels/relic-of-cylara.webp`

---

## 7) rules for adding new stories (the 3-touch rule)

When adding a story, you should only need to touch:

1) add story json:
   - `content/packs/<pack_id>/stories/<story_id>.json`
2) add story media:
   - cover: `content/packs/<pack_id>/covers/<story_slug>.webp`
   - story panel: `backgrounds/ui/story-panels/<story_slug>.webp`
3) add registry/manifest entry (one file only):
   - `src/core/story_registry.js` (or a json manifest)

No other files should need edits.

---

## 8) non-negotiables

- no uppercase anywhere.
- no mixed hyphen/underscore for the same concept.
- all images webp.
- all routing must use registered screens (no hash routing).
- breaking these rules creates future 404s and should be rejected in review.