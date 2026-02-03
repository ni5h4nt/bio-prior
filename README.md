# `bio-prior`

**A High-Performance Predictive Coding Engine & Systems-Observability Dashboard** *Built by Nishant Tyagi*

---

## 🎯 The Origin

`bio-prior` began as a personal tool to help my family and friends visualize a complex reality: **what it feels like to process the world through a neuro-divergent lens.** As a parent of a child on the Autism spectrum, I wanted to move past behavioral descriptions and show the "system architecture" of sensory overload. This project translates the **HIPPE (High Individual Posterior Predictive Error)** theory into a functional engineering simulation. It demonstrates how "Precision-Weighting"—the gain assigned to sensory prediction errors—governs the stability, metabolic cost, and perceptual fidelity of a biological world model.

## 🛠️ How it Works

The core of the project is a **State-Space Inference Engine** written in **Rust**. It treats the brain not as a reactive model, but as a **Predictive Pipeline**.

* **The Precision Slider:** A real-time control for "Synaptic Gain." By turning it up, you can see the system "overfit" to noise—simulating why a flickering light or a background hum can "crash" a child's internal model.
* **Computational Telemetry:** The dashboard tracks **CPU Cycle Spikes** in real-time. It demonstrates that sensory overload is a state of **computational exhaustion**, where the system runs out of cycles for higher-level cognitive tasks.
* **Compositional Encoding:** The engine decomposes signals into elemental axes, exploring how a "Neural Syntax" might allow for more efficient, multi-dimensional world-modeling.

## 🔬 Technical Stack

* **Inference Core:** Rust (for deterministic timing and low-level state management).
* **Observability Layer:** Python & Streamlit.
* **Theory:** Predictive Processing (PP) & HIPPE Framework.

## 👪 For Parents & Educators: "Through Their Eyes"

The project includes a multimodal module that reconstructs audio and video feeds based on different precision weights.

* **The Goal:** To show that an overwhelmed child isn't "misbehaving"—their "CPU" is simply maxed out by a high-gain sensory environment that neurotypical brains are evolved to ignore.

## 📊 Performance Metrics

| Metric | Neurotypical Mode | ASD Mode (High Precision) |
| --- | --- | --- |
| **Inference Latency** | Low (Optimized) | High (Iterative Refinement) |
| **System Entropy** | Low (Stable) | High (Jitter/Chaos) |
| **CPU Cycles/Update** | ~1.2x Base | ~4.5x Base |

## 🚀 Getting Started

1. **Build the Engine:**
```bash
cd rust-engine
maturin develop --release

```


2. **Launch the Dashboard:**
```bash
streamlit run app/main.py

```

---

*This is a personal project fueled by a desire to understand my son's world through the lens of systems engineering.*
