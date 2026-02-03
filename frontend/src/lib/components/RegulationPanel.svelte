<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let visible: boolean = false;
  export let activeStrategy: string | null = null;

  const dispatch = createEventDispatcher<{
    activate: { strategy: string };
    deactivate: { strategy: string };
  }>();

  const strategies = [
    { id: 'ReduceInput', label: 'Reduce Input', icon: '🎧' },
    { id: 'RhythmicPattern', label: 'Rhythmic Pattern', icon: '🔄' },
    { id: 'TakeABreak', label: 'Take a Break', icon: '🚪' },
  ];

  function handleClick(strategyId: string) {
    if (activeStrategy === strategyId) {
      dispatch('deactivate', { strategy: strategyId });
    } else {
      dispatch('activate', { strategy: strategyId });
    }
  }
</script>

{#if visible}
  <div class="regulation-panel">
    <h3>Regulation Strategies</h3>
    <div class="strategies">
      {#each strategies as strategy (strategy.id)}
        <button
          class="strategy-button"
          class:active={activeStrategy === strategy.id}
          aria-pressed={activeStrategy === strategy.id}
          on:click={() => handleClick(strategy.id)}
        >
          <span class="icon">{strategy.icon}</span>
          <span class="label">{strategy.label}</span>
        </button>
      {/each}
    </div>
  </div>
{/if}

<style>
  .regulation-panel {
    padding: 1rem;
    background: #f5f5f5;
    border-radius: 8px;
    margin-top: 1rem;
  }

  h3 {
    margin: 0 0 1rem;
    font-size: 1rem;
    text-align: center;
  }

  .strategies {
    display: flex;
    gap: 0.5rem;
    justify-content: center;
  }

  .strategy-button {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
    padding: 0.75rem 1rem;
    border: 2px solid #ddd;
    border-radius: 8px;
    background: white;
    cursor: pointer;
    transition: all 0.2s;
  }

  .strategy-button:hover {
    border-color: #999;
  }

  .strategy-button.active {
    border-color: #4caf50;
    background: #e8f5e9;
  }

  .icon {
    font-size: 1.5rem;
  }

  .label {
    font-size: 0.85rem;
  }
</style>
