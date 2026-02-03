<script lang="ts">
  import PrecisionSlider from './lib/components/PrecisionSlider.svelte';
  import LoadGauge from './lib/components/LoadGauge.svelte';
  import RegulationPanel from './lib/components/RegulationPanel.svelte';
  import VideoCanvas from './lib/components/VideoCanvas.svelte';

  let precision = 20;
  let activeStrategy: string | null = null;

  // Calculations matching Rust logic
  $: normalizedPrecision = precision / 100;
  $: cpuCost = 0.1 + normalizedPrecision ** 2 * 0.9;
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
</main>

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
</style>
