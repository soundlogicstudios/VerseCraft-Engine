/**
 * VerseCraft Core Engine
 * Handles story progression, state management, and runtime logic.
 */
import { validateSchema } from './utils/validators.js';

export class VerseCraftEngine {
  constructor(story, entities) {
    this.story = story;
    this.entities = entities;
    this.currentSection = story.sections[0];
    this.state = { stats: {}, inventory: [] };
  }

  start() {
    console.log('Engine started.');
    validateSchema(this.story, 'story');
  }

  makeChoice(choiceId) {
    const choice = this.currentSection.choices.find(c => c.next === choiceId);
    if (!choice) return console.warn('Invalid choice.');
    this.currentSection = this.story.sections.find(s => s.id === choiceId);
    console.log(`Moved to: ${this.currentSection.id}`);
  }
}
