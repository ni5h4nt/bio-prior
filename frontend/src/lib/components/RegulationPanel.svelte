<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let visible: boolean = false;
  export let activeStrategy: string | null = null;

  const dispatch = createEventDispatcher<{
    activate: { strategy: string };
    deactivate: { strategy: string };
  }>();

  const strategies = [
    {
      id: 'ReduceInput',
      label: 'Reduce Input',
      icon: '🎧',
      description: 'Noise-canceling headphones or dimmed lights',
      color: '#3b82f6'
    },
    {
      id: 'RhythmicPattern',
      label: 'Rhythmic Motion',
      icon: '🔄',
      description: 'Rocking, tapping, or repetitive movement',
      color: '#8b5cf6'
    },
    {
      id: 'TakeABreak',
      label: 'Take a Break',
      icon: '🚪',
      description: 'Leave the overwhelming environment',
      color: '#10b981'
    },
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
    <div class="panel-header">
      <span class="alert-icon">⚠️</span>
      <div class="header-text">
        <h3>System Overwhelmed</h3>
        <p class="subtitle">Select a regulation strategy to reduce load</p>
      </div>
    </div>

    <div class="strategies">
      {#each strategies as strategy (strategy.id)}
        <button
          class="strategy-card"
          class:active={activeStrategy === strategy.id}
          aria-pressed={activeStrategy === strategy.id}
          on:click={() => handleClick(strategy.id)}
          style="--accent-color: {strategy.color}"
        >
          <div class="card-icon" class:active={activeStrategy === strategy.id}>
            {strategy.icon}
          </div>
          <div class="card-content">
            <span class="card-label">{strategy.label}</span>
            <span class="card-description">{strategy.description}</span>
          </div>
          {#if activeStrategy === strategy.id}
            <div class="active-indicator">
              <span class="checkmark">✓</span>
              Active
            </div>
          {/if}
        </button>
      {/each}
    </div>

    <p class="help-text">
      These aren't misbehaviors — they're <em>solutions</em>.
      The brain is protecting itself from overload.
    </p>
  </div>
{/if}

<style>
  .regulation-panel {
    background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
    border: 2px solid #fecaca;
    border-radius: 16px;
    padding: 1.5rem;
    margin-top: 1.5rem;
    animation: slideIn 0.3s ease-out;
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .panel-header {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    margin-bottom: 1.25rem;
  }

  .alert-icon {
    font-size: 1.5rem;
    animation: pulse 1.5s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }

  .header-text {
    flex: 1;
  }

  h3 {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 700;
    color: #991b1b;
  }

  .subtitle {
    margin: 0.25rem 0 0;
    font-size: 0.875rem;
    color: #b91c1c;
  }

  .strategies {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .strategy-card {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem 1.25rem;
    border: 2px solid #e5e7eb;
    border-radius: 12px;
    background: white;
    cursor: pointer;
    transition: all 0.2s ease;
    text-align: left;
    position: relative;
    overflow: hidden;
  }

  .strategy-card::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    background: var(--accent-color);
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  .strategy-card:hover {
    border-color: var(--accent-color);
    transform: translateX(4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }

  .strategy-card:hover::before {
    opacity: 1;
  }

  .strategy-card.active {
    border-color: var(--accent-color);
    background: linear-gradient(135deg, white 0%, #f0fdf4 100%);
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
  }

  .strategy-card.active::before {
    opacity: 1;
    background: #10b981;
  }

  .card-icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    background: #f3f4f6;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    flex-shrink: 0;
    transition: all 0.2s ease;
  }

  .strategy-card:hover .card-icon {
    background: var(--accent-color);
    transform: scale(1.05);
  }

  .card-icon.active {
    background: #10b981;
  }

  .card-content {
    flex: 1;
    min-width: 0;
  }

  .card-label {
    display: block;
    font-weight: 600;
    font-size: 1rem;
    color: #1f2937;
    margin-bottom: 0.25rem;
  }

  .card-description {
    display: block;
    font-size: 0.8rem;
    color: #6b7280;
    line-height: 1.4;
  }

  .active-indicator {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.35rem 0.75rem;
    background: #10b981;
    color: white;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    flex-shrink: 0;
  }

  .checkmark {
    font-size: 0.875rem;
  }

  .help-text {
    margin: 1.25rem 0 0;
    padding-top: 1rem;
    border-top: 1px solid #fecaca;
    font-size: 0.875rem;
    color: #991b1b;
    text-align: center;
    line-height: 1.6;
  }

  .help-text em {
    font-style: normal;
    font-weight: 600;
    color: #059669;
  }

  @media (min-width: 640px) {
    .strategies {
      flex-direction: row;
    }

    .strategy-card {
      flex-direction: column;
      text-align: center;
      padding: 1.25rem 1rem;
      flex: 1;
    }

    .strategy-card::before {
      left: 0;
      right: 0;
      top: 0;
      bottom: auto;
      width: auto;
      height: 4px;
    }

    .strategy-card:hover {
      transform: translateY(-4px);
    }

    .card-content {
      text-align: center;
    }

    .card-description {
      font-size: 0.75rem;
    }

    .active-indicator {
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      padding: 0.25rem 0.5rem;
      font-size: 0.65rem;
    }
  }
</style>
