// storyloader.js – handles fetching JSON story data from /library/

export const storyloader = {
  /**
   * Load a specific story by ID (e.g., "world_of_lorecraft" or "echoes_beneath_the_lantern")
   * Falls back to world_of_lorecraft.json if no ID is provided.
   */
  async load(storyId = "world_of_lorecraft") {
    const path = `./library/${storyId}.json`;
    try {
      const response = await fetch(path);
      if (!response.ok) throw new Error(`Failed to fetch story JSON: ${path}`);
      const storyData = await response.json();
      console.log(`✅ Loaded story: ${storyData.meta?.title || storyId}`);
      return storyData;
    } catch (err) {
      console.error("❌ StoryLoader error:", err);
      return null;
    }
  },

  // Legacy alias (for compatibility)
  async loadDefault() {
    return await this.load("world_of_lorecraft");
  }
};
