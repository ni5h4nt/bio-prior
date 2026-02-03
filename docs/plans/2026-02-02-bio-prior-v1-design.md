# bio-prior v1 Design Document

**Date:** 2026-02-02
**Author:** Nishant Tyagi
**Status:** Draft

---

## Overview

bio-prior is a predictive coding simulation that helps viewers understand sensory processing differences in autism. The core experience: a precision slider that demonstrates how high sensory gain leads to system overload—and how self-regulation strategies restore stability.

### Goals

1. **Communicate the HIPPE concept** to non-technical viewers (parents, educators)
2. **Maintain smooth performance** (<50ms latency, 30fps) until intentional breakdown
3. **Showcase Rust and Svelte skills** with a modern, performant architecture
4. **Deliver via web and desktop** for easy sharing and full-fidelity demos

### Non-Goals (v1)

- Python runtime dashboard (deferred to v2)
- Multiple scenes (one curated scene for v1)
- Session recording/export
- Research-grade metrics export

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        bio-prior v1                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                  RUST INFERENCE CORE                     │   │
│  │                                                          │   │
│  │  ┌────────────┐ ┌────────────┐ ┌────────────────────┐   │   │
│  │  │ State-Space│ │ Precision  │ │  Reconstruction    │   │   │
│  │  │  Engine    │ │ Weighting  │ │    Pipeline        │   │   │
│  │  └────────────┘ └────────────┘ └────────────────────┘   │   │
│  │                                                          │   │
│  │  ┌────────────────────────────────────────────────────┐ │   │
│  │  │            Regulation Strategies                    │ │   │
│  │  └────────────────────────────────────────────────────┘ │   │
│  └─────────┬───────────────────────────────┬────────────────┘   │
│            │                               │                    │
│    ┌───────▼───────┐               ┌───────▼───────┐           │
│    │  Native Lib   │               │     WASM      │           │
│    │  (for Tauri)  │               │  (for web)    │           │
│    └───────┬───────┘               └───────┬───────┘           │
│            │                               │                    │
│  ┌─────────▼─────────┐             ┌───────▼───────┐           │
│  │   TAURI DESKTOP   │             │   WEB DEMO    │           │
│  │   (Svelte UI)     │             │  (Svelte UI)  │           │
│  └───────────────────┘             └───────────────┘           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Key Principle

The Rust core is the single source of truth. Both frontends consume it—they differ only in presentation, not behavior.

---

## Rust Inference Core

### State-Space Engine

Maintains the "world model"—a probabilistic representation of expected sensory input.

```rust
pub struct WorldModel {
    prior: StateVector,        // What we expect
    posterior: StateVector,    // What we believe after observation
    precision: f32,            // Gain on prediction errors (0.0 - 1.0)
}

impl WorldModel {
    pub fn update(&mut self, observation: &SensoryInput) -> PredictionError {
        // 1. Compute prediction error: observation - prior
        // 2. Weight error by precision
        // 3. Update posterior via Bayesian update
        // 4. Return error magnitude (for metrics)
    }
}
```

When precision is high, small deviations cause large updates. The model never settles.

### Precision Weighting

Maps slider (0-100) to internal precision with non-linear scaling:

```rust
pub fn slider_to_precision(slider_value: u8) -> f32 {
    // Cubic curve: gentle at low values, steep at high
    // 0-70:  "neurotypical range" — stable
    // 70-90: "elevated" — noticeably reactive
    // 90-100: "overload" — rapid destabilization
    let normalized = slider_value as f32 / 100.0;
    (normalized * normalized * normalized).min(1.0)
}
```

### Reconstruction Pipeline

Applies precision-weighted distortions to audio/video frames:

| Channel | Effects at High Precision |
|---------|--------------------------|
| **Video** | Edge sharpening, color saturation, motion trails, jitter |
| **Audio** | High-frequency boost, reduced noise gating, echo/reverb |
| **Tactile (metaphor)** | Screen shake, static noise overlay |

### Regulation Strategies

Three strategies that reduce system chaos:

| Strategy | Effect | Implementation |
|----------|--------|----------------|
| **Reduce Input** | Dims video, mutes audio | Gain reduction on all channels |
| **Rhythmic Pattern** | Pulse overlay, steady beat | Predictable signal injection |
| **Take a Break** | Fade to calm neutral | Gradual transition to baseline |

---

## Svelte Frontend

One codebase shared between Tauri desktop and web demo.

### UI Layout

```
┌─────────────────────────────────────────────────────────────┐
│  bio-prior                                                  │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                   [Video Canvas]                      │  │
│  │                   720p, 30fps                         │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  Sensory Detail                                             │
│  ○━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━●━━━━━━○    │
│  calm                                              overload │
│                                                             │
│  Processing Load    ████████████████░░░░░░░░  72%          │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Regulation Strategies (appears at high load)       │   │
│  │  [Reduce Input]  [Rhythmic Pattern]  [Take a Break] │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  [Reset]                              [About this project]  │
└─────────────────────────────────────────────────────────────┘
```

### Components

