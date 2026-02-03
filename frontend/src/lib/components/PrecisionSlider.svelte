<script lang="ts">
  export let value: number = 20;
  export let min: number = 0;
  export let max: number = 100;

  function handleInput(event: Event) {
    const target = event.target as HTMLInputElement;
    value = parseInt(target.value, 10);
  }
</script>

<div class="precision-slider">
  <label for="precision">Sensory Detail</label>
  <input
    id="precision"
    type="range"
    {min}
    {max}
    {value}
    on:input={handleInput}
    aria-label="Sensory Detail"
  />
  <span class="value">{value}</span>
</div>

<style>
  .precision-slider {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 1rem;
  }

  label {
    font-weight: 600;
  }

  input[type='range'] {
    width: 100%;
    cursor: pointer;
  }

  .value {
    text-align: center;
    font-size: 1.25rem;
  }
</style>
