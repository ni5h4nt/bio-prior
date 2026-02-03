# Video Integration Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add real-world video scenarios (classroom, grocery store, playground) as alternative to abstract canvas visualization with authentic sensory overload simulation.

**Architecture:** SceneSelector dropdown switches between Abstract mode (existing SplitViewCanvas) and video scenes. VideoSplitView renders two synced `<video>` elements with CSS filter effects. AudioProcessor uses Web Audio API for "everything equally loud" simulation. All components reuse existing precision/regulation state from App.svelte.

**Tech Stack:** Svelte 5, Web Audio API, CSS filters, Playwright E2E

---

## Phase 0: Infrastructure Setup

### Task 0.1: Initialize Progress Tracking

**Step 1: Initialize engineering progress**

Run:
```bash
~/.claude/engineering/engineering.sh progress init "docs/plans/2026-02-03-video-integration-implementation.md" "video-integration" 12
```

**Step 2: Commit plan**

```bash
git add docs/plans/2026-02-03-video-integration-implementation.md
git commit -m "docs: add video integration implementation plan"
```

---

## Phase 1: Scene Selector Component

### Task 1.1: SceneSelector - Failing Test

**Files:**
- Create: `frontend/e2e/scene-selector.spec.ts`

**Step 1: Write the failing test**

```typescript
import { test, expect } from '@playwright/test';

test.describe('SceneSelector', () => {
  test('dropdown renders with Abstract as default', async ({ page }) => {
    await page.goto('/');
    const selector = page.getByRole('combobox', { name: /scene/i });
    await expect(selector).toBeVisible();
    await expect(selector).toHaveValue('abstract');
  });

  test('shows all scene options', async ({ page }) => {
    await page.goto('/');
    const selector = page.getByRole('combobox', { name: /scene/i });
    await selector.click();

    await expect(page.getByRole('option', { name: /abstract/i })).toBeVisible();
    await expect(page.getByRole('option', { name: /classroom/i })).toBeVisible();
    await expect(page.getByRole('option', { name: /grocery/i })).toBeVisible();
    await expect(page.getByRole('option', { name: /playground/i })).toBeVisible();
  });

  test('switching scene dispatches change event', async ({ page }) => {
    await page.goto('/');
    const selector = page.getByRole('combobox', { name: /scene/i });
    await selector.selectOption('classroom');
    await expect(selector).toHaveValue('classroom');
  });
});
```

**Step 2: Run test to verify it fails**

Run: `cd frontend && npx playwright test e2e/scene-selector.spec.ts`
Expected: FAIL - selector not found

**Step 3: Commit failing test**

```bash
git add frontend/e2e/scene-selector.spec.ts
git commit -m "test: add SceneSelector failing tests"
```

---

### Task 1.2: SceneSelector - Implementation

**Files:**
- Create: `frontend/src/lib/components/SceneSelector.svelte`

**Step 1: Write minimal implementation**

```svelte
<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let value: string = 'abstract';

  const dispatch = createEventDispatcher<{
    change: { scene: string };
  }>();

  const scenes = [
    { id: 'abstract', label: 'Abstract', icon: '◆' },
    { id: 'classroom', label: 'Classroom', icon: '🏫' },
    { id: 'grocery', label: 'Grocery Store', icon: '🛒' },
    { id: 'playground', label: 'Playground', icon: '🎠' },
  ];

  function handleChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    value = target.value;
    dispatch('change', { scene: value });
  }
</script>

<div class="scene-selector">
  <label for="scene-select" class="label">Scene</label>
  <select
    id="scene-select"
    {value}
    on:change={handleChange}
    aria-label="Scene"
  >
    {#each scenes as scene (scene.id)}
      <option value={scene.id}>{scene.icon} {scene.label}</option>
    {/each}
  </select>
</div>

<style>
  .scene-selector {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .label {
    font-size: 0.875rem;
    font-weight: 500;
    color: #6b7280;
  }

  select {
    padding: 0.5rem 2rem 0.5rem 0.75rem;
    font-size: 0.875rem;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    background: white;
    cursor: pointer;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E");
    background-position: right 0.5rem center;
    background-repeat: no-repeat;
    background-size: 1.25rem;
  }

  select:hover {
    border-color: #9ca3af;
  }

  select:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
</style>
```

