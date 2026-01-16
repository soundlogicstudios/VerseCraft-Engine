// VerseCraft StoryAdapter - v1.1.1-canonical
// Bridges structured JSON stories with the VerseCraft Engine

export class StoryAdapter {
  constructor(engine, storyJson) {
    this.engine = engine;
    this.story = storyJson;
    this.current = storyJson.start || "S01";
    this.state = {
      hp: storyJson.meta?.defaults?.hp ?? 100,
      xp: storyJson.meta?.defaults?.xp ?? 0,
      flags: new Set(),
      inventory: [],
      checkpoint: null
    };
  }

  // ✅ Get current story section safely
  getCurrentSection() {
    return this.story.scenes?.[this.current] || null;
  }

  // ✅ Handle choice selection by index (e.g., 0, 1, 2)
  makeChoice(choiceIndex) {
    const section = this.getCurrentSection();
    if (!section) {
      console.warn("StoryAdapter: no current section to choose from");
      return;
    }

    const choice = section.options?.[choiceIndex];
    if (!choice) {
      console.warn(`StoryAdapter: invalid choice index ${choiceIndex}`);
      return;
    }

    // Apply inline effects (HP, XP, flags, items, etc.)
    this.applyEffects(choice.effects);

    // Determine next section or ending
    const nextKey =
      choice.next ||
      choice.to ||
      choice.goto ||
      choice.target ||
      null;

    if (nextKey && this.story.scenes?.[nextKey]) {
      this.current = nextKey;
    } else if (nextKey && !this.story.scenes[nextKey]) {
      console.warn(`StoryAdapter: target section "${nextKey}" not found`);
      return;
    } else {
      console.warn("StoryAdapter: choice has no valid next target");
      return;
    }

    // Trigger engine re-render
    if (this.engine && typeof this.engine.displaySection === "function") {
      this.engine.displaySection();
    }

    // Autosave checkpoint
    this.saveCheckpoint();
  }

  // ✅ Apply any effects defined in the schema
  applyEffects(effects) {
    if (!effects) return;
    effects.forEach(effect => {
      if (effect.hp) this.state.hp += effect.hp;
      if (effect.xp) this.state.xp += effect.xp;
      if (effect.addFlag) this.state.flags.add(effect.addFlag);
      if (effect.item) this.state.inventory.push(effect.item);
    });
  }

  // ✅ Optional: save current section as checkpoint
  saveCheckpoint() {
    this.state.checkpoint = this.current;
    console.log(`💾 Checkpoint saved at ${this.current}`);
  }

  // ✅ Restart from checkpoint
  restoreCheckpoint() {
    if (!this.state.checkpoint) return;
    this.current = this.state.checkpoint;
    if (this.engine?.displaySection) this.engine.displaySection();
    console.log(`🔁 Restored from checkpoint: ${this.current}`);
  }

  // ✅ Reset state entirely
  reset() {
    this.current = this.story.start || "S01";
    this.state.hp = this.story.meta?.defaults?.hp ?? 100;
    this.state.xp = this.story.meta?.defaults?.xp ?? 0;
    this.state.flags.clear();
    this.state.inventory = [];
    this.state.checkpoint = null;
    console.log("🔄 Story reset");
  }
}
