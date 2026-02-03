<script lang="ts">
  import { onMount } from 'svelte';

  export let precision: number = 20;
  export let shakeIntensity: number = 0;
  export let noiseIntensity: number = 0;

  const width = 340;
  const height = 240;

  let neurotypicalCanvas: HTMLCanvasElement;
  let currentCanvas: HTMLCanvasElement;
  let neurotypicalCtx: CanvasRenderingContext2D | null = null;
  let currentCtx: CanvasRenderingContext2D | null = null;

  // Derived values
  $: visualIntensity = precision / 100;
  $: isOverloaded = precision >= 70;
  $: isCritical = precision >= 90;

  // Shake effect for current view
  $: shakeX = shakeIntensity * Math.sin(Date.now() / 50);
  $: shakeY = shakeIntensity * Math.cos(Date.now() / 50);

  onMount(() => {
    neurotypicalCtx = neurotypicalCanvas.getContext('2d');
    currentCtx = currentCanvas.getContext('2d');
    drawBothScenes();
  });

  // Redraw when precision changes
  $: if (neurotypicalCtx && currentCtx) {
    drawBothScenes();
    currentCanvas.style.transform = `translate(${shakeX}px, ${shakeY}px)`;
  }

  function drawBothScenes() {
    if (neurotypicalCtx) {
      drawScene(neurotypicalCtx, 0.15, false, false); // Always calm
    }
    if (currentCtx) {
      drawScene(currentCtx, visualIntensity, isOverloaded, isCritical);
    }
  }

  function drawScene(
    ctx: CanvasRenderingContext2D,
    intensity: number,
    overloaded: boolean,
    critical: boolean
  ) {
    // Background gradient
    const bgStart = interpolateColor('#2d3748', '#1e293b', intensity);
    const bgEnd = interpolateColor('#4a5568', '#475569', intensity);
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, bgStart);
    gradient.addColorStop(1, bgEnd);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Draw grid - intensity affects visibility
    const gridOpacity = 0.03 + intensity * 0.12;
    ctx.strokeStyle = `rgba(255, 255, 255, ${gridOpacity})`;
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 30) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Sensory elements - more appear with higher intensity
    const elementCount = Math.floor(4 + intensity * 16);
    for (let i = 0; i < elementCount; i++) {
      const x = (width / (elementCount + 1)) * (i + 1);
      const y = height / 2 + Math.sin(i * 0.9) * 40;
      const radius = 3 + intensity * 5;
      const opacity = 0.08 + intensity * 0.35;

      ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }

    // Status pill
    const statusY = 28;
    const statusX = width / 2;
    const pillWidth = 140;
    const pillHeight = 28;
    const pillColor = critical
      ? 'rgba(239, 68, 68, 0.35)'
      : overloaded
        ? 'rgba(245, 158, 11, 0.35)'
        : 'rgba(16, 185, 129, 0.25)';

    ctx.fillStyle = pillColor;
    roundRect(ctx, statusX - pillWidth / 2, statusY - pillHeight / 2, pillWidth, pillHeight, 14);
    ctx.fill();

    const statusText = critical ? 'Overloaded' : overloaded ? 'Heightened' : 'Filtered';
    ctx.fillStyle = critical ? '#fca5a5' : overloaded ? '#fcd34d' : '#86efac';
    ctx.font = '600 12px Inter, system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(statusText, statusX, statusY + 4);

    // Description
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = '400 11px Inter, system-ui, sans-serif';
    const desc = critical
      ? 'Every detail demands attention'
      : overloaded
        ? 'Signals amplified'
        : 'Background noise filtered';
    ctx.fillText(desc, width / 2, height - 20);
  }

  function interpolateColor(color1: string, color2: string, factor: number): string {
    const r1 = parseInt(color1.slice(1, 3), 16);
    const g1 = parseInt(color1.slice(3, 5), 16);
    const b1 = parseInt(color1.slice(5, 7), 16);
    const r2 = parseInt(color2.slice(1, 3), 16);
    const g2 = parseInt(color2.slice(3, 5), 16);
    const b2 = parseInt(color2.slice(5, 7), 16);

    const r = Math.round(r1 + (r2 - r1) * factor);
    const g = Math.round(g1 + (g2 - g1) * factor);
    const b = Math.round(b1 + (b2 - b1) * factor);

    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }

  function roundRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    r: number
  ) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }
</script>

<div class="split-view">
  <div class="view-panel neurotypical">
    <div class="panel-header">
      <span class="panel-icon">👁️</span>
      <span class="panel-title">Neurotypical View</span>
    </div>
    <div class="canvas-wrapper">
      <canvas bind:this={neurotypicalCanvas} {width} {height}></canvas>
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
        {isCritical ? 'Autistic Experience' : isOverloaded ? 'Heightened State' : 'Your Current View'}
      </span>
    </div>
    <div class="canvas-wrapper">
      <canvas bind:this={currentCanvas} {width} {height}></canvas>
      {#if noiseIntensity > 0}
        <div class="noise-overlay" style="opacity: {noiseIntensity * 0.4}"></div>
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
        Drag slider right to increase intensity
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

  .canvas-wrapper {
    position: relative;
    border-radius: 12px;
    overflow: hidden;
  }

  canvas {
    display: block;
    width: 100%;
    height: auto;
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