**Step 2: Run test to verify it passes**

Run: `cd frontend && npx playwright test e2e/scene-selector.spec.ts`
Expected: FAIL - component not mounted in App yet

**Step 3: Commit component**

```bash
git add frontend/src/lib/components/SceneSelector.svelte
git commit -m "feat: add SceneSelector component"
```

---

### Task 1.3: Integrate SceneSelector into App

**Files:**
- Modify: `frontend/src/App.svelte`

**Step 1: Add import and state**

At top of `<script>` section, add:

```typescript
import SceneSelector from './lib/components/SceneSelector.svelte';

let currentScene = 'abstract';

function handleSceneChange(event: CustomEvent<{ scene: string }>) {
  currentScene = event.detail.scene;
}
```

**Step 2: Add SceneSelector to template**

After the header div, before SplitViewCanvas:

```svelte
<SceneSelector value={currentScene} on:change={handleSceneChange} />
```

**Step 3: Run test to verify it passes**

Run: `cd frontend && npx playwright test e2e/scene-selector.spec.ts`
Expected: PASS

**Step 4: Commit integration**

```bash
git add frontend/src/App.svelte
git commit -m "feat: integrate SceneSelector into App"
```

---

### Task 1.END: Phase 1 Gate

Run:
```bash
~/.claude/engineering/engineering.sh phase-gate "docs/plans/2026-02-03-video-integration-implementation.md" 1
```

---

## Phase 2: Video Split View Component

### Task 2.1: VideoSplitView - Failing Test

**Files:**
- Create: `frontend/e2e/video-split-view.spec.ts`

**Step 1: Write the failing test**

```typescript
import { test, expect } from '@playwright/test';

test.describe('VideoSplitView', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    const selector = page.getByRole('combobox', { name: /scene/i });
    await selector.selectOption('classroom');
  });

  test('renders two video elements', async ({ page }) => {
    const videos = page.locator('video');
    await expect(videos).toHaveCount(2);
  });

  test('videos have correct labels', async ({ page }) => {
    await expect(page.getByText('Neurotypical View')).toBeVisible();
    await expect(page.getByText('Current Experience')).toBeVisible();
  });

  test('applies CSS filters at high precision', async ({ page }) => {
    const slider = page.getByRole('slider', { name: /sensory detail/i });
    await slider.fill('85');

    const effectVideo = page.locator('[data-testid="effect-video"]');
    const filter = await effectVideo.evaluate((el) =>
      window.getComputedStyle(el).filter
    );

    expect(filter).toContain('contrast');
    expect(filter).toContain('saturate');
  });

  test('applies shake transform above 70%', async ({ page }) => {
    const slider = page.getByRole('slider', { name: /sensory detail/i });
    await slider.fill('75');

    // Wait for animation frame
    await page.waitForTimeout(100);

    const container = page.locator('[data-testid="effect-container"]');
    const transform = await container.evaluate((el) =>
      window.getComputedStyle(el).transform
    );

    expect(transform).not.toBe('none');
  });
});
```

**Step 2: Run test to verify it fails**

Run: `cd frontend && npx playwright test e2e/video-split-view.spec.ts`
Expected: FAIL - no video elements

**Step 3: Commit failing test**

```bash
git add frontend/e2e/video-split-view.spec.ts
git commit -m "test: add VideoSplitView failing tests"
```

---

### Task 2.2: VideoSplitView - Implementation

**Files:**
- Create: `frontend/src/lib/components/VideoSplitView.svelte`

**Step 1: Write implementation**

