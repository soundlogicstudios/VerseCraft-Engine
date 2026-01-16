// versecraft engine v1.1.6-interactive
// adds interactive choice selection for story navigation

import { StoryAdapter } from './StoryAdapter.js';
import { storyloader } from './storyloader.js';

export class VerseCraftEngine {
  constructor(log) {
    this.version = "v1.1.6-interactive";
    this.log = log;
    this.adapter = null;
    this.output = document.getElementById('output');
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

    // clear output and show section text
    this.output.innerHTML = '';
    this.appendLine(section.text);

    // find choices dynamically
    const choiceSet =
      section.choices ||
      section.options ||
      section.paths ||
      section.selections ||
      [];

    if (Array.isArray(choiceSet) && choiceSet.length > 0) {
      choiceSet.forEach((choice, i) => {
        const btn = document.createElement('button');
        btn.textContent = choice.label || choice.text || `option ${i + 1}`;
        btn.style.display = 'block';
        btn.style.margin = '0.5rem auto';
        btn.onclick = () => this.selectChoice(choice);
        this.output.appendChild(btn);
      });
    } else {
      this.appendLine("⚠️ no choices available in this section.");
    }
  }

  selectChoice(choice) {
    if (!choice || !this.adapter) return;

    const nextId = choice.next;
    if (!nextId) {
      this.appendLine("🟡 this path ends here.");
      return;
    }

    // move to next scene and redisplay
    this.adapter.current = nextId;
    this.displaySection();
  }

  appendLine(text) {
    const div = document.createElement('div');
    div.innerHTML = text.replace(/\n/g, '<br>');
    this.output.appendChild(div);
    this.output.scrollTop = this.output.scrollHeight;
  }

  reset() {
    this.log("🔄 engine reset");
    this.adapter = null;
    this.output.innerHTML = '';
  }
}
