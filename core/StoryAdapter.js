// VerseCraft StoryAdapter - v1.0.0
// Connects VerseCraft Engine with JSON-based story packs

export class StoryAdapter {
  constructor(engine, storyJson) {
    this.engine = engine;
    this.story = storyJson;
    this.current = storyJson.start;
    this.state = {
      hp: storyJson.meta?.defaults?.hp || 100,
      xp: storyJson.meta?.defaults?.xp || 0,
      flags: new Set(),
      inventory: []
    };
  }

  getCurrentSection() {
    return this.story.scenes?.[this.current] || null;
  }

  makeChoice(choiceIndex) {
    const section = this.getCurrentSection();
    if (!section) return;

    const choice = section.options?.[choiceIndex];
    if (!choice) return;

    this.applyEffects(choice.effects);
    this.current = choice.next;
    this.engine.tick();
  }

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
