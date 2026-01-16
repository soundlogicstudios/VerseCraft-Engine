// storyloader.js – dynamically loads any story JSON from the /library folder

export const storyloader = {
  async load(storyId = "world_of_lorecraft") {
    try {
      // build the correct path dynamically
      const path = `./library/${storyId}.json`;
      console.log(`[storyloader] fetching: ${path}`);

      const response = await fetch(path);
      if (!response.ok) throw new Error(`Failed to fetch story JSON at ${path}`);

      const data = await response.json();
      console.log(`[storyloader] loaded: ${data.meta?.title || storyId}`);
      return data;
    } catch (err) {
      console.error("[storyloader] error:", err);
      return null;
    }
  }
};
