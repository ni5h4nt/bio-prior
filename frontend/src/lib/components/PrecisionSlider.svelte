<script lang="ts">
  export let value: number = 20;
  export let min: number = 0;
  export let max: number = 100;

  function handleInput(event: Event) {
    const target = event.target as HTMLInputElement;
    value = parseInt(target.value, 10);
  }

  $: zone = value < 70 ? 'calm' : value < 90 ? 'elevated' : 'overload';
  $: zoneLabel = value < 70 ? 'Comfortable' : value < 90 ? 'Challenging' : 'Overwhelming';
</script>

<div class="precision-slider">
  <div class="header">
    <label for="precision">
      <span class="icon">🎚️</span>
      Sensory Detail
    </label>
    <span class="zone-badge {zone}">{zoneLabel}</span>
  </div>

  <div class="slider-container">
    <div class="zone-markers">
      <span class="marker calm">Calm</span>
      <span class="marker elevated">Elevated</span>
      <span class="marker overload">Overload</span>
    </div>
    <input
      id="precision"
      type="range"
      {min}
      {max}
      {value}
      on:input={handleInput}
      aria-label="Sensory Detail"
      class={zone}
    />
  </div>

  <div class="stats">
    <div class="value-display {zone}">
      <span class="number">{value}</span>
      <span class="percent">%</span>
    </div>
    <p class="hint">
    {#if value < 30}
      Filtered perception — background noise fades away
    {:else if value < 70}
      Typical processing — manageable sensory input
    {:else if value < 90}
      Heightened awareness — every detail demands attention
    {:else}
      Sensory flooding — system approaching overload
    {/if}
    </p>
  </div>
</div>

<style>
  .precision-slider {
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    border-radius: 16px;
    padding: 1.5rem;
    border: 1px solid #e2e8f0;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    display: flex;
    flex-direction: column;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  label {
    font-weight: 700;
    font-size: 1.1rem;
    color: #1e293b;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .icon {
    font-size: 1.25rem;
  }

  .zone-badge {
    padding: 0.35rem 0.75rem;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    transition: all 0.3s ease;
  }

  .zone-badge.calm {
    background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
    color: #065f46;
  }

  .zone-badge.elevated {
    background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
    color: #92400e;
  }

  .zone-badge.overload {
    background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
    color: #991b1b;
    animation: pulse 1s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }

  .slider-container {
    position: relative;
    padding-top: 1.5rem;
  }

  .zone-markers {
    display: flex;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
  }

  .marker {
    font-size: 0.7rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    text-align: center;
  }

  .marker.calm {
    color: #059669;
    width: 70%;
  }

  .marker.elevated {
    color: #d97706;
    width: 20%;
  }

  .marker.overload {
    color: #dc2626;
    width: 10%;
  }

  input[type='range'] {
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    height: 12px;
    border-radius: 6px;
    background: linear-gradient(90deg,
      #10b981 0%,
      #10b981 70%,
      #f59e0b 70%,
      #f59e0b 90%,
      #ef4444 90%,
      #ef4444 100%
    );
    cursor: pointer;
    outline: none;
  }

  input[type='range']::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: white;
    border: 4px solid #6366f1;
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
    cursor: grab;
    transition: all 0.2s ease;
  }

  input[type='range']::-webkit-slider-thumb:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 16px rgba(99, 102, 241, 0.5);
  }

  input[type='range']::-webkit-slider-thumb:active {
    cursor: grabbing;
  }

  input[type='range']::-moz-range-thumb {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: white;
    border: 4px solid #6366f1;
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
    cursor: grab;
  }

  input[type='range'].elevated::-webkit-slider-thumb {
    border-color: #f59e0b;
    box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4);
  }

  input[type='range'].overload::-webkit-slider-thumb {
    border-color: #ef4444;
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
    animation: shake 0.3s ease-in-out infinite;
  }

  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-2px); }
    75% { transform: translateX(2px); }
  }

  .stats {
    text-align: center;
  }

  .value-display {
    display: flex;
    justify-content: center;
    align-items: baseline;
    gap: 0.15rem;
  }

  .number {
    font-size: 2.5rem;
    font-weight: 800;
    line-height: 1;
    transition: color 0.3s ease;
  }

  .percent {
    font-size: 1.25rem;
    font-weight: 600;
    opacity: 0.7;
  }

  .value-display.calm .number { color: #059669; }
  .value-display.elevated .number { color: #d97706; }
  .value-display.overload .number { color: #dc2626; }

  .hint {
    text-align: center;
    font-size: 0.9rem;
    color: #64748b;
    margin: 0.5rem 0 0;
    font-style: italic;
    min-height: 2.5rem;
    transition: all 0.3s ease;
  }
</style>
