<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <title>VerseCraft Engine Test</title>
  <style>
    html, body {
      margin: 0;
      padding: 0;
      height: 100%;
      overflow: hidden; /* 🚫 Disable body scrolling */
      background: #111;
      color: #eee;
      font-family: system-ui, sans-serif;
      text-align: center;
      -webkit-overflow-scrolling: none;
      overscroll-behavior: none; /* Prevent bounce / pull-down */
    }

    main {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      height: 100%;
      box-sizing: border-box;
      overflow: hidden;
    }

    button {
      margin: 0.5rem;
      padding: 10px 18px;
      background: #333;
      color: #eee;
      border: none;
      border-radius: 6px;
      font-size: 1rem;
    }

    #output {
      flex: 1;
      width: 90%;
      max-width: 600px;
      overflow-y: auto; /* ✅ Scrollable log area only */
      background: #000;
      color: #0f0;
      padding: 8px;
      margin: 1rem 0;
      font-family: monospace;
      text-align: left;
      border-radius: 6px;
    }

    footer {
      font-size: 0.8rem;
      color: #666;
      margin-bottom: 0.5rem;
    }
  </style>
</head>
<body>
  <main>
    <h1>VerseCraft Engine Test</h1>
    <div>
      <button id="startBtn">Start</button>
      <button id="stopBtn">Stop</button>
      <button id="resetBtn">Reset</button>
    </div>
    <div id="output"></div>
    <footer>VerseCraft Engine v1.1.2-state-loop-visual</footer>
  </main>

  <script type="module">
    import { VerseCraftEngine } from './core/engine.js';

    const output = document.getElementById('output');

    function log(msg) {
      output.innerHTML += msg + '<br>';
      output.scrollTop = output.scrollHeight;
      console.log(msg);
    }

    // Initialize engine with inline logger
    const engine = new VerseCraftEngine(log);
    log(`🧠 Engine ${engine.version} loaded`);

    // Button event handlers
    document.getElementById('startBtn').onclick = () => { log("▶️ Start pressed"); engine.start(); };
    document.getElementById('stopBtn').onclick  = () => { log("⏹ Stop pressed"); engine.stop(); };
    document.getElementById('resetBtn').onclick = () => { log("🔄 Reset pressed"); engine.reset(); };

    // Prevent accidental scroll bounce (especially iOS)
    window.addEventListener('touchmove', function (e) {
      if (!e.target.closest('#output')) e.preventDefault();
    }, { passive: false });
  </script>
</body>
</html>
