# Video Integration Design

**Date:** 2026-02-02
**Author:** Nishant Tyagi
**Status:** Approved
**Branch:** feat/video-integration

---

## Overview

Add real-world video scenarios as an alternative to the abstract canvas visualization. Users can switch between modes via dropdown. The goal is authentic representation of how autistic individuals experience sensory environments—where audio is often more overwhelming than visuals.

### Goals

1. Show first-person footage of real environments (classroom, grocery store, playground)
2. Apply precision-weighted effects that authentically simulate sensory overload
3. Prioritize audio processing—"everything equally loud" is the core experience
4. Maintain side-by-side comparison (neurotypical vs current experience)
5. Reuse existing UI components (slider, gauge, regulation panel)

### Non-Goals

- User-uploaded video (future consideration)
- WebGL shaders (CSS + canvas overlay sufficient for v1)
- Real-time camera feed processing

---

## Architecture

### Mode System

```
┌─────────────────────────────────────────────────────┐
│              SceneSelector (dropdown)               │
│   [Abstract ▼] [Classroom] [Grocery] [Playground]   │
├────────────────────────┬────────────────────────────┤
│   Neurotypical View    │    Current Experience      │
│   ─────────────────    │    ──────────────────      │
│   <video> normal       │    <video> + effects       │
│   Base audio only      │    Full audio processing   │
│   "What others see"    │    "What you experience"   │
├────────────────────────┴────────────────────────────┤
│              PrecisionSlider + LoadGauge            │
├─────────────────────────────────────────────────────┤
│              RegulationPanel (when ≥70%)            │
└─────────────────────────────────────────────────────┘
```

### Component Structure

```
frontend/src/lib/components/
├── SceneSelector.svelte      ← NEW: Dropdown for mode selection
├── VideoSplitView.svelte     ← NEW: Split video view with effects
├── AudioProcessor.svelte     ← NEW: Web Audio API handling
├── SplitViewCanvas.svelte    ← EXISTING: Abstract mode (unchanged)
└── App.svelte                ← MODIFIED: Conditional rendering
```

---

## Audio Processing

### Hybrid Audio Architecture

Each video scene ships with:
- **1 base ambient track** — Full environment sound
- **2-3 highlight tracks** — Isolated sounds prominent at high precision

### Classroom Audio Example

| Track | At 20% precision | At 90% precision |
|-------|------------------|------------------|
| Base ambient | 100% volume, mild compression | 100% volume, heavy compression |
| Clock tick | Silent | 80% volume, panned |
| Pencil scratch | Silent | 70% volume, high-freq boost |
| Whisper loop | Silent | 60% volume |

### Web Audio API Chain

```
video.audioTrack ──► GainNode ──► DynamicsCompressor ──► BiquadFilter ──► destination
                                       │                      │
highlight1 ──► GainNode ────────────────┴──────────────────────┘
highlight2 ──► GainNode ────────────────┘
```

### Key Behaviors

- Compression threshold drops as precision rises (brings up quiet sounds)
- High-frequency shelf gain increases with precision
- Highlight tracks fade in above 50% precision
- Neurotypical side plays base audio at low volume, no processing

---

## Visual Effects

### Layered Approach

```
┌─────────────────────────────────────┐
│  <video> element (base layer)       │
├─────────────────────────────────────┤
│  CSS filters on video               │
├─────────────────────────────────────┤
│  <canvas> overlay (noise texture)   │
├─────────────────────────────────────┤
│  <div> vignette overlay             │
└─────────────────────────────────────┘
     ↑
     └── Container with shake transform
```

### CSS Filter Progression

| Precision | Contrast | Saturation | Brightness |
|-----------|----------|------------|------------|
| 20% | 1.0 | 1.0 | 1.0 |
| 50% | 1.1 | 1.2 | 1.05 |
| 70% | 1.2 | 1.4 | 1.1 |
| 90% | 1.35 | 1.6 | 1.15 |

### Effect Mapping

- **Contrast boost** — edges pop, details demand attention
- **Saturation boost** — colors feel intense, "louder"
- **Brightness boost** — fluorescent lights glare
- **Noise overlay** — visual static, sensory "fuzz"
- **Shake** — instability (above 70%)
- **Vignette** — tunnel vision (above 90%)

---

## Asset Sourcing

### Videos

| Scene | Search Terms | Source | Requirements |
|-------|--------------|--------|--------------|
| Classroom | "classroom POV", "student desk view" | Pexels, Pixabay | 720p+, 30s+, movement |
| Grocery Store | "grocery store walking", "supermarket POV" | Pexels, Pixabay | 720p+, 30s+, fluorescent |
| Playground | "playground POV", "recess children" | Pexels, Pixabay | 720p+, 30s+, outdoor |

### Audio

- **Base tracks:** Freesound.org, YouTube Audio Library
- **Highlight sounds:** Freesound.org (isolated recordings)

### Processing

```bash
ffmpeg -i raw.mp4 -t 60 -vf scale=1280:720 -c:v libx264 scene.mp4
ffmpeg -i raw.wav -af "loudnorm,atrim=0:60" -c:a aac ambient.m4a
```

### Bundle Size

- 3 videos × ~5MB = ~15MB
- 12 audio tracks × ~200KB = ~2.4MB
- **Total: ~18MB**

---

## Error Handling

### Video Loading
- Show spinner while buffering
- Fall back to abstract mode if video fails
- Preload on dropdown hover for faster switching

### Audio Context
- Web Audio requires user interaction to start
- Show "Click to enable audio" if suspended
- Degrade gracefully to video-only if unavailable

### Mobile
- Start muted, show "Tap for audio" button
- Reduce to 480p on mobile
- Stack split-view vertically on narrow screens

### Performance
- Only one video loaded at a time
- Pause when tab not visible
- Audio processing at 30fps update rate

---

## Testing Strategy

### E2E Tests (Playwright)

| Test | Description |
|------|-------------|
| Scene selector appears | Dropdown visible with all 4 options |
| Switch to classroom | Video loads and plays |
| Precision affects video | CSS filters change with slider |
| Audio responds to precision | Effects increase |
| Regulation reduces effects | Strategy click reduces intensity |
| Mobile responsive | Split-view stacks vertically |
| Fallback on error | Abstract mode if video fails |

### Manual Testing

- [ ] Videos loop seamlessly
- [ ] Audio sync maintained
- [ ] No memory leaks switching scenes
- [ ] Highlight sounds fade naturally
- [ ] Effects feel authentic

---

## Success Criteria

1. Parents/teachers can see the same environment from both perspectives
2. Audio creates visceral "everything is loud" experience at high precision
3. Switching between modes is instant and seamless
4. Regulation strategies provide visible/audible relief
5. Works on mobile with graceful degradation
