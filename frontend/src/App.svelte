<script lang="ts">
  import { onMount } from 'svelte';
  import PrecisionSlider from './lib/components/PrecisionSlider.svelte';
  import LoadGauge from './lib/components/LoadGauge.svelte';
  import RegulationPanel from './lib/components/RegulationPanel.svelte';
  import SplitViewCanvas from './lib/components/SplitViewCanvas.svelte';
  import VideoSplitView from './lib/components/VideoSplitView.svelte';
  import AboutModal from './lib/components/AboutModal.svelte';
  import SceneSelector from './lib/components/SceneSelector.svelte';
  import AudioProcessor from './lib/components/AudioProcessor.svelte';
  import { initWasm, sliderToPrecision } from './lib/wasm';

  let precision = 20;
  let activeStrategy: string | null = null;
  let wasmReady = false;
  let error: string | null = null;
  let showAbout = false;
  let currentScene = 'abstract';
  let audioEnabled = false;

  onMount(async () => {
    try {
      await initWasm();
      wasmReady = true;
    } catch (e) {
      error = `Failed to load WASM: ${e}`;
      console.error(error);
    }
  });

  // Use WASM for precision calculation when available
  $: internalPrecision = wasmReady
    ? sliderToPrecision(precision)
    : (precision / 100) ** 3;

  // CPU cost also reduced by regulation strategies
  $: baseCpuCost = 0.1 + internalPrecision ** 2 * 0.9;
  $: cpuCost = activeStrategy
    ? baseCpuCost * regulationMultiplier.precision
    : baseCpuCost;
  $: showRegulation = precision >= 70;

  // Base shake only above 70%
  $: baseShakeIntensity = precision >= 70 ? ((precision - 70) / 30) * 5 : 0;

  // Base noise above 30%
  $: baseNoiseIntensity = precision >= 30 ? ((precision - 30) / 70) ** 1.5 : 0;

  // Regulation strategy effects - each strategy reduces overload differently
  $: regulationMultiplier = (() => {
    switch (activeStrategy) {
      case 'ReduceInput':
        // Headphones/dimmed lights - dramatically reduces sensory input
        return { shake: 0.3, noise: 0.1, precision: 0.5 };
      case 'RhythmicPattern':
        // Rocking/tapping - creates predictability, reduces chaos
        return { shake: 0.1, noise: 0.6, precision: 0.7 };
      case 'TakeABreak':
        // Leave environment - nearly eliminates all overload
        return { shake: 0, noise: 0, precision: 0.2 };
      default:
        return { shake: 1, noise: 1, precision: 1 };
    }
  })();

  // Apply regulation to visual effects
  $: shakeIntensity = baseShakeIntensity * regulationMultiplier.shake;
  $: noiseIntensity = baseNoiseIntensity * regulationMultiplier.noise;
  $: effectivePrecision = activeStrategy
    ? Math.max(20, precision * regulationMultiplier.precision)
    : precision;

  // Mode label based on precision
  $: modeLabel = precision < 70 ? 'Neurotypical Mode' : precision < 90 ? 'Heightened Mode' : 'Autistic Experience';
  $: modeClass = precision < 70 ? 'typical' : precision < 90 ? 'elevated' : 'autistic';

  function handleActivate(event: CustomEvent<{ strategy: string }>) {
    activeStrategy = event.detail.strategy;
  }

  function handleDeactivate() {
    activeStrategy = null;
  }

  function handleSceneChange(event: CustomEvent<{ scene: string }>) {
    currentScene = event.detail.scene;
  }
</script>

