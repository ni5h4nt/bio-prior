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
      ></video>
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
      ></video>

      <!-- Noise overlay -->
      <div
        class="noise-overlay"
        style="opacity: {noiseOpacity}"
      ></div>

      <!-- Vignette overlay -->
      {#if showVignette}
        <div class="vignette-overlay"></div>
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
