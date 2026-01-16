// engine.js - versecraft lowercase canonical version
import { storyloader } from './storyloader.js';
import { StoryAdapter } from './storyadapter.js';

export class VerseCraftEngine {
  constructor(outputElement) {
    this.outputElement = outputElement;
    this.story = null;
    this.adapter = null;
  }

  async init(storyId = "world_of_lorecraft") {
    this.log("📖 loading story data...");
    try {
      this.story = await storyloader.load(storyId);
      if (!this.story) throw new Error("failed to load story JSON");
      this.adapter = new StoryAdapter(this, this.story);
      this.log(`✅ loaded: ${this.story.meta?.title}`);
      this.displaySection();
    } catch (err) {
      this.log(`❌ failed to load story: ${err.message}`);
      console.error(err);
    }
  }

  displaySection() {
    const section = this.adapter.getCurrentSection();
    if (!section) return this.log("⚠️ missing section data.");
    this.outputElement.innerHTML = `
      <div class="story-text">${section.text}</div>
      <div class="choices">
        ${section.options.map((opt, i) => `
          <button onclick="window.engine.adapter.makeChoice(${i})">${opt.label}</button>
        `).join("")}
      </div>`;
  }

  log(message) {
    if (this.outputElement) {
      const div = document.createElement("div");
      div.textContent = message;
      this.outputElement.appendChild(div);
    } else {
      console.log(message);
    }
  }
}