| Component | Responsibility |
|-----------|----------------|
| `<VideoCanvas>` | Renders processed frames from Rust core |
| `<AudioPlayer>` | Plays processed audio synced to video |
| `<PrecisionSlider>` | Binds to precision value |
| `<LoadGauge>` | Simple bar showing computational cost |
| `<RegulationPanel>` | Strategy buttons, appears at overload threshold |
| `<AboutModal>` | Brief HIPPE explanation for curious viewers |

### Data Flow

```
User drags slider
       │
       ▼
precision value (0-100)
       │
       ▼
Rust: slider_to_precision(value)
       │
       ▼
Rust: process_frame(raw_frame, precision)
       │
       ▼
Returns: { processed_frame, processed_audio, cpu_cost }
       │
       ▼
Canvas renders frame, audio plays, gauge updates
       │
       ▼
Loop at 30fps via requestAnimationFrame
```

---

## Curated Scene: Classroom

### Requirements

- Familiar setting that viewers connect with emotionally
- Rich sensory detail to amplify
- Background motion (flickering lights, people moving)
- Ambient audio (HVAC, chatter, pencil scratching)
- 30-60 seconds duration

### Composition

**Visual:**
- Fluorescent lights (subtle flicker)
- Students moving (fidgeting, writing)
- Teacher at front
- Clock on wall
- Posters and decorations

**Audio:**
- HVAC hum (constant)
- Pencil scratches
- Whispered conversation
- Chair squeaks
- Distant hallway sounds
- Clock ticking

### Source

Stock footage for v1. Replace with custom content if needed.

---

## User Experience Flow

1. **Start:** Calm scene, slider at low position
2. **Explore:** User drags slider up, sees/hears gradual intensification
3. **Overload:** At high precision, system destabilizes—chaos, jitter, cacophony
4. **Regulation:** Strategies panel appears; user tries one, system stabilizes
5. **Release:** User releases strategy, chaos returns
6. **Message lands:** "These aren't problem behaviors. They're solutions."

---

## Project Structure

```
bio-prior/
├── rust-core/
│   ├── Cargo.toml
│   ├── src/
│   │   ├── lib.rs              # Main entry, exports
│   │   ├── inference.rs        # State-space engine
│   │   ├── precision.rs        # Slider mapping
│   │   ├── reconstruction.rs   # Video/audio processing
│   │   └── regulation.rs       # Calming strategy effects
│   └── tests/
│
├── frontend/                    # Svelte (shared web + Tauri)
│   ├── package.json
│   ├── src/
│   │   ├── App.svelte
│   │   ├── components/
│   │   │   ├── VideoCanvas.svelte
│   │   │   ├── AudioPlayer.svelte
│   │   │   ├── PrecisionSlider.svelte
│   │   │   ├── LoadGauge.svelte
│   │   │   ├── RegulationPanel.svelte
│   │   │   └── AboutModal.svelte
│   │   └── lib/
│   │       └── wasm.ts         # WASM bindings
│   └── static/
│       └── assets/
│           ├── classroom.mp4   # Video
│           └── classroom.wav   # Audio
│
├── tauri/
│   ├── Cargo.toml
│   ├── tauri.conf.json
│   └── src/
│       └── main.rs
│
├── docs/
│   └── plans/
│
└── README.md
```

---

## Build Targets

| Target | Command | Output |
|--------|---------|--------|
| WASM | `wasm-pack build rust-core --target web` | `pkg/` with JS bindings |
| Native | `cargo build --release -p rust-core` | Library for Tauri |
| Web dev | `cd frontend && npm run dev` | localhost:5173 |
| Tauri dev | `cd tauri && cargo tauri dev` | Native window |
| Web build | `cd frontend && npm run build` | `dist/` for hosting |
| Tauri build | `cd tauri && cargo tauri build` | Installer/app bundle |

---

## Performance Requirements

| Metric | Target |
|--------|--------|
| Slider latency | <50ms response |
| Frame rate | 30fps sustained |
| WASM load time | <2 seconds |
| Bundle size (web) | <500KB gzipped |

---

## Future Considerations (v2+)

- **Python/Streamlit analysis dashboard** for research use
- **Additional scenes** (grocery store, playground)
- **More regulation strategies** (deep pressure, focus object)
- **Session recording** for educators
- **Metrics export** for publication

---

## Open Questions

1. **Stock footage licensing:** Which service? Budget?
2. **Hosting:** Where to deploy web demo? (Vercel, Netlify, GitHub Pages)
3. **Audio processing library:** Web Audio API sufficient, or need Rust audio?

---

## Decision Log

| Decision | Rationale |
|----------|-----------|
| Rust + WASM over pure JS | Performance-critical reconstruction; showcases Rust skills |
| Svelte over React | Smaller bundle, no virtual DOM overhead, better for real-time |
| Tauri over Electron | Rust-native, smaller binary, aligns with tech stack |
| Single scene for v1 | Focus over breadth; one good scene beats three mediocre |
| Three regulation strategies | Covers different approaches without overwhelming UI |
| Screen shake for tactile | Low effort, high visceral impact |
