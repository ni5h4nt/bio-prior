<script lang="ts">
  export let value: number = 0;

  $: percentage = Math.round(value * 100);
  $: barWidth = `${percentage}%`;
  $: status = percentage < 40 ? 'low' : percentage < 70 ? 'medium' : percentage < 85 ? 'high' : 'critical';
  $: statusLabel = percentage < 40 ? 'Efficient' : percentage < 70 ? 'Working' : percentage < 85 ? 'Strained' : 'Overloaded';
</script>

<div class="load-gauge">
  <div class="header">
    <span class="label">
      <span class="icon">⚡</span>
      Processing Load
    </span>
    <span class="status-badge {status}">{statusLabel}</span>
  </div>

  <div class="gauge-container">
    <div class="gauge-background">
      <div class="gauge-fill {status}" style="width: {barWidth}"></div>
      <div class="gauge-glow {status}" style="width: {barWidth}"></div>
    </div>
    <div class="tick-marks">
      <span class="tick" style="left: 25%"></span>
      <span class="tick" style="left: 50%"></span>
      <span class="tick" style="left: 75%"></span>
    </div>
  </div>

  <div class="stats">
    <div class="percentage {status}" data-testid="load-value">
      <span class="value">{percentage}</span>
      <span class="unit">%</span>
    </div>
    <p class="description">
      {#if percentage < 40}
        System running smoothly with resources to spare
      {:else if percentage < 70}
        Moderate cognitive effort required
      {:else if percentage < 85}
        High demand — fatigue building
      {:else}
        Critical load — exhaustion imminent
      {/if}
    </p>
  </div>
</div>

<style>
  .load-gauge {
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    border-radius: 16px;
    padding: 1.5rem;
    border: 1px solid #e2e8f0;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .label {
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

  .status-badge {
    padding: 0.35rem 0.75rem;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    transition: all 0.3s ease;
  }

  .status-badge.low {
    background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
    color: #1e40af;
  }

  .status-badge.medium {
    background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
    color: #065f46;
  }

  .status-badge.high {
    background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
    color: #92400e;
  }

  .status-badge.critical {
    background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
    color: #991b1b;
    animation: pulse 0.8s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }

  .gauge-container {
    position: relative;
    margin-bottom: 1rem;
  }

  .gauge-background {
    height: 24px;
    background: #e2e8f0;
    border-radius: 12px;
    overflow: hidden;
    position: relative;
  }

  .gauge-fill {
    height: 100%;
    border-radius: 12px;
    transition: width 0.3s ease, background 0.3s ease;
    position: relative;
    z-index: 2;
  }

  .gauge-fill.low {
    background: linear-gradient(90deg, #3b82f6 0%, #60a5fa 100%);
  }

  .gauge-fill.medium {
    background: linear-gradient(90deg, #10b981 0%, #34d399 100%);
  }

  .gauge-fill.high {
    background: linear-gradient(90deg, #f59e0b 0%, #fbbf24 100%);
  }

  .gauge-fill.critical {
    background: linear-gradient(90deg, #ef4444 0%, #f87171 100%);
  }

  .gauge-glow {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    border-radius: 12px;
    filter: blur(8px);
    opacity: 0.4;
    z-index: 1;
    transition: width 0.3s ease;
  }

  .gauge-glow.low { background: #3b82f6; }
  .gauge-glow.medium { background: #10b981; }
  .gauge-glow.high { background: #f59e0b; }
  .gauge-glow.critical { background: #ef4444; animation: glow-pulse 0.8s ease-in-out infinite; }

  @keyframes glow-pulse {
    0%, 100% { opacity: 0.4; }
    50% { opacity: 0.7; }
  }

  .tick-marks {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 24px;
    pointer-events: none;
  }

  .tick {
    position: absolute;
    top: 0;
    width: 2px;
    height: 100%;
    background: rgba(255, 255, 255, 0.3);
  }

  .stats {
    text-align: center;
  }

  .percentage {
    display: flex;
    justify-content: center;
    align-items: baseline;
    gap: 0.1rem;
    transition: color 0.3s ease;
  }

  .value {
    font-size: 2.5rem;
    font-weight: 800;
    line-height: 1;
  }

  .unit {
    font-size: 1.25rem;
    font-weight: 600;
    opacity: 0.7;
  }

  .percentage.low { color: #2563eb; }
  .percentage.medium { color: #059669; }
  .percentage.high { color: #d97706; }
  .percentage.critical { color: #dc2626; }

  .description {
    font-size: 0.9rem;
    color: #64748b;
    margin: 0.5rem 0 0;
    font-style: italic;
  }
</style>
