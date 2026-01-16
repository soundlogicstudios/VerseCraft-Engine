// VerseCraft Engine – Phase 2 : State + Loop Validation
export class VerseCraftEngine {
  constructor() {
    this.version = "v1.1.0-state-loop";
    this.state = {
      tickCount: 0,
      lastUpdate: performance.now(),
      isRunning: false,
      testValue: 0
    };
    console.log(`[VerseCraft] Constructed :: ${this.version}`);
  }

  start() {
    console.log("[VerseCraft] Starting engine loop…");
    this.state.isRunning = true;
    this.loop();
  }

  loop() {
    if (!this.state.isRunning) return;

    const now = performance.now();
    const delta = now - this.state.lastUpdate;

    // Do work roughly once per second
    if (delta >= 1000) {
      this.state.tickCount++;
      this.state.lastUpdate = now;
      this.state.testValue += Math.round(Math.random() * 10);
      console.log(`[Tick ${this.state.tickCount}] TestValue = ${this.state.testValue}`);
    }

    requestAnimationFrame(() => this.loop());
  }

  stop() {
    console.log("[VerseCraft] Engine loop stopped.");
    this.state.isRunning = false;
  }

  reset() {
    console.log("[VerseCraft] Engine state reset.");
    this.state.tickCount = 0;
    this.state.testValue = 0;
    this.state.lastUpdate = performance.now();
  }
}
