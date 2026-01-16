// storyloader.js - catalog-based loader
export class storyloader {
  static async loadCatalog() {
    const res = await fetch('./library/catalog.json');
    return res.json();
  }

  static async loadStoryById(storyId) {
    const catalog = await storyloader.loadCatalog();
    const slot = catalog.slots?.find(s => s.storyId === storyId);
    if (!slot) throw new Error(`Story ID ${storyId} not found in catalog`);

    const path = `./library/${slot.path || storyId}.json`;
    const res = await fetch(path);
    return res.json();
  }
}
