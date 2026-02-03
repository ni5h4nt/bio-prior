<script lang="ts">
  import PrecisionSlider from './lib/components/PrecisionSlider.svelte';
  import LoadGauge from './lib/components/LoadGauge.svelte';
  import RegulationPanel from './lib/components/RegulationPanel.svelte';

  let precision = 20;
  let activeStrategy: string | null = null;

  $: cpuCost = 0.1 + (precision / 100) ** 2 * 0.9;
  $: showRegulation = precision >= 70;

  function handleActivate(event: CustomEvent<{ strategy: string }>) {
    activeStrategy = event.detail.strategy;
  }

  function handleDeactivate() {
    activeStrategy = null;
  }
</script>

<main>
  <h1>bio-prior</h1>
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
