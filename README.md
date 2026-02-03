# bio-prior

**A Predictive Coding Simulation for Understanding Neurodivergent Sensory Processing**

*Built by Nishant Tyagi*

---

## The Origin

`bio-prior` began as a personal tool to help my family and friends visualize a complex reality: **what it feels like to process the world through a neurodivergent lens.** As a parent of a child on the Autism spectrum, I wanted to move past behavioral descriptions and show the "system architecture" of sensory overload.

This project translates the **HIPPE (High Individual Posterior Predictive Error)** theory into a functional engineering simulation. It demonstrates how "Precision Weighting"—the gain assigned to sensory prediction errors—governs the stability, metabolic cost, and perceptual fidelity of a biological world model.

---

## The Core Insight

When a child covers their ears, rocks, or leaves the room—they're not misbehaving. **These are solutions, not problems.** Their sensory system is running at maximum gain, processing every detail the rest of us filter out. Self-regulation strategies are how they manage the computational overload.

---

## How It Works

```
                    ┌─────────────────────────────────────┐
                    │         bio-prior Engine            │
                    ├─────────────────────────────────────┤
                    │                                     │
    Sensory     ┌───▼───┐    ┌───────────┐    ┌────────┐ │
    Input   ───►│ World │───►│ Precision │───►│ Output │ │
                │ Model │    │ Weighting │    │ Effect │ │
                └───────┘    └─────┬─────┘    └────────┘ │
                                   │                     │
                         ┌─────────▼─────────┐           │
                         │   The "Volume"    │           │
                         │      Knob         │           │
                         └───────────────────┘           │
                    └─────────────────────────────────────┘

Low Precision (Neurotypical):  Filter noise, stay calm, 5% energy
High Precision (ASD Mode):     Process ALL details, 90% energy → Overload
```

### The Precision Curve

The slider uses a **cubic mapping** to simulate how precision affects processing:

| Slider Range | Mode | Effect |
|-------------|------|--------|
| 0-70% | Neurotypical | Stable, filtered, low energy cost |
| 70-90% | Elevated | Noticeably reactive, fatigue builds |
| 90-100% | Overload | Rapid destabilization, system overwhelm |

---

## Architecture

```
bio-prior/
├── rust-core/              # WASM inference engine
│   ├── src/
│   │   ├── lib.rs          # Entry point, WASM exports
│   │   ├── precision.rs    # Slider-to-precision mapping
│   │   ├── reconstruction.rs # Visual effects pipeline
│   │   └── regulation.rs   # Self-regulation strategies
│   └── pkg/                # Compiled WASM output
│
├── frontend/               # Svelte UI (shared web + desktop)
│   ├── src/
│   │   ├── App.svelte      # Main application
│   │   └── lib/
│   │       ├── components/
│   │       │   ├── PrecisionSlider.svelte
│   │       │   ├── LoadGauge.svelte
│   │       │   ├── RegulationPanel.svelte
│   │       │   ├── VideoCanvas.svelte
│   │       │   └── AboutModal.svelte
│   │       └── wasm.ts     # TypeScript WASM bindings
│   ├── e2e/                # Playwright E2E tests
│   └── src-tauri/          # Tauri desktop wrapper
│
└── docs/plans/             # Design documentation
```

### Why This Stack?

| Layer | Technology | Rationale |
|-------|------------|-----------|
| **Inference Core** | Rust + WASM | Deterministic timing, no GC jitter, ~22KB compiled |
| **Frontend** | Svelte 5 | Minimal bundle, reactive without virtual DOM |
| **Desktop** | Tauri v2 | Native performance, 10x smaller than Electron |
| **Testing** | Playwright | Real browser testing with accessibility audits |

---

## Features

### Sensory Detail Slider
Adjusts precision weighting from calm (0%) to overload (100%). The cubic curve means small movements at low values are stable, while the high end escalates rapidly.

### Processing Load Gauge
Visualizes computational cost in real-time. Watch the CPU metric spike as precision increases—this is why overload leads to exhaustion.

### Regulation Strategies
Three evidence-based calming approaches appear when overload begins:

| Strategy | What It Does | Real-World Example |
|----------|-------------|-------------------|
| **Reduce Input** | Dims stimulation | Covering ears, closing eyes |
| **Rhythmic Pattern** | Adds predictability | Rocking, humming, stimming |
| **Take a Break** | Gradual fade to calm | Leaving the room, quiet time |

### About Modal
Educational overlay explaining HIPPE theory for parents and educators.

---

## Quick Start

### Prerequisites

- [Rust](https://rustup.rs/) (for building WASM)
- [Node.js 18+](https://nodejs.org/)
- [wasm-pack](https://rustwasm.github.io/wasm-pack/installer/)

### 1. Build the Rust Engine

```bash
cd rust-core
./build-wasm.sh
```

This compiles the inference core to WebAssembly (~22KB).

### 2. Install Frontend Dependencies

```bash
cd frontend
npm install
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Run Tests

```bash
# Rust unit tests (17 tests)
cd rust-core && cargo test

# Playwright E2E tests (14 tests)
cd frontend && npx playwright test
```

---

## Desktop App (Tauri)

For a native desktop experience:

```bash
cd frontend
npm run tauri dev
```

**Note:** Requires system dependencies for your platform:
- **Linux:** `libgtk-3-dev libwebkit2gtk-4.0-dev`
- **macOS:** Xcode command line tools
- **Windows:** WebView2

Build for distribution:

```bash
npm run tauri build
```

---

## Performance

| Metric | Target | Actual |
|--------|--------|--------|
| Slider latency | <50ms | ~10ms |
| Frame rate | 30fps | 60fps capable |
| WASM load time | <2s | ~100ms |
| Bundle size | <500KB | ~74KB |

---

## Test Coverage

| Suite | Tests | Coverage |
|-------|-------|----------|
| Rust precision | 7 | Property-based + determinism |
| Rust reconstruction | 4 | Effect ranges, frame integrity |
| Rust regulation | 6 | Strategy behavior, time evolution |
| Playwright E2E | 14 | Full user flows, accessibility |

---

## Future Roadmap (v2+)

- [ ] Python/Streamlit analysis dashboard for researchers
- [ ] Additional scenes (grocery store, playground)
- [ ] More regulation strategies (deep pressure, focus object)
- [ ] Session recording for educators
- [ ] Research-grade metrics export

---

## The Message

This project exists to build empathy through engineering. When you see someone struggling with sensory overload, remember: **their system is working exactly as designed—just at higher gain.** The behaviors we call "problems" are often the most effective solutions available.

---

*Dedicated to my son, and to every parent trying to see the world through their child's eyes.*

---

## License

MIT

## Contributing

Issues and PRs welcome. Please run tests before submitting.
