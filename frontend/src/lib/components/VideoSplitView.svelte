<script lang="ts">
  import { onMount, createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher<{
    error: { message: string };
  }>();

  export let scene: string = 'classroom';
  export let precision: number = 20;
  export let shakeIntensity: number = 0;

  let leftVideo: HTMLVideoElement;
  let rightVideo: HTMLVideoElement;
  let animationFrame: number;
  let shakeX = 0;
  let shakeY = 0;
  let videoError = false;

  const sceneVideos: Record<string, string> = {
    classroom: '/videos/classroom.mp4',
    grocery: '/videos/grocery.mp4',
    playground: '/videos/playground.mp4',
  };

  const sceneLabels: Record<string, string> = {
    classroom: 'Classroom',
    grocery: 'Grocery Store',
    playground: 'Playground',
  };

  // Derived values (matching SplitViewCanvas)
  $: intensity = precision / 100;
  $: isOverloaded = precision >= 70;
  $: isCritical = precision >= 90;

  // Visual effect calculations
  $: contrast = 1 + intensity * 0.35;
  $: saturation = 1 + intensity * 0.6;
  $: brightness = 1 + intensity * 0.15;
  $: noiseOpacity = intensity * 0.4;
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
    const time = Date.now() / 50;
    shakeX = Math.sin(time) * shakeIntensity;
    shakeY = Math.cos(time * 1.3) * shakeIntensity * 0.7;
    animationFrame = requestAnimationFrame(updateShake);
  }

  // Only run animation loop when shake is active
  $: if (shakeIntensity > 0 && !animationFrame) {
    updateShake();
  } else if (shakeIntensity === 0 && animationFrame) {
    cancelAnimationFrame(animationFrame);
    animationFrame = 0;
    shakeX = 0;
    shakeY = 0;
  }

  onMount(() => {
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  });

  function handleVideoError(event: Event) {
    console.error('Video load error:', event);
    videoError = true;
    dispatch('error', { message: 'Video failed to load' });
  }
</script>

<div class="split-view">
  <div class="view-panel neurotypical">
    <div class="panel-header">
      <span class="panel-icon">👁️</span>
      <span class="panel-title">Neurotypical View</span>
    </div>
    <div class="video-wrapper">
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
    <p class="panel-desc">What most people experience</p>
  </div>

  <div class="divider">
    <div class="divider-line"></div>
    <span class="divider-text">vs</span>
    <div class="divider-line"></div>
  </div>

  <div class="view-panel current" class:overloaded={isOverloaded} class:critical={isCritical}>
    <div class="panel-header">
      <span class="panel-icon">{isCritical ? '🔥' : isOverloaded ? '⚡' : '🔍'}</span>
      <span class="panel-title">
        {isCritical ? 'Autistic Experience' : isOverloaded ? 'Heightened State' : 'Current Experience'}
      </span>
    </div>
    <div
      class="video-wrapper"
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

      {#if noiseOpacity > 0}
        <div class="noise-overlay" style="opacity: {noiseOpacity}"></div>
      {/if}
      {#if isCritical}
        <div class="vignette"></div>
      {/if}
    </div>
    <p class="panel-desc">
      {#if isCritical}
        Sensory overload — exhaustion imminent
      {:else if isOverloaded}
        Every signal amplified — fatigue building
      {:else}
        {sceneLabels[scene]} scene with effects
      {/if}
    </p>
  </div>
</div>

<style>
  .split-view {
    display: flex;
    align-items: stretch;
    gap: 1rem;
    margin-bottom: 0.5rem;
  }

  .view-panel {
    flex: 1;
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    border-radius: 16px;
    padding: 1rem;
    border: 2px solid #e2e8f0;
    transition: all 0.3s ease;
  }

  .view-panel.neurotypical {
    border-color: #a7f3d0;
  }

  .view-panel.current {
    border-color: #e2e8f0;
  }

  .view-panel.current.overloaded {
    border-color: #fde68a;
    background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
  }

  .view-panel.current.critical {
    border-color: #fecaca;
    background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
    animation: pulse-panel 1s ease-in-out infinite;
  }

  @keyframes pulse-panel {
    0%, 100% {
      box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);
    }
    50% {
      box-shadow: 0 0 20px 4px rgba(239, 68, 68, 0.2);
    }
  }

  .panel-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
  }

  .panel-icon {
    font-size: 1.25rem;
  }

  .panel-title {
    font-weight: 700;
    font-size: 0.95rem;
    color: #1e293b;
  }

  .video-wrapper {
    position: relative;
    border-radius: 12px;
    overflow: hidden;
    background: #1f2937;
    transition: transform 0.05s linear;
  }

  video {
    display: block;
    width: 100%;
    height: auto;
    aspect-ratio: 340/240;
    object-fit: cover;
    border-radius: 12px;
  }

  .noise-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)'/%3E%3C/svg%3E");
    pointer-events: none;
    border-radius: 12px;
  }

  .vignette {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(ellipse at center, transparent 30%, rgba(239, 68, 68, 0.25) 100%);
    pointer-events: none;
    border-radius: 12px;
    animation: pulse-vignette 0.8s ease-in-out infinite;
  }

  @keyframes pulse-vignette {
    0%, 100% {
      opacity: 0.6;
    }
    50% {
      opacity: 1;
    }
  }

  .panel-desc {
    margin: 0.75rem 0 0;
    font-size: 0.8rem;
    color: #64748b;
    text-align: center;
    min-height: 1.2rem;
  }

  .divider {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0 0.25rem;
  }

  .divider-line {
    width: 2px;
    flex: 1;
    background: linear-gradient(180deg, transparent 0%, #cbd5e1 50%, transparent 100%);
    min-height: 40px;
  }

  .divider-text {
    font-size: 0.75rem;
    font-weight: 600;
    color: #94a3b8;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  @media (max-width: 700px) {
    .split-view {
      flex-direction: column;
    }

    .divider {
      flex-direction: row;
      padding: 0.25rem 0;
    }

    .divider-line {
      width: auto;
      height: 2px;
      min-height: auto;
      min-width: 40px;
      background: linear-gradient(90deg, transparent 0%, #cbd5e1 50%, transparent 100%);
    }
  }
</style>
