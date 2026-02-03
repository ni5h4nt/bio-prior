<script lang="ts">
  import { onMount } from 'svelte';

  export let width: number = 720;
  export let height: number = 480;
  export let precision: number = 0;
  export let shakeX: number = 0;
  export let shakeY: number = 0;
  export let noiseIntensity: number = 0;

  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D | null = null;

  // Map precision to visual intensity
  $: visualIntensity = precision / 100;
  $: isOverloaded = precision >= 70;
  $: isCritical = precision >= 90;

  onMount(() => {
    ctx = canvas.getContext('2d');
    drawScene();
  });

  // Redraw when precision changes
  $: if (ctx) {
    drawScene();
    canvas.style.transform = `translate(${shakeX}px, ${shakeY}px)`;
  }

  function drawScene() {
    if (!ctx) return;

    // Background gradient - gets more intense with precision
    const bgStart = interpolateColor('#2d3748', '#1e293b', visualIntensity);
    const bgEnd = interpolateColor('#4a5568', '#475569', visualIntensity);
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, bgStart);
    gradient.addColorStop(1, bgEnd);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Draw grid - gets brighter/more visible with precision
    const gridOpacity = 0.03 + visualIntensity * 0.1;
    ctx.strokeStyle = `rgba(255, 255, 255, ${gridOpacity})`;
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Draw "sensory elements" - more appear and become brighter as precision increases
    const elementCount = Math.floor(5 + visualIntensity * 20);
    for (let i = 0; i < elementCount; i++) {
      const x = (width / (elementCount + 1)) * (i + 1);
      const y = height / 2 + Math.sin(i * 0.8) * 60;
      const radius = 4 + visualIntensity * 6;
      const opacity = 0.1 + visualIntensity * 0.4;

      ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }

    // Status indicator
    const statusY = 40;
    const statusX = width / 2;

    // Draw status pill
    const pillWidth = 200;
    const pillHeight = 36;
    const pillColor = isCritical ? 'rgba(239, 68, 68, 0.3)' : isOverloaded ? 'rgba(245, 158, 11, 0.3)' : 'rgba(16, 185, 129, 0.2)';
    ctx.fillStyle = pillColor;
    roundRect(ctx, statusX - pillWidth / 2, statusY - pillHeight / 2, pillWidth, pillHeight, 18);
    ctx.fill();

    // Status text
    const statusText = isCritical ? 'Sensory Overload' : isOverloaded ? 'High Alertness' : 'Filtered View';
    ctx.fillStyle = isCritical ? '#fca5a5' : isOverloaded ? '#fcd34d' : '#86efac';
    ctx.font = '600 14px Inter, system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(statusText, statusX, statusY + 5);

    // Center info
    const centerY = height / 2;

    // What you're "seeing"
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = '600 18px Inter, system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Sensory Environment', width / 2, centerY + 50);

    // Description based on mode
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.font = '400 14px Inter, system-ui, sans-serif';
    const description = isCritical
      ? 'Every detail overwhelming — exhaustion imminent'
      : isOverloaded
        ? 'Heightened awareness — all signals amplified'
        : 'Background noise filtered — brain at ease';
    ctx.fillText(description, width / 2, centerY + 75);

    // Draw intensity meter
    const meterWidth = 200;
    const meterHeight = 8;
    const meterX = (width - meterWidth) / 2;
    const meterY = height - 50;

    // Meter background
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    roundRect(ctx, meterX, meterY, meterWidth, meterHeight, 4);
    ctx.fill();

    // Meter fill
    const fillColor = isCritical ? '#ef4444' : isOverloaded ? '#f59e0b' : '#10b981';
    ctx.fillStyle = fillColor;
    roundRect(ctx, meterX, meterY, meterWidth * visualIntensity, meterHeight, 4);
    ctx.fill();

    // Meter label
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = '500 11px Inter, system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`Sensory Gain: ${precision}%`, width / 2, meterY + 24);
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

  function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
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

<div class="canvas-container">
  <canvas bind:this={canvas} {width} {height}></canvas>
  {#if noiseIntensity > 0}
    <div class="noise-overlay" style="opacity: {noiseIntensity * 0.4}"></div>
  {/if}
  {#if isCritical}
    <div class="vignette"></div>
  {/if}
</div>

<style>
  .canvas-container {
    position: relative;
    display: flex;
    justify-content: center;
    margin-bottom: 0.5rem;
  }

  canvas {
    border-radius: 16px;
    box-shadow:
      0 4px 6px -1px rgba(0, 0, 0, 0.1),
      0 2px 4px -2px rgba(0, 0, 0, 0.1),
      0 0 0 1px rgba(0, 0, 0, 0.05);
    max-width: 100%;
    height: auto;
  }

  .noise-overlay {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 720px;
    max-width: 100%;
    height: 480px;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)'/%3E%3C/svg%3E");
    pointer-events: none;
    border-radius: 16px;
  }

  .vignette {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 720px;
    max-width: 100%;
    height: 480px;
    background: radial-gradient(ellipse at center, transparent 40%, rgba(239, 68, 68, 0.2) 100%);
    pointer-events: none;
    border-radius: 16px;
    animation: pulse-vignette 1s ease-in-out infinite;
  }

  @keyframes pulse-vignette {
    0%, 100% { opacity: 0.7; }
    50% { opacity: 1; }
  }
</style>
