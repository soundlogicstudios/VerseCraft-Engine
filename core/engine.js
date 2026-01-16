// versecraft engine v1.1.5-flex-choice
// automatically detects and renders choices from various key names

import { StoryAdapter } from './StoryAdapter.js';
import { storyloader } from './storyloader.js';

export class VerseCraftEngine {
  constructor(log) {
    this.version = "v1.1.5-flex-choice";
    this.log = log;
    this.adapter = null;
  }

  async loadStory() {
    this.log("📖 loading story data...");
    try {
      const storyData = await storyloader.loadDefault();
      if (storyData) {
        this.adapter = new StoryAdapter(this, storyData);
        this.log(`✅ loaded story: ${storyData.meta?.title || "untitled"}`);
        this.displaySection();
      } else {
        this.log("⚠️ no story data found.");
      }
    } catch (err) {
      this.log(`❌ failed to load story: ${err.message}`);
    }
  }

  displaySection() {
    const section = this.adapter?.getCurrentSection();
    if (!section) return this.log("⚠️ no section available.");

    // Display section text
    this.log(section.text);

    // Flexible choice key detection
    const choiceSet =
      section.choices ||
      section.options ||
      section.paths ||
      section.selections ||
      [];

    if (Array.isArray(choiceSet) && choiceSet.length > 0) {
      choiceSet.forEach((choice, i) => {
        const label = choice.label || choice.text || `Option ${i + 1}`;
        this.log(`(${i + 1}) ${label}`);
      });
    } else {
      this.log("⚠️ no choices available in this section.");
    }
  }

  reset() {
    this.log("🔄 engine reset");
    this.adapter = null;
  }
}