```svelte
<script lang="ts">
  import { onMount } from 'svelte';

  export let scene: string = 'classroom';
  export let precision: number = 20;
  export let shakeIntensity: number = 0;

  let leftVideo: HTMLVideoElement;
  let rightVideo: HTMLVideoElement;
  let animationFrame: number;
  let shakeX = 0;
  let shakeY = 0;

  const sceneVideos: Record<string, string> = {
    classroom: '/videos/classroom.mp4',
    grocery: '/videos/grocery.mp4',
    playground: '/videos/playground.mp4',
  };

  // Visual effect calculations
  $: intensity = precision / 100;
  $: contrast = 1 + intensity * 0.35;
  $: saturation = 1 + intensity * 0.6;
  $: brightness = 1 + intensity * 0.15;
  $: noiseOpacity = intensity * 0.3;
  $: showVignette = precision >= 90;
  $: cssFilter = `contrast(${contrast}) saturate(${saturation}) brightness(${brightness})`;

  // Sync videos
  $: if (leftVideo && rightVideo) {
    syncVideos();
  }

  function syncVideos() {
    if (leftVideo && rightVideo) {
      rightVideo.currentTime = leftVideo.currentTime;
    }
  }

  function updateShake() {
    if (shakeIntensity > 0) {
      const time = Date.now() / 50;
      shakeX = Math.sin(time) * shakeIntensity;
      shakeY = Math.cos(time * 1.3) * shakeIntensity * 0.7;
    } else {
      shakeX = 0;
      shakeY = 0;
    }
    animationFrame = requestAnimationFrame(updateShake);
  }

  onMount(() => {
    updateShake();
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  });

  function handleVideoError(event: Event) {
    console.error('Video load error:', event);
  }
</script>

<div class="video-split-view">
  <div class="video-panel">
    <h3 class="panel-label">Neurotypical View</h3>
    <div class="video-container">
      <video
        bind:this={leftVideo}
        src={sceneVideos[scene]}
        autoplay
        loop
        muted
        playsinline
        on:error={handleVideoError}
      />
    </div>
  </div>

  <div class="video-panel">
    <h3 class="panel-label">Current Experience</h3>
    <div
      class="video-container effect-container"
      data-testid="effect-container"
      style="transform: translate({shakeX}px, {shakeY}px)"
    >
      <video
        bind:this={rightVideo}
        src={sceneVideos[scene]}
        autoplay
        loop
        muted
        playsinline
        style="filter: {cssFilter}"
        data-testid="effect-video"
        on:error={handleVideoError}
        on:timeupdate={syncVideos}
      />

      <!-- Noise overlay -->
      <div
        class="noise-overlay"
        style="opacity: {noiseOpacity}"
      />

      <!-- Vignette overlay -->
      {#if showVignette}
        <div class="vignette-overlay" />
      {/if}
    </div>
  </div>
</div>

<style>
  .video-split-view {
    display: flex;
    gap: 1rem;
    width: 100%;
    max-width: 720px;
    margin: 0 auto;
  }

  .video-panel {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .panel-label {
    font-size: 0.875rem;
    font-weight: 500;
    color: #6b7280;
    text-align: center;
    margin: 0;
  }

  .video-container {
    position: relative;
    border-radius: 0.75rem;
    overflow: hidden;
    background: #1f2937;
    aspect-ratio: 4/3;
  }

  .effect-container {
    transition: transform 0.05s linear;
  }

  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .noise-overlay {
    position: absolute;
    inset: 0;
    pointer-events: none;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
    mix-blend-mode: overlay;
    transition: opacity 0.3s ease;
  }

  .vignette-overlay {
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: radial-gradient(
      ellipse at center,
      transparent 40%,
      rgba(0, 0, 0, 0.6) 100%
    );
    animation: vignettePulse 2s ease-in-out infinite;
  }

  @keyframes vignettePulse {
    0%, 100% { opacity: 0.8; }
    50% { opacity: 1; }
  }

  @media (max-width: 640px) {
    .video-split-view {
      flex-direction: column;
    }
  }
</style>
```

**Step 2: Commit component**

```bash
git add frontend/src/lib/components/VideoSplitView.svelte
git commit -m "feat: add VideoSplitView component with CSS filter effects"
```

---

### Task 2.3: Integrate VideoSplitView into App

**Files:**
- Modify: `frontend/src/App.svelte`

**Step 1: Add import**

```typescript
import VideoSplitView from './lib/components/VideoSplitView.svelte';
```

**Step 2: Add conditional rendering**

Replace or wrap the SplitViewCanvas with:

```svelte
{#if currentScene === 'abstract'}
  <SplitViewCanvas
    precision={effectivePrecision}
    {shakeIntensity}
    {noiseIntensity}
  />
{:else}
  <VideoSplitView
    scene={currentScene}
    precision={effectivePrecision}
    {shakeIntensity}
  />
{/if}
```

