// panel_engine.js - panel harness renderer (additive)
// Renders story text + up to 4 choices into a fixed art panel overlay.
// Design goals:
// - Page scroll is locked by CSS (only narrative container scrolls).
// - Always show 4 choice slots for testing.
// - If a slot has no option, show "Not a choice" and disable navigation.

import { storyloader } from './storyloader.js';
import { StoryAdapter } from './storyadapter.js';

export class PanelEngine {
  constructor(opts = {}) {
    this.storyId = opts.storyId || 'world_of_lorecraft';
    this.elNarrative = opts.elNarrative || null;
    this.choiceButtons = opts.choiceButtons || [];
    this.elDebug = opts.elDebug || null;

    this.story = null;
    this.adapter = null;
  }

  async init() {
    this.story = await storyloader.load(this.storyId);
    if (!this.story) throw new Error(`failed to load story: ${this.storyId}`);

    // StoryAdapter expects an engine-like object with displaySection().
    const engineShim = { displaySection: () => this.render() };
    this.adapter = new StoryAdapter(engineShim, this.story);

    this.bindChoiceHandlers();
    this.render();
    this.debug(`✅ panel engine ready: ${this.story.meta?.title || this.storyId}`);
  }

  bindChoiceHandlers() {
    this.choiceButtons.forEach((btn, i) => {
      if (!btn) return;
      btn.addEventListener('click', (e) => {
        if (btn.disabled) return;
        this.adapter.makeChoice(i);
      });
    });
  }

  render() {
    const section = this.adapter.getCurrentSection();
    if (!section) {
      this.setNarrative('⚠️ missing section data.');
      this.setChoices([]);
      this.debug('⚠️ missing section data.');
      return;
    }

    this.setNarrative(section.text || '');
    this.setChoices(section.options || []);
    this.debug(`node=${this.adapter.current} choices=${(section.options || []).length}`);
  }

  setNarrative(text) {
    if (!this.elNarrative) return;
    // Preserve line breaks while remaining safe.
    const safe = String(text).replace(/\r\n/g, '\n');
    this.elNarrative.textContent = safe;
    // Start at top each node for deterministic testing.
    this.elNarrative.scrollTop = 0;
  }

  setChoices(options) {
    // Always show 4 buttons.
    for (let i = 0; i < this.choiceButtons.length; i++) {
      const btn = this.choiceButtons[i];
      if (!btn) continue;

      const opt = options[i];
      if (!opt) {
        btn.textContent = 'Not a choice';
        btn.disabled = true;
        btn.setAttribute('aria-disabled', 'true');
        btn.dataset.choice = 'empty';
      } else {
        btn.textContent = opt.label || `Choice ${i + 1}`;
        btn.disabled = false;
        btn.removeAttribute('aria-disabled');
        btn.dataset.choice = 'live';
      }
    }
  }

  debug(msg) {
    if (this.elDebug) this.elDebug.textContent = msg;
    // Also log to console for network/path troubleshooting.
    console.log(`[panel] ${msg}`);
  }
}
