<script lang="ts">
  export let value: number = 0;

  $: percentage = Math.round(value * 100);
  $: barWidth = `${percentage}%`;
  $: isOverloaded = percentage > 80;
</script>

<div class="load-gauge">
  <span class="label">Processing Load</span>
  <div class="bar-container">
    <div
      class="bar"
      class:overloaded={isOverloaded}
      style="width: {barWidth}"
    />
  </div>
  <span class="percentage" data-testid="load-value">{percentage}%</span>
</div>

<style>
  .load-gauge {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.5rem 1rem;
  }

  .label {
    font-weight: 600;
    min-width: 120px;
  }

  .bar-container {
    flex: 1;
    height: 20px;
    background: #e0e0e0;
    border-radius: 10px;
    overflow: hidden;
  }

  .bar {
    height: 100%;
    background: #4caf50;
    transition: width 0.1s ease-out, background-color 0.3s;
  }

  .bar.overloaded {
    background: #f44336;
  }

  .percentage {
    min-width: 50px;
    text-align: right;
    font-family: monospace;
  }
</style>