**Step 3: Run tests**

Run: `cd frontend && npx playwright test e2e/video-split-view.spec.ts`
Expected: Some tests may fail due to missing video files (expected)

**Step 4: Commit integration**

```bash
git add frontend/src/App.svelte
git commit -m "feat: integrate VideoSplitView with scene switching"
```

---

### Task 2.4: Add Placeholder Videos

**Files:**
- Create: `frontend/static/videos/` directory

**Step 1: Create placeholder video files**

For initial development, create simple placeholder videos or download from Pexels/Pixabay.

```bash
mkdir -p frontend/static/videos
```

**Note:** Actual video assets should be sourced from:
- Pexels: search "classroom POV", "grocery store walking", "playground POV"
- Target: 720p, 30-60 seconds, loopable

For now, create a simple test video with ffmpeg or download sample videos.

**Step 2: Run full test suite**

Run: `cd frontend && npx playwright test e2e/video-split-view.spec.ts`
Expected: PASS (with videos in place)

**Step 3: Commit placeholder structure**

```bash
git add frontend/static/videos/.gitkeep
git commit -m "chore: add videos directory structure"
```

---

### Task 2.END: Phase 2 Gate

Run:
```bash
~/.claude/engineering/engineering.sh phase-gate "docs/plans/2026-02-03-video-integration-implementation.md" 2
```

---

## Phase 3: Audio Processing

### Task 3.1: AudioProcessor - Failing Test

**Files:**
- Create: `frontend/e2e/audio-processor.spec.ts`

**Step 1: Write the failing test**

