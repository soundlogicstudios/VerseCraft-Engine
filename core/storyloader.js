// storyloader.js - lowercase canonical version
export const storyloader = {
  async load(storyId = "world_of_lorecraft") {
    try {
      const path = `./library/${storyId}.json`;
      console.log(`[storyloader] loading: ${path}`);
      const response = await fetch(path);
      if (!response.ok) throw new Error(`failed to fetch story json`);
      const data = await response.json();
      console.log(`[storyloader] loaded: ${data.meta?.title || storyId}`);
      return data;
    } catch (err) {
      console.error("[storyloader] error:", err);
      return null;
    }
  },

  async loadDefault() {
    console.warn("[storyloader] loadDefault() is deprecated — use load(storyId).");
    return await this.load("world_of_lorecraft");
  }
};
