// panel_engine.js - renders story content into a fixed art panel overlay
// additive module: does NOT change existing engine-state-test harness

import { storyloader } from './storyloader.js';
import { StoryAdapter } from './storyadapter.js';

export class PanelEngine {
  /**
   * @param {{
   *  storyTextEl: HTMLElement,
   *  choiceButtons: HTMLButtonElement[],
   *  debugEl?: HTMLElement
   * }} targets
   */
  constructor(targets) {
    this.targets = targets;
    this.story = null;
    this.adapter = null;
    this._lastChoice = null;
  }

  async init(storyId) {
    this._debug(`loading story: ${storyId}...`);
    this.story = await storyloader.load(storyId);
    if (!this.story) {
      this._debug('failed to load story json');
      return;
    }
    this.adapter = new StoryAdapter(this, this.story);
    this._debug(`loaded: ${this.story.meta?.title || storyId}`);
    this.render();
  }

  render() {
    const section = this.adapter?.getCurrentSection?.();
    if (!section) {
      this._debug('missing section');
      return;
    }

    // narrative
    const text = typeof section.text === 'string' ? section.text : String(section.text ?? '');
    this.targets.storyTextEl.textContent = text;

    // choices (panel has 4 slots; during testing we ALWAYS show all 4)
    // If a slot has no corresponding option, show a disabled placeholder label and DO NOT allow navigation.
    const opts = section.options || [];
    this.targets.choiceButtons.forEach((btn, i) => {
      const opt = opts[i];

      btn.style.display = ''; // always visible in this harness

      if (!opt) {
        btn.disabled = true;
        btn.onclick = null;
        btn.textContent = 'Not a choice';
        return;
      }

      btn.disabled = false;
      btn.textContent = opt.label || '(choice)';
      btn.onclick = () => {
        this._lastChoice = { index: i, label: btn.textContent };
        this.adapter.makeChoice(i);
      };
    });

    this._debug(
      `node: ${this.adapter.current} | choices: ${opts.length}` +
      (this._lastChoice ? ` | last: [${this._lastChoice.index}] ${this._lastChoice.label}` : '')
    );
  }

  // called by StoryAdapter after a choice is applied
  displaySection() {
    this.render();
  }

  _debug(msg) {
    if (!this.targets.debugEl) return;
    this.targets.debugEl.textContent = msg;
  }
}
