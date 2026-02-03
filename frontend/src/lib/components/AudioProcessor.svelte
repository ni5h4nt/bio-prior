<script lang="ts">
  import { onDestroy } from 'svelte';

  export let precision: number = 20;
  export let enabled: boolean = false;
  export let regulationActive: boolean = false;
  export let videoElement: HTMLVideoElement | null = null;

  let audioContext: AudioContext | null = null;
  let sourceNode: MediaElementAudioSourceNode | null = null;
  let compressor: DynamicsCompressorNode | null = null;
  let highShelf: BiquadFilterNode | null = null;
  let gainNode: GainNode | null = null;
  let isInitialized = false;

  // Audio effect calculations based on precision
  $: intensity = precision / 100;
  $: compressionThreshold = -24 + (intensity * 20); // -24 to -4 dB
  $: compressionRatio = 4 + (intensity * 8); // 4:1 to 12:1
  $: highShelfGain = intensity * 12; // 0 to 12 dB boost
  $: regulationMultiplier = regulationActive ? 0.5 : 1;
  $: masterGain = (0.3 + (intensity * 0.4)) * regulationMultiplier; // 0.3 to 0.7, halved when regulated

  // Update audio parameters reactively
  $: if (compressor && highShelf && gainNode) {
    compressor.threshold.value = compressionThreshold;
    compressor.ratio.value = compressionRatio;
    highShelf.gain.value = highShelfGain;
    gainNode.gain.value = enabled ? masterGain : 0;
  }

  // Unmute/mute video when enabled changes
  $: if (videoElement) {
    videoElement.muted = !enabled;
  }

  async function initAudio() {
    if (isInitialized || !videoElement) return;

    audioContext = new AudioContext();

    // Use the video element as the audio source
    sourceNode = audioContext.createMediaElementSource(videoElement);
    compressor = audioContext.createDynamicsCompressor();
    highShelf = audioContext.createBiquadFilter();
    gainNode = audioContext.createGain();

    // Configure compressor (makes quiet sounds louder, loud sounds quieter)
    compressor.threshold.value = compressionThreshold;
    compressor.knee.value = 10;
    compressor.ratio.value = compressionRatio;
    compressor.attack.value = 0.003;
    compressor.release.value = 0.25;

    // Configure high shelf filter (boost high frequencies - sensory sensitivity)
    highShelf.type = 'highshelf';
    highShelf.frequency.value = 3000;
    highShelf.gain.value = highShelfGain;

    // Configure gain
    gainNode.gain.value = masterGain;

    // Connect chain: video -> compressor -> highShelf -> gain -> destination
    sourceNode.connect(compressor);
    compressor.connect(highShelf);
    highShelf.connect(gainNode);
    gainNode.connect(audioContext.destination);

    isInitialized = true;
  }

  async function toggleAudio() {
    if (!videoElement) return;

    if (!enabled) {
      enabled = true;
      try {
        await initAudio();
        if (audioContext?.state === 'suspended') {
          await audioContext.resume();
        }
        videoElement.muted = false;
      } catch (e) {
        console.warn('Audio initialization failed:', e);
      }
    } else {
      enabled = false;
      videoElement.muted = true;
    }
  }

  onDestroy(() => {
    if (audioContext) {
      audioContext.close();
      audioContext = null;
    }
    isInitialized = false;
  });
</script>

<button
  class="audio-toggle"
  class:enabled
  on:click={toggleAudio}
  aria-label={enabled ? 'Mute audio' : 'Enable audio'}
>
  {#if enabled}
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
      <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 11-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z" />
      <path d="M15.932 7.757a.75.75 0 011.061 0 6 6 0 010 8.486.75.75 0 01-1.06-1.061 4.5 4.5 0 000-6.364.75.75 0 010-1.06z" />
    </svg>
    <span>Audio On</span>
  {:else}
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
      <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM17.78 9.22a.75.75 0 10-1.06 1.06L18.44 12l-1.72 1.72a.75.75 0 001.06 1.06l1.72-1.72 1.72 1.72a.75.75 0 101.06-1.06L20.56 12l1.72-1.72a.75.75 0 00-1.06-1.06l-1.72 1.72-1.72-1.72z" />
    </svg>
    <span>Enable Audio</span>
  {/if}
</button>

<style>
  .audio-toggle {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: #6b7280;
    background: white;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .audio-toggle:hover {
    border-color: #9ca3af;
    background: #f9fafb;
  }

  .audio-toggle.enabled {
    color: #059669;
    border-color: #10b981;
    background: #ecfdf5;
  }

  .audio-toggle.enabled:hover {
    background: #d1fae5;
  }
</style>