```typescript
import { test, expect } from '@playwright/test';

test.describe('AudioProcessor', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    const selector = page.getByRole('combobox', { name: /scene/i });
    await selector.selectOption('classroom');
  });

  test('shows audio enable button initially', async ({ page }) => {
    const audioButton = page.getByRole('button', { name: /enable audio|unmute/i });
    await expect(audioButton).toBeVisible();
  });

  test('audio button click starts audio context', async ({ page }) => {
    const audioButton = page.getByRole('button', { name: /enable audio|unmute/i });
    await audioButton.click();

    // Button should change state after click
    await expect(page.getByRole('button', { name: /mute|disable audio/i })).toBeVisible();
  });

  test('mute button stops audio', async ({ page }) => {
    // Enable audio first
    const enableButton = page.getByRole('button', { name: /enable audio|unmute/i });
    await enableButton.click();

    // Now mute
    const muteButton = page.getByRole('button', { name: /mute|disable audio/i });
    await muteButton.click();

    // Should show enable button again
    await expect(page.getByRole('button', { name: /enable audio|unmute/i })).toBeVisible();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `cd frontend && npx playwright test e2e/audio-processor.spec.ts`
Expected: FAIL - no audio button

**Step 3: Commit failing test**

```bash
git add frontend/e2e/audio-processor.spec.ts
git commit -m "test: add AudioProcessor failing tests"
```

---

### Task 3.2: AudioProcessor - Implementation

**Files:**
- Create: `frontend/src/lib/components/AudioProcessor.svelte`

**Step 1: Write implementation**

```svelte
<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  export let scene: string = 'classroom';
  export let precision: number = 20;
  export let enabled: boolean = false;

  let audioContext: AudioContext | null = null;
  let baseSource: MediaElementAudioSourceNode | null = null;
  let compressor: DynamicsCompressorNode | null = null;
  let highShelf: BiquadFilterNode | null = null;
  let gainNode: GainNode | null = null;
  let audioElement: HTMLAudioElement | null = null;
  let isPlaying = false;

  const sceneAudio: Record<string, { base: string; highlights: string[] }> = {
    classroom: {
      base: '/audio/classroom-ambient.mp3',
      highlights: ['/audio/clock-tick.mp3', '/audio/pencil-scratch.mp3'],
    },
    grocery: {
      base: '/audio/grocery-ambient.mp3',
      highlights: ['/audio/cart-wheels.mp3', '/audio/checkout-beep.mp3'],
    },
    playground: {
      base: '/audio/playground-ambient.mp3',
      highlights: ['/audio/kids-shouting.mp3', '/audio/swing-creak.mp3'],
    },
  };

  // Audio effect calculations based on precision
  $: intensity = precision / 100;
  $: compressionThreshold = -24 + (intensity * 20); // -24 to -4 dB
  $: compressionRatio = 4 + (intensity * 8); // 4:1 to 12:1
  $: highShelfGain = intensity * 12; // 0 to 12 dB boost
  $: masterGain = 0.3 + (intensity * 0.4); // 0.3 to 0.7

  // Update audio parameters reactively
  $: if (compressor && highShelf && gainNode) {
    compressor.threshold.value = compressionThreshold;
    compressor.ratio.value = compressionRatio;
    highShelf.gain.value = highShelfGain;
    gainNode.gain.value = enabled ? masterGain : 0;
  }

  async function initAudio() {
    if (audioContext) return;

    audioContext = new AudioContext();

    // Create audio element
    audioElement = new Audio(sceneAudio[scene]?.base || sceneAudio.classroom.base);
    audioElement.loop = true;
    audioElement.crossOrigin = 'anonymous';

    // Create nodes
    baseSource = audioContext.createMediaElementSource(audioElement);
    compressor = audioContext.createDynamicsCompressor();
    highShelf = audioContext.createBiquadFilter();
    gainNode = audioContext.createGain();

    // Configure compressor
    compressor.threshold.value = compressionThreshold;
    compressor.knee.value = 10;
    compressor.ratio.value = compressionRatio;
    compressor.attack.value = 0.003;
    compressor.release.value = 0.25;

    // Configure high shelf filter (boost high frequencies)
    highShelf.type = 'highshelf';
    highShelf.frequency.value = 3000;
    highShelf.gain.value = highShelfGain;

    // Configure gain
    gainNode.gain.value = masterGain;

    // Connect chain: source -> compressor -> highShelf -> gain -> destination
    baseSource.connect(compressor);
    compressor.connect(highShelf);
    highShelf.connect(gainNode);
    gainNode.connect(audioContext.destination);
  }

  async function toggleAudio() {
    if (!enabled) {
      await initAudio();
      if (audioContext?.state === 'suspended') {
        await audioContext.resume();
      }
      if (audioElement) {
        await audioElement.play();
        isPlaying = true;
      }
      enabled = true;
    } else {
      if (audioElement) {
        audioElement.pause();
        isPlaying = false;
      }
      enabled = false;
    }
  }

  // Handle scene changes
  $: if (audioElement && scene) {
    const newSrc = sceneAudio[scene]?.base;
    if (newSrc && audioElement.src !== newSrc) {
      audioElement.src = newSrc;
      if (isPlaying) {
        audioElement.play();
      }
    }
  }

  onDestroy(() => {
    if (audioElement) {
      audioElement.pause();
      audioElement = null;
    }
    if (audioContext) {
      audioContext.close();
      audioContext = null;
    }
  });
</script>

<button
  class="audio-toggle"
  class:enabled
  on:click={toggleAudio}
  aria-label={enabled ? 'Mute audio' : 'Enable audio'}
