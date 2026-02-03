//! Reconstruction pipeline for sensory distortion effects
//!
//! Applies precision-weighted transformations to simulate
//! sensory processing at different gain levels.

use wasm_bindgen::prelude::*;
use serde::{Deserialize, Serialize};

/// Result of processing a frame through the reconstruction pipeline
#[derive(Debug, Clone, Serialize, Deserialize)]
#[wasm_bindgen(getter_with_clone)]
pub struct ProcessedFrame {
    /// Pixel data with applied effects (RGBA)
    pub pixels: Vec<u8>,
    /// Computed CPU cost metric (0.0-1.0)
    pub cpu_cost: f32,
    /// Screen shake offset X
    pub shake_x: f32,
    /// Screen shake offset Y
    pub shake_y: f32,
    /// Static noise intensity (0.0-1.0)
    pub noise_intensity: f32,
}

/// Process a video frame with precision-weighted effects
pub fn process_frame(pixels: &[u8], _width: u32, _height: u32, precision: f32) -> ProcessedFrame {
    let precision_clamped = precision.clamp(0.0, 1.0);

    // Apply saturation boost based on precision
    let processed_pixels = apply_saturation_boost(pixels, precision_clamped);

    // Calculate metrics
    let cpu_cost = calculate_cpu_cost(precision_clamped);
    let (shake_x, shake_y) = calculate_shake(precision_clamped);
    let noise_intensity = calculate_noise_intensity(precision_clamped);

    ProcessedFrame {
        pixels: processed_pixels,
        cpu_cost,
        shake_x,
        shake_y,
        noise_intensity,
    }
}

fn apply_saturation_boost(pixels: &[u8], precision: f32) -> Vec<u8> {
    let boost = 1.0 + precision * 0.5; // Up to 50% saturation increase

    pixels
        .chunks(4)
        .flat_map(|rgba| {
            let r = rgba[0] as f32;
            let g = rgba[1] as f32;
            let b = rgba[2] as f32;
            let a = rgba[3];

            let gray = (r + g + b) / 3.0;

            let new_r = (gray + (r - gray) * boost).clamp(0.0, 255.0) as u8;
            let new_g = (gray + (g - gray) * boost).clamp(0.0, 255.0) as u8;
            let new_b = (gray + (b - gray) * boost).clamp(0.0, 255.0) as u8;

            [new_r, new_g, new_b, a]
        })
        .collect()
}

fn calculate_cpu_cost(precision: f32) -> f32 {
    // Exponential cost curve: low precision = minimal cost
    // Simulates computational exhaustion at high precision
    let base_cost = 0.1;
    let precision_cost = precision * precision * 0.9;
    (base_cost + precision_cost).min(1.0)
}

fn calculate_shake(precision: f32) -> (f32, f32) {
    // Only shake at high precision (threshold at 0.7)
    if precision < 0.7 {
        return (0.0, 0.0);
    }

    let intensity = (precision - 0.7) / 0.3; // Normalize to 0-1 above threshold
    let max_shake = 5.0; // pixels

    // Deterministic shake based on precision (real impl would use time)
    let shake_x = intensity * max_shake * (precision * 17.0).sin();
    let shake_y = intensity * max_shake * (precision * 23.0).cos();

    (shake_x, shake_y)
}

fn calculate_noise_intensity(precision: f32) -> f32 {
    // Gradual noise increase, more pronounced above 0.3
    if precision < 0.3 {
        0.0
    } else {
        ((precision - 0.3) / 0.7).powf(1.5)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn create_test_frame(width: u32, height: u32) -> Vec<u8> {
        vec![128u8; (width * height * 4) as usize] // RGBA gray
    }

    #[test]
    fn process_frame_returns_same_size() {
        let pixels = create_test_frame(10, 10);
        let result = process_frame(&pixels, 10, 10, 0.5);
        assert_eq!(result.pixels.len(), pixels.len());
    }

    #[test]
    fn zero_precision_minimal_effect() {
        let pixels = create_test_frame(10, 10);
        let result = process_frame(&pixels, 10, 10, 0.0);
        assert!(result.cpu_cost < 0.2);
        assert!(result.shake_x.abs() < 0.01);
        assert!(result.shake_y.abs() < 0.01);
        assert!(result.noise_intensity < 0.01);
    }

    #[test]
    fn high_precision_increases_effects() {
        let pixels = create_test_frame(10, 10);
        let low = process_frame(&pixels, 10, 10, 0.1);
        let high = process_frame(&pixels, 10, 10, 0.9);
        assert!(high.cpu_cost > low.cpu_cost);
        assert!(high.noise_intensity > low.noise_intensity);
    }

    #[test]
    fn cpu_cost_in_valid_range() {
        let pixels = create_test_frame(10, 10);
        for p in [0.0, 0.25, 0.5, 0.75, 1.0] {
            let result = process_frame(&pixels, 10, 10, p);
            assert!(result.cpu_cost >= 0.0 && result.cpu_cost <= 1.0);
        }
    }
}
