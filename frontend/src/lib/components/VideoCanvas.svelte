<script lang="ts">
  import { onMount } from 'svelte';

  export let width: number = 720;
  export let height: number = 480;
  export let precision: number = 0;
  export let shakeX: number = 0;
  export let shakeY: number = 0;
  export let noiseIntensity: number = 0;

  // Reserved for future video frame processing
  $: void precision;

  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D | null = null;

  onMount(() => {
    ctx = canvas.getContext('2d');
    if (ctx) {
      // Draw placeholder
      ctx.fillStyle = '#333';
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = '#fff';
      ctx.font = '24px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Video Canvas', width / 2, height / 2);
      ctx.font = '14px sans-serif';
      ctx.fillText('(placeholder - video integration pending)', width / 2, height / 2 + 30);
    }
  });

  $: if (ctx) {
    // Apply shake transform
    canvas.style.transform = `translate(${shakeX}px, ${shakeY}px)`;
  }
</script>

<div class="canvas-container">
  <canvas bind:this={canvas} {width} {height}></canvas>
  {#if noiseIntensity > 0}
    <div class="noise-overlay" style="opacity: {noiseIntensity * 0.3}"></div>
  {/if}
</div>

<style>
  .canvas-container {
    position: relative;
    display: flex;
    justify-content: center;
    margin-bottom: 1rem;
  }

  canvas {
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }

  .noise-overlay {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 720px;
    height: 480px;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)'/%3E%3C/svg%3E");
    pointer-events: none;
    border-radius: 8px;
  }
</style>
