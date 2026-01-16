
// VerseCraft Engine v1.1.4-event-driven (fixed import logic)

import { StoryAdapter } from './StoryAdapter.js';
import { storyloader } from './storyloader.js';

export class VerseCraftEngine {
  constructor(log) {
    this.version = "v1.1.4-event-driven";
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
    this.log(section.text);
    if (section.choices) {
      section.choices.forEach((choice, i) => {
        this.log(`(${i + 1}) ${choice.text}`);
      });
    }
  }

  reset() {
    this.log("🔄 engine reset");
    this.adapter = null;
  }
}
