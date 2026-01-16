// VerseCraft Engine – v1.1.1 state loop with visual output hook
export class VerseCraftEngine {
  constructor(outputCallback) {
    this.version = "v1.1.1-state-loop";
    this.tickCount = 0;
    this.running = false;
    this.output = outputCallback || console.log;
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
