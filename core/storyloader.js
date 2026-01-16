
// storyloader.js – handles fetching JSON story data from library/

export const storyloader = {
  async loadDefault() {
    try {
      const response = await fetch('./library/world_of_lorecraft.json');
      if (!response.ok) throw new Error("failed to fetch story JSON");
      return await response.json();
    } catch (err) {
      console.error("storyloader error:", err);
      return null;
    }
  }
};
