<script lang="ts">
  import PrecisionSlider from './lib/components/PrecisionSlider.svelte';

  let precision = 20;
</script>

<main>
  <h1>bio-prior</h1>
  <PrecisionSlider bind:value={precision} />
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
