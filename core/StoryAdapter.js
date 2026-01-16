// VerseCraft StoryAdapter - v1.1.0
// Syncs story data with event-driven VerseCraft Engine

export class StoryAdapter {
  constructor(engine, storyJson) {
    this.engine = engine;
    this.story = storyJson;
    this.current = storyJson.start || "S01";
    this.state = {
      hp: storyJson.meta?.defaults?.hp || 100,
      xp: storyJson.meta?.defaults?.xp || 0,
      flags: new Set(),
      inventory: []
    };
  }

  // get current scene
  getCurrentSection() {
    return this.story.scenes?.[this.current] || null;
  }

  // optional developer-facing choice call
  makeChoice(choiceIndex) {
    const section = this.getCurrentSection();
    if (!section) return;

    const choice = section.options?.[choiceIndex];
    if (!choice) return;

    // apply optional effects
    this.applyEffects(choice.effects);

    // use correct key
    this.current = choice.to || choice.next || this.current;

    // update via engine
    if (this.engine && typeof this.engine.displaySection === "function") {
      this.engine.displaySection();
    }
  }

  // apply resource or flag effects
  applyEffects(effects) {
    if (!effects) return;
    effects.forEach(effect => {
      if (effect.hp) this.state.hp += effect.hp;
      if (effect.xp) this.state.xp += effect.xp;
      if (effect.addFlag) this.state.flags.add(effect.addFlag);
      if (effect.item) this.state.inventory.push(effect.item);
    });
  }
}