<div class="app-container">
  <header class="app-header">
    <h1>See the World Differently</h1>
    <p class="tagline">
      An interactive simulation of autistic sensory processing
    </p>
    <div class="mode-indicator {modeClass}">
      <span class="mode-dot"></span>
      {modeLabel}
    </div>
  </header>

  <main>
    {#if error}
      <div class="error">
        <span class="error-icon">⚠️</span>
        {error}
      </div>
    {/if}

    {#if !wasmReady}
      <div class="loading">
        <div class="spinner"></div>
        <span>Loading simulation...</span>
      </div>
    {:else}
      <div class="intro-card">
        <p>
          <strong>Try it:</strong> Drag the slider to the right to experience how some autistic individuals
          perceive the world — where every detail demands attention and the brain works overtime to process it all.
        </p>
      </div>

      <div class="scene-selector-row">
        <SceneSelector value={currentScene} on:change={handleSceneChange} />
        {#if currentScene !== 'abstract'}
          <AudioProcessor
            scene={currentScene}
            precision={effectivePrecision}
            regulationActive={activeStrategy !== null}
            bind:enabled={audioEnabled}
          />
        {/if}
      </div>

      <div class="simulation-area" data-testid="app-ready">
        {#if currentScene === 'abstract'}
          <SplitViewCanvas
            precision={effectivePrecision}
            {shakeIntensity}
            {noiseIntensity}
          />
        {:else}
          <VideoSplitView
            scene={currentScene}
            precision={effectivePrecision}
            {shakeIntensity}
            on:error={() => { currentScene = 'abstract'; }}
          />
        {/if}

        <div class="controls-grid">
          <PrecisionSlider bind:value={precision} />
          <LoadGauge value={cpuCost} />
        </div>

        <RegulationPanel
          visible={showRegulation}
          {activeStrategy}
          on:activate={handleActivate}
          on:deactivate={handleDeactivate}
        />
      </div>

      <footer>
        <button class="about-button" on:click={() => showAbout = true}>
          <span class="info-icon">ℹ️</span>
          Learn the science behind this
        </button>
      </footer>
    {/if}
  </main>
</div>

<AboutModal bind:open={showAbout} />

<style>
  :global(body) {
    margin: 0;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
    background: linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%);
    min-height: 100vh;
    color: #1e293b;
  }

  .app-container {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .app-header {
    text-align: center;
    padding: 2rem 1rem 1.5rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
  }

  h1 {
    margin: 0;
    font-size: 2rem;
    font-weight: 800;
    letter-spacing: -0.02em;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .tagline {
    margin: 0.5rem 0 1rem;
    font-size: 1rem;
    opacity: 0.9;
    font-weight: 400;
  }

  .mode-indicator {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 50px;
    font-size: 0.9rem;
    font-weight: 600;
    backdrop-filter: blur(4px);
    transition: all 0.3s ease;
  }

  .mode-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    transition: all 0.3s ease;
  }

  .mode-indicator.typical {
    background: rgba(16, 185, 129, 0.3);
  }

  .mode-indicator.typical .mode-dot {
    background: #10b981;
    box-shadow: 0 0 8px #10b981;
  }

  .mode-indicator.elevated {
    background: rgba(245, 158, 11, 0.3);
  }

  .mode-indicator.elevated .mode-dot {
    background: #f59e0b;
    box-shadow: 0 0 8px #f59e0b;
  }

  .mode-indicator.autistic {
    background: rgba(239, 68, 68, 0.3);
    animation: pulse-bg 1s ease-in-out infinite;
  }

  .mode-indicator.autistic .mode-dot {
    background: #ef4444;
    box-shadow: 0 0 12px #ef4444;
    animation: pulse-dot 0.8s ease-in-out infinite;
  }

  @keyframes pulse-bg {
    0%, 100% { background: rgba(239, 68, 68, 0.3); }
    50% { background: rgba(239, 68, 68, 0.5); }
  }

  @keyframes pulse-dot {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.2); }
  }

  main {
    flex: 1;
    max-width: 800px;
    width: 100%;
    margin: 0 auto;
    padding: 1.5rem;
  }

  .intro-card {
    background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
    border: 1px solid #bfdbfe;
    border-radius: 12px;
    padding: 1rem 1.25rem;
    margin-bottom: 1.5rem;
  }

  .intro-card p {
    margin: 0;
    font-size: 0.95rem;
    line-height: 1.6;
    color: #1e40af;
  }

  .intro-card strong {
    color: #1e3a8a;
  }

  .scene-selector-row {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .simulation-area {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .controls-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
  }

  @media (max-width: 640px) {
    .controls-grid {
      grid-template-columns: 1fr;
    }

    h1 {
      font-size: 1.5rem;
    }
  }

  .loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    padding: 4rem 2rem;
    color: #64748b;
  }

  .spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #e2e8f0;
    border-top-color: #667eea;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .error {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
    color: #991b1b;
    padding: 1rem 1.25rem;
    border-radius: 12px;
    border: 1px solid #fecaca;
    margin-bottom: 1.5rem;
    font-weight: 500;
  }

  .error-icon {
    font-size: 1.25rem;
  }

  footer {
    text-align: center;
    padding: 1.5rem 0 0;
    margin-top: 1rem;
  }

  .about-button {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: white;
    border: 2px solid #e2e8f0;
    padding: 0.75rem 1.5rem;
    border-radius: 50px;
    cursor: pointer;
    color: #475569;
    font-size: 0.95rem;
    font-weight: 500;
    transition: all 0.2s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  }

  .about-button:hover {
    border-color: #667eea;
    color: #667eea;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
  }

  .info-icon {
    font-size: 1.1rem;
  }
</style>
