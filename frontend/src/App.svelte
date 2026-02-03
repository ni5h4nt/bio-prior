<script lang="ts">
  import { onMount } from 'svelte';
  import PrecisionSlider from './lib/components/PrecisionSlider.svelte';
  import LoadGauge from './lib/components/LoadGauge.svelte';
  import RegulationPanel from './lib/components/RegulationPanel.svelte';
  import VideoCanvas from './lib/components/VideoCanvas.svelte';
  import AboutModal from './lib/components/AboutModal.svelte';
  import { initWasm, sliderToPrecision } from './lib/wasm';

  let precision = 20;
  let activeStrategy: string | null = null;
  let wasmReady = false;
  let error: string | null = null;
  let showAbout = false;

  onMount(async () => {
    try {
      await initWasm();
      wasmReady = true;
    } catch (e) {
      error = `Failed to load WASM: ${e}`;
      console.error(error);
    }
  });

  // Use WASM for precision calculation when available
  $: internalPrecision = wasmReady
    ? sliderToPrecision(precision)
    : (precision / 100) ** 3;

  $: cpuCost = 0.1 + internalPrecision ** 2 * 0.9;
  $: showRegulation = precision >= 70;

  // Shake only above 70%
  $: shakeIntensity = precision >= 70 ? ((precision - 70) / 30) * 5 : 0;
  $: shakeX = shakeIntensity * Math.sin(Date.now() / 50);
  $: shakeY = shakeIntensity * Math.cos(Date.now() / 50);

  // Noise above 30%
  $: noiseIntensity = precision >= 30 ? ((precision - 30) / 70) ** 1.5 : 0;

  function handleActivate(event: CustomEvent<{ strategy: string }>) {
    activeStrategy = event.detail.strategy;
  }

  function handleDeactivate() {
    activeStrategy = null;
  }
</script>

<main>
  <h1>bio-prior</h1>

  {#if error}
    <div class="error">{error}</div>
  {/if}

  {#if !wasmReady}
    <div class="loading">Loading simulation engine...</div>
  {:else}
    <div data-testid="app-ready">
      <VideoCanvas
        {precision}
        shakeX={shakeX}
        shakeY={shakeY}
        {noiseIntensity}
      />
      <PrecisionSlider bind:value={precision} />
      <LoadGauge value={cpuCost} />
      <RegulationPanel
        visible={showRegulation}
        {activeStrategy}
        on:activate={handleActivate}
        on:deactivate={handleDeactivate}
      />
    </div>

    <footer>
      <button class="about-button" on:click={() => showAbout = true}>
        About this project
      </button>
    </footer>
  {/if}
</main>

<AboutModal bind:open={showAbout} />

<style>
  main {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
  }

  h1 {
    text-align: center;
    margin-bottom: 2rem;
  }

  .loading {
    text-align: center;
    padding: 2rem;
    color: #666;
  }

  .error {
    background: #ffebee;
    color: #c62828;
    padding: 1rem;
    border-radius: 4px;
    margin-bottom: 1rem;
  }

  footer {
    text-align: center;
    margin-top: 2rem;
  }

  .about-button {
    background: none;
    border: 1px solid #ddd;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    color: #666;
  }

  .about-button:hover {
    border-color: #999;
  }
</style>
