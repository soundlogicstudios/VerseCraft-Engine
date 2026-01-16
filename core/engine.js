// versecraft engine v1.1.7-schema-sync
// fully compatible with world_of_lorecraft.json structure

import { StoryAdapter } from './StoryAdapter.js';
import { storyloader } from './storyloader.js';

export class VerseCraftEngine {
  constructor(log) {
    this.version = "v1.1.7-schema-sync";
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

    // clear and print section text
    this.output.innerHTML = '';
    this.appendLine(section.text);

    // handle optional system info
    if (section.system) {
      const sysLine = document.createElement('div');
      sysLine.innerHTML = `<i>${section.system}</i>`;
      sysLine.style.color = "#888";
      sysLine.style.fontSize = "0.9rem";
      sysLine.style.margin = "0.5rem 0";
      this.output.appendChild(sysLine);
    }

    // resolve compatible choice field
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

    // check schema-compatible key
    const nextId = choice.to || choice.next || null;

    if (choice.toMenu) {
      this.appendLine("🏁 returning to main menu (placeholder)");
      this.reset();
      return;
    }

    if (!nextId) {
      this.appendLine("🟡 this path ends here.");
      return;
    }

    // move to the next section
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
