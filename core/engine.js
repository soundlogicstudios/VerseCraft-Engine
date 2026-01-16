// engine.js - event-driven versecraft engine
import { storyadapter } from './storyadapter.js';
import { storyloader } from './storyloader.js';

export class versecraftengine {
  constructor(log) {
    this.log = log;
    this.version = 'v1.1.4-event-driven';
    this.story = null;
    this.adapter = null;
  }

  async loadStory(storyId) {
    try {
      this.log(`📖 Loading story: ${storyId}...`);
      const storyData = await storyloader.loadStoryById(storyId);
      this.story = storyData;
      this.adapter = new storyadapter(this, storyData);
      this.log(`✅ Loaded story: ${storyData.meta?.title || storyId}`);
      this.renderScene();
    } catch (err) {
      this.log('❌ Failed to load story: ' + err.message);
    }
  }

  renderScene() {
    if (!this.adapter || !this.story) return;
    const scene = this.adapter.getCurrentSection();
    if (!scene) {
      this.log('⚠️ No scene data found.');
      return;
    }
    this.log(`<strong>${scene.text}</strong>`);
    if (scene.options) {
      scene.options.forEach((opt, i) => {
        this.log(`(${i + 1}) ${opt.label}`);
      });
    }
  }

  choose(index) {
    if (!this.adapter) return;
    this.adapter.makeChoice(index);
    this.renderScene();
  }

  reset() {
    if (!this.adapter || !this.story) return;
    this.log('🔄 Resetting story...');
    this.adapter.current = this.story.start;
    this.renderScene();
  }
}
