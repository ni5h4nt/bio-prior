// WASM bindings for bio-prior-core

let wasmModule: typeof import('../../rust-core/pkg/bio_prior_core') | null = null;

export async function initWasm(): Promise<void> {
  if (wasmModule) return;

  const module = await import('../../rust-core/pkg/bio_prior_core');
  await module.default();
  wasmModule = module;
}

export function sliderToPrecision(sliderValue: number): number {
  if (!wasmModule) throw new Error('WASM not initialized');
  return wasmModule.slider_to_precision(sliderValue);
}

export interface ProcessedFrame {
  pixels: Uint8Array;
  cpu_cost: number;
  shake_x: number;
  shake_y: number;
  noise_intensity: number;
}

export function processFrame(
  pixels: Uint8Array,
  width: number,
  height: number,
  precision: number
): ProcessedFrame {
  if (!wasmModule) throw new Error('WASM not initialized');
  // Note: process_frame will be implemented in Rust core
  // For now, this is a placeholder that will be connected when available
  return (wasmModule as any).process_frame(pixels, width, height, precision);
}

export type RegulationStrategy = 'ReduceInput' | 'RhythmicPattern' | 'TakeABreak';

export interface RegulationEffect {
  video_gain: number;
  audio_gain: number;
  pulse_intensity: number;
  calm_transition: number;
}

export function applyRegulation(
  strategy: RegulationStrategy,
  timeActiveMs: number
): RegulationEffect {
  if (!wasmModule) throw new Error('WASM not initialized');
  // Note: apply_regulation will be implemented in Rust core
  // For now, this is a placeholder that will be connected when available
  return (wasmModule as any).apply_regulation(strategy, timeActiveMs);
}

export function isWasmInitialized(): boolean {
  return wasmModule !== null;
}
