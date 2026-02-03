# See the World Differently

**An interactive simulation that helps parents, teachers, and allies understand how autistic individuals experience sensory processing.**

🌐 **[Try the Live Demo](#quick-start)** • 📖 **[Learn the Science](#the-science)** • 🛠️ **[Development](#development)**

---

## What This Is

**bio-prior** is an educational tool that lets you experience — not just read about — how the autistic brain processes sensory information differently.

### Why "BioPrior"?

The name comes from Bayesian neuroscience. In predictive coding theory, your brain doesn't passively receive sensory data—it actively *predicts* what to expect using **priors** (prior beliefs). "Bio" refers to these biological priors encoded in neural circuits.

Research suggests autistic brains may weight sensory evidence more heavily than priors, causing every detail to demand attention equally. BioPrior lets you experience what happens when the brain's precision weighting shifts—when biological priors take a back seat to raw sensory input.

<p align="center">
  <strong>Drag the slider to the right → Watch the world become overwhelming</strong>
</p>

When a child covers their ears, rocks, or needs to leave the room — they're not misbehaving. **These are solutions, not problems.** Their sensory system is running at maximum gain, processing every detail the rest of us filter out.

---

## Who This Is For

| Audience | Why Use This |
|----------|--------------|
| **Parents** | Understand what your child experiences when they're overwhelmed |
| **Teachers** | Recognize sensory overload before it becomes a crisis |
| **Therapists** | Explain precision weighting to families visually |
| **Allies** | Build genuine empathy through experience, not just facts |

---

## The Experience

### Choose Your Scene
Switch between **Abstract** mode and real-world video scenes:
- 🏫 **Classroom** — Kids raising hands, visual movement
- 🛒 **Grocery Store** — Crowded aisles, sensory chaos
- 🎠 **Playground** — Children playing, unpredictable motion

### Starting Point: Neurotypical Mode (0-70%)
The simulation begins here. Background noise fades away. The brain efficiently filters out unimportant details. This is how most people experience a classroom, grocery store, or birthday party.

### Heightened Awareness (70-90%)
As you increase the slider, notice how:
- Visual noise begins to appear
- Colors become oversaturated
- Every detail demands attention
- The "Processing Load" meter climbs

### Sensory Overload (90-100%)
At maximum precision:
- The display shakes (visual overstimulation)
- Processing load becomes critical
- Red vignette indicates system stress
- **Self-regulation options appear** — these represent the strategies autistic individuals use to cope

---

## The Science

### Predictive Coding Basics

Your brain doesn't passively receive sensory data. Instead, it constantly *predicts* what it expects to see, hear, and feel. When reality matches the prediction, the signal is filtered out. When it doesn't match, the difference (called **prediction error**) gets amplified.

### The HIPPE Theory

Research suggests that many autistic brains assign higher **precision** (or "gain") to incoming sensory signals. This means:

- Every detail gets treated as important — the clock ticking, fabric textures, fluorescent hum
- The brain works overtime to process all this information
- What feels "normal" to neurotypical people can feel overwhelming

This is called **High Individual Posterior Predictive Error (HIPPE)**.

### Why "Stimming" Helps

Self-regulation strategies (often called "stimming") aren't misbehavior — they're the brain protecting itself:

| Strategy | What It Does | Real-World Examples |
|----------|-------------|---------------------|
| **Reduce Input** | Lowers incoming signals | Headphones, dimmed lights, closing eyes |
| **Rhythmic Motion** | Creates predictable patterns | Rocking, tapping, humming |
| **Taking a Break** | Lets the system reset | Leaving the room, quiet time |

---

## Quick Start

### Try It Now (Web)

**Prerequisites:**
- [Rust](https://rustup.rs/)
- [Node.js 18+](https://nodejs.org/)
- [wasm-pack](https://rustwasm.github.io/wasm-pack/installer/) — install with `cargo install wasm-pack`

```bash
# Clone the repo
git clone https://github.com/ni5h4nt/bio-prior.git
cd bio-prior

# Build the Rust/WASM engine
cd rust-core && ./build-wasm.sh

# Install frontend dependencies and start dev server
cd ../frontend && npm install && npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Desktop App

For a native experience using Tauri:

```bash
cd frontend && npm run tauri dev
```

---

## Development

### Architecture

```
bio-prior/
├── rust-core/              # WASM inference engine (22KB)
│   └── src/
│       ├── precision.rs    # Slider-to-precision cubic curve
│       ├── reconstruction.rs # Visual effects pipeline
│       └── regulation.rs   # Self-regulation strategies
│
├── frontend/               # Svelte 5 UI
│   ├── src/
│   │   ├── App.svelte      # Main application
│   │   └── lib/components/
│   │       ├── SplitViewCanvas.svelte  # Abstract visualization
│   │       ├── VideoSplitView.svelte   # Real-world video scenes
│   │       ├── SceneSelector.svelte    # Scene dropdown
│   │       ├── PrecisionSlider.svelte  # Sensory detail control
│   │       ├── LoadGauge.svelte        # Processing load meter
│   │       ├── RegulationPanel.svelte  # Self-regulation strategies
│   │       └── AboutDrawer.svelte      # Learn the science panel
│   ├── public/videos/      # Scene video assets
│   └── e2e/                # Playwright tests
│
└── docs/plans/             # Design documentation
```

### Tech Stack

| Layer | Technology | Why |
|-------|------------|-----|
| **Core Engine** | Rust + WASM | Deterministic timing, no GC jitter |
| **Frontend** | Svelte 5 | Reactive, minimal bundle size |
| **Desktop** | Tauri v2 | Native performance, small footprint |
| **Testing** | Playwright | Real browser E2E tests |

### Running Tests

```bash
# Rust unit tests (17 tests)
cd rust-core && cargo test

# Playwright E2E tests (14 tests)
cd frontend && npm run test:e2e
```

### Performance

| Metric | Target | Actual |
|--------|--------|--------|
| Slider latency | <50ms | ~10ms |
| Bundle size | <500KB | ~74KB |
| WASM load | <2s | ~100ms |

---

## Terminology Note

This project uses "autistic" and "autism" rather than only clinical terms like "ASD" (Autism Spectrum Disorder). Many in the autistic community prefer identity-first language. The tool aims to foster understanding, not pathologize.

---

## Roadmap

- [x] Video integration with real-world scenes
- [x] Additional scenarios (classroom, grocery store, playground)
- [x] Slide-out "Learn the Science" drawer
- [ ] Audio processing (sensory amplification simulation)
- [ ] More regulation strategies (deep pressure, focus object)
- [ ] Session recording for educators
- [ ] Research export tools

---

## The Message

> *When you see someone struggling with sensory overload, remember: their system is working exactly as designed — just at higher gain. The behaviors we call "problems" are often the most effective solutions available.*

---

*Dedicated to my son, and to every parent trying to see the world through their child's eyes.*

Built with care by [Nishant Tyagi](https://github.com/ni5h4nt)

---

## License

MIT

## Contributing

Issues and PRs welcome. Please run tests before submitting.
