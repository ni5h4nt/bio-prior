<script lang="ts">
  import { onDestroy } from 'svelte';

  export let scene: string = 'classroom';
  export let precision: number = 20;
  export let enabled: boolean = false;

  let audioContext: AudioContext | null = null;
  let baseSource: MediaElementAudioSourceNode | null = null;
  let compressor: DynamicsCompressorNode | null = null;
  let highShelf: BiquadFilterNode | null = null;
  let gainNode: GainNode | null = null;
  let audioElement: HTMLAudioElement | null = null;
  let isPlaying = false;

  const sceneAudio: Record<string, { base: string; highlights: string[] }> = {
    classroom: {
      base: '/audio/classroom-ambient.mp3',
      highlights: ['/audio/clock-tick.mp3', '/audio/pencil-scratch.mp3'],
    },
    grocery: {
      base: '/audio/grocery-ambient.mp3',
      highlights: ['/audio/cart-wheels.mp3', '/audio/checkout-beep.mp3'],
    },
    playground: {
      base: '/audio/playground-ambient.mp3',
      highlights: ['/audio/kids-shouting.mp3', '/audio/swing-creak.mp3'],
    },
  };

  // Audio effect calculations based on precision
  $: intensity = precision / 100;
  $: compressionThreshold = -24 + (intensity * 20); // -24 to -4 dB
  $: compressionRatio = 4 + (intensity * 8); // 4:1 to 12:1
  $: highShelfGain = intensity * 12; // 0 to 12 dB boost
  $: masterGain = 0.3 + (intensity * 0.4); // 0.3 to 0.7

  // Update audio parameters reactively
  $: if (compressor && highShelf && gainNode) {
    compressor.threshold.value = compressionThreshold;
    compressor.ratio.value = compressionRatio;
    highShelf.gain.value = highShelfGain;
    gainNode.gain.value = enabled ? masterGain : 0;
  }

  async function initAudio() {
    if (audioContext) return;

    audioContext = new AudioContext();

    // Create audio element
    audioElement = new Audio(sceneAudio[scene]?.base || sceneAudio.classroom.base);
    audioElement.loop = true;
    audioElement.crossOrigin = 'anonymous';

    // Create nodes
    baseSource = audioContext.createMediaElementSource(audioElement);
    compressor = audioContext.createDynamicsCompressor();
    highShelf = audioContext.createBiquadFilter();
    gainNode = audioContext.createGain();

    // Configure compressor
    compressor.threshold.value = compressionThreshold;
    compressor.knee.value = 10;
    compressor.ratio.value = compressionRatio;
    compressor.attack.value = 0.003;
    compressor.release.value = 0.25;

    // Configure high shelf filter (boost high frequencies)
    highShelf.type = 'highshelf';
    highShelf.frequency.value = 3000;
    highShelf.gain.value = highShelfGain;

    // Configure gain
    gainNode.gain.value = masterGain;

    // Connect chain: source -> compressor -> highShelf -> gain -> destination
    baseSource.connect(compressor);
    compressor.connect(highShelf);
    highShelf.connect(gainNode);
    gainNode.connect(audioContext.destination);
  }

  async function toggleAudio() {
    if (!enabled) {
      await initAudio();
      if (audioContext?.state === 'suspended') {
        await audioContext.resume();
      }
      if (audioElement) {
        await audioElement.play();
        isPlaying = true;
      }
      enabled = true;
    } else {
      if (audioElement) {
        audioElement.pause();
        isPlaying = false;
      }
      enabled = false;
    }
  }

  // Handle scene changes
  $: if (audioElement && scene) {
    const newSrc = sceneAudio[scene]?.base;
    if (newSrc && audioElement.src !== newSrc) {
      audioElement.src = newSrc;
      if (isPlaying) {
        audioElement.play();
      }
    }
  }

  onDestroy(() => {
    if (audioElement) {
      audioElement.pause();
      audioElement = null;
    }
    if (audioContext) {
      audioContext.close();
      audioContext = null;
    }
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
