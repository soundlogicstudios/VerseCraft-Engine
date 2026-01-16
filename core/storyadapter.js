// storyadapter.js - lowercase canonical version
export class StoryAdapter {
  constructor(engine, storyJson) {
    this.engine = engine;
    this.story = storyJson;
    this.current = storyJson.start || "S01";
    this.state = { hp: 100, xp: 0, flags: new Set(), inventory: [] };
  }

  getCurrentSection() {
    return this.story.scenes?.[this.current] || null;
  }

  makeChoice(choiceIndex) {
    const section = this.getCurrentSection();
    if (!section) return;
    const choice = section.options?.[choiceIndex];
    if (!choice) return;
    this.current = choice.to || choice.next || this.current;
    this.engine.displaySection();
  }
}
