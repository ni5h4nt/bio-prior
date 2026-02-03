<script lang="ts">
  import PrecisionSlider from './lib/components/PrecisionSlider.svelte';
  import LoadGauge from './lib/components/LoadGauge.svelte';

  let precision = 20;

  // Simple CPU cost calculation (matches Rust logic)
  $: cpuCost = 0.1 + (precision / 100) ** 2 * 0.9;
</script>

<main>
  <h1>bio-prior</h1>
  <PrecisionSlider bind:value={precision} />
  <LoadGauge value={cpuCost} />
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
