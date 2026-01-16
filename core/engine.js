// VerseCraft Engine – minimal working module
export class VerseCraftEngine {
  constructor() {
    this.version = "v1.1.0-state-loop";
    this.tickCount = 0;
    this.running = false;
  }

  start() {
    this.running = true;
    console.log("Engine started");
    this.loop();
  }

  loop() {
    if (!this.running) return;
    this.tickCount++;
    console.log(`Tick ${this.tickCount}`);
    requestAnimationFrame(() => this.loop());
  }

  stop() {
    this.running = false;
    console.log("Engine stopped");
  }

  reset() {
    this.tickCount = 0;
    console.log("Engine reset");
  }
}
