// VerseCraft Engine – v1.1.2 visual output integration
export class VerseCraftEngine {
  constructor(outputCallback) {
    this.version = "v1.1.2-state-loop-visual";
    this.tickCount = 0;
    this.running = false;
    this.output = outputCallback || console.log; // default to console if no callback
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.output("🟢 Engine started");
    this.loop();
  }

  loop() {
    if (!this.running) return;
    this.tickCount++;
    this.output(`Tick ${this.tickCount}`);
    requestAnimationFrame(() => this.loop());
  }

  stop() {
    if (!this.running) return;
    this.running = false;
    this.output("🔴 Engine stopped");
  }

  reset() {
    this.tickCount = 0;
    this.output("♻️ Engine reset");
  }
}