>
  {#if enabled}
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
      <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 11-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z" />
      <path d="M15.932 7.757a.75.75 0 011.061 0 6 6 0 010 8.486.75.75 0 01-1.06-1.061 4.5 4.5 0 000-6.364.75.75 0 010-1.06z" />
    </svg>
    <span>Audio On</span>
  {:else}
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
      <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM17.78 9.22a.75.75 0 10-1.06 1.06L18.44 12l-1.72 1.72a.75.75 0 001.06 1.06l1.72-1.72 1.72 1.72a.75.75 0 101.06-1.06L20.56 12l1.72-1.72a.75.75 0 00-1.06-1.06l-1.72 1.72-1.72-1.72z" />
    </svg>
    <span>Enable Audio</span>
  {/if}
</button>

<style>
  .audio-toggle {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: #6b7280;
    background: white;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .audio-toggle:hover {
    border-color: #9ca3af;
    background: #f9fafb;
  }

  .audio-toggle.enabled {
    color: #059669;
    border-color: #10b981;
    background: #ecfdf5;
  }

  .audio-toggle.enabled:hover {
    background: #d1fae5;
  }
</style>
```

**Step 2: Commit component**

```bash
git add frontend/src/lib/components/AudioProcessor.svelte
git commit -m "feat: add AudioProcessor with Web Audio API compression"
```

---

### Task 3.3: Integrate AudioProcessor into App

**Files:**
- Modify: `frontend/src/App.svelte`

**Step 1: Add import and state**

```typescript
import AudioProcessor from './lib/components/AudioProcessor.svelte';

let audioEnabled = false;
```

**Step 2: Add AudioProcessor to template**

After SceneSelector, add:

```svelte
{#if currentScene !== 'abstract'}
  <AudioProcessor
    scene={currentScene}
    precision={effectivePrecision}
    bind:enabled={audioEnabled}
  />
{/if}
```

**Step 3: Run tests**

Run: `cd frontend && npx playwright test e2e/audio-processor.spec.ts`
Expected: PASS (audio tests should work)

**Step 4: Commit integration**

```bash
git add frontend/src/App.svelte
git commit -m "feat: integrate AudioProcessor with scene switching"
```

---

### Task 3.4: Add Placeholder Audio Files

**Files:**
- Create: `frontend/static/audio/` directory

**Step 1: Create directory and placeholder**

```bash
mkdir -p frontend/static/audio
touch frontend/static/audio/.gitkeep
```

**Note:** Audio assets should be sourced from:
- Freesound.org: Search for ambient classroom, grocery store, playground sounds
- Create highlight tracks by isolating specific sounds
- Process with ffmpeg for normalization

**Step 2: Commit structure**

```bash
git add frontend/static/audio/.gitkeep
git commit -m "chore: add audio directory structure"
```

---

### Task 3.END: Phase 3 Gate

Run:
```bash
~/.claude/engineering/engineering.sh phase-gate "docs/plans/2026-02-03-video-integration-implementation.md" 3
```

---

## Phase 4: Integration & Polish

### Task 4.1: Regulation Panel Audio Integration

**Files:**
- Modify: `frontend/src/lib/components/AudioProcessor.svelte`
- Modify: `frontend/src/App.svelte`

**Step 1: Add regulation effect to AudioProcessor**

Add prop:
```typescript
export let regulationActive: boolean = false;
```

Update gain calculation:
```typescript
$: regulationMultiplier = regulationActive ? 0.5 : 1;
$: masterGain = (0.3 + (intensity * 0.4)) * regulationMultiplier;
```

**Step 2: Pass regulation state from App**

```svelte
<AudioProcessor
  scene={currentScene}
  precision={effectivePrecision}
  regulationActive={activeStrategy !== null}
  bind:enabled={audioEnabled}
/>
```

**Step 3: Commit**

```bash
git add frontend/src/lib/components/AudioProcessor.svelte frontend/src/App.svelte
git commit -m "feat: reduce audio intensity when regulation active"
```

---

### Task 4.2: Full Flow E2E Test

**Files:**
- Create: `frontend/e2e/video-full-flow.spec.ts`

**Step 1: Write comprehensive test**

```typescript
import { test, expect } from '@playwright/test';

test.describe('Video Mode Full Flow', () => {
  test('complete user journey with video mode', async ({ page }) => {
    await page.goto('/');

    // Start in abstract mode
    const selector = page.getByRole('combobox', { name: /scene/i });
    await expect(selector).toHaveValue('abstract');

    // Switch to classroom
    await selector.selectOption('classroom');
    await expect(page.locator('video')).toHaveCount(2);

    // Enable audio
    const audioButton = page.getByRole('button', { name: /enable audio/i });
    await audioButton.click();
    await expect(page.getByRole('button', { name: /audio on|mute/i })).toBeVisible();

    // Increase precision
    const slider = page.getByRole('slider', { name: /sensory detail/i });
    await slider.fill('75');

    // Regulation panel should appear
    await expect(page.getByText(/regulation strategies/i)).toBeVisible();

    // Activate regulation
    const reduceButton = page.getByRole('button', { name: /reduce input/i });
    await reduceButton.click();

    // Switch scenes
    await selector.selectOption('grocery');
    await expect(page.locator('video')).toHaveCount(2);

    // Switch back to abstract
    await selector.selectOption('abstract');
    await expect(page.locator('video')).toHaveCount(0);
    await expect(page.locator('canvas')).toHaveCount(2);
  });

  test('mobile responsive layout', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    const selector = page.getByRole('combobox', { name: /scene/i });
    await selector.selectOption('classroom');

    // Videos should stack vertically on mobile
    const splitView = page.locator('.video-split-view');
    const flexDirection = await splitView.evaluate((el) =>
      window.getComputedStyle(el).flexDirection
    );
    expect(flexDirection).toBe('column');
  });
});
```

**Step 2: Run test**

Run: `cd frontend && npx playwright test e2e/video-full-flow.spec.ts`

**Step 3: Commit**

```bash
git add frontend/e2e/video-full-flow.spec.ts
git commit -m "test: add video mode full flow E2E test"
```

---

### Task 4.3: Error Handling & Fallback

**Files:**
- Modify: `frontend/src/lib/components/VideoSplitView.svelte`
- Modify: `frontend/src/App.svelte`

**Step 1: Add error state to VideoSplitView**

```typescript
import { createEventDispatcher } from 'svelte';

const dispatch = createEventDispatcher<{
  error: { message: string };
}>();

let videoError = false;

function handleVideoError(event: Event) {
  console.error('Video load error:', event);
  videoError = true;
  dispatch('error', { message: 'Video failed to load' });
}
```

Add to template:
```svelte
{#if videoError}
  <div class="error-fallback">
    <p>Video unavailable. Switching to abstract mode...</p>
  </div>
{/if}
```

**Step 2: Handle error in App**

```svelte
<VideoSplitView
  scene={currentScene}
  precision={effectivePrecision}
  {shakeIntensity}
  on:error={() => { currentScene = 'abstract'; }}
/>
```

**Step 3: Commit**

```bash
git add frontend/src/lib/components/VideoSplitView.svelte frontend/src/App.svelte
git commit -m "feat: add video error handling with fallback to abstract mode"
```

---

### Task 4.4: Run All Tests

**Step 1: Run full test suite**

```bash
cd frontend && npx playwright test
```

**Step 2: Fix any failures**

Address any test failures that emerge from integration.

**Step 3: Commit fixes if needed**

```bash
git add -A
git commit -m "fix: resolve integration test failures"
```

---

### Task 4.END: Phase 4 Gate

Run:
```bash
~/.claude/engineering/engineering.sh phase-gate "docs/plans/2026-02-03-video-integration-implementation.md" 4
```

---

## Phase 5: Completion

### Task 5.1: Final Verification

**Step 1: Run all tests**

```bash
cd frontend && npx playwright test
```

**Step 2: Manual testing checklist**

- [ ] Abstract mode still works correctly
- [ ] Scene selector switches smoothly
- [ ] Video loads and plays in all scenes
- [ ] CSS filters scale with precision
- [ ] Shake effect appears above 70%
- [ ] Vignette appears above 90%
- [ ] Audio enables/disables correctly
- [ ] Audio compression intensifies with precision
- [ ] Regulation strategies reduce effects
- [ ] Mobile layout stacks correctly
- [ ] Error fallback works

**Step 3: Commit any final fixes**

```bash
git add -A
git commit -m "fix: final polish and fixes"
```

---

### Task 5.2: Complete Progress Tracking

**Step 1: Mark complete**

Run:
```bash
~/.claude/engineering/engineering.sh progress complete
```

---

## Summary

| Phase | Tasks | Focus |
|-------|-------|-------|
| 0 | 0.1 | Infrastructure setup |
| 1 | 1.1-1.3 | SceneSelector dropdown |
| 2 | 2.1-2.4 | VideoSplitView with effects |
| 3 | 3.1-3.4 | AudioProcessor with Web Audio |
| 4 | 4.1-4.4 | Integration & polish |
| 5 | 5.1-5.2 | Final verification |

**Total Tasks:** 12 implementation tasks

**Key Dependencies:**
- Task 1.3 (App integration) depends on 1.2 (SceneSelector)
- Task 2.3 (VideoSplitView integration) depends on 1.3
- Task 3.3 (AudioProcessor integration) depends on 2.3
- Task 4.1-4.3 depend on all prior phases
