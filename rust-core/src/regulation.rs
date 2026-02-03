//! Self-regulation strategies module
//!
//! Implements calming effects that reduce system chaos.

use wasm_bindgen::prelude::*;
use serde::{Deserialize, Serialize};

/// Available regulation strategies
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[wasm_bindgen]
pub enum RegulationStrategy {
    /// Dims video, mutes audio
    ReduceInput,
    /// Adds predictable rhythmic pattern
    RhythmicPattern,
    /// Gradual fade to calm baseline
    TakeABreak,
}

/// Modifiers applied by a regulation strategy
#[derive(Debug, Clone, Serialize, Deserialize)]
#[wasm_bindgen(getter_with_clone)]
pub struct RegulationEffect {
    /// Video brightness multiplier (0.0-1.0)
    pub video_gain: f32,
    /// Audio volume multiplier (0.0-1.0)
    pub audio_gain: f32,
    /// Rhythmic pulse intensity (0.0-1.0)
    pub pulse_intensity: f32,
    /// Transition progress to calm (0.0-1.0)
    pub calm_transition: f32,
}

/// Calculate regulation effect based on strategy and activation time
pub fn apply_regulation(strategy: RegulationStrategy, time_active_ms: u32) -> RegulationEffect {
    // Normalize time to 0-1 over 3 seconds
    let time_factor = (time_active_ms as f32 / 3000.0).min(1.0);

    match strategy {
        RegulationStrategy::ReduceInput => RegulationEffect {
            // Gradually dim to 30% brightness
            video_gain: 1.0 - (time_factor * 0.7),
            // Gradually mute to 20% volume
            audio_gain: 1.0 - (time_factor * 0.8),
            pulse_intensity: 0.0,
            calm_transition: 0.0,
        },

        RegulationStrategy::RhythmicPattern => {
            // Pulsing effect based on time (0.5 Hz)
            let pulse_phase = (time_active_ms as f32 / 2000.0 * std::f32::consts::PI).sin();
            let pulse = (pulse_phase + 1.0) / 2.0; // Normalize to 0-1

            RegulationEffect {
                video_gain: 1.0,
                audio_gain: 1.0,
                pulse_intensity: pulse * time_factor, // Ramp up pulse intensity
                calm_transition: 0.0,
            }
        }

        RegulationStrategy::TakeABreak => RegulationEffect {
            // Fade everything to calm
            video_gain: 1.0 - (time_factor * 0.5),
            audio_gain: 1.0 - (time_factor * 0.6),
            pulse_intensity: 0.0,
            calm_transition: time_factor,
        },
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn reduce_input_lowers_gains() {
        let effect = apply_regulation(RegulationStrategy::ReduceInput, 1000);
        assert!(effect.video_gain < 1.0);
        assert!(effect.audio_gain < 1.0);
    }

    #[test]
    fn rhythmic_pattern_has_pulse() {
        let effect = apply_regulation(RegulationStrategy::RhythmicPattern, 1000);
        assert!(effect.pulse_intensity > 0.0);
    }

    #[test]
    fn take_a_break_transitions_to_calm() {
        let effect = apply_regulation(RegulationStrategy::TakeABreak, 2000);
        assert!(effect.calm_transition > 0.0);
    }

    #[test]
    fn effects_increase_over_time() {
        let early = apply_regulation(RegulationStrategy::ReduceInput, 100);
        let later = apply_regulation(RegulationStrategy::ReduceInput, 2000);
        assert!(later.video_gain <= early.video_gain);
    }

    #[test]
    fn all_effects_in_valid_range() {
        for strategy in [
            RegulationStrategy::ReduceInput,
            RegulationStrategy::RhythmicPattern,
            RegulationStrategy::TakeABreak,
        ] {
            let effect = apply_regulation(strategy, 1000);
            assert!(effect.video_gain >= 0.0 && effect.video_gain <= 1.0);
            assert!(effect.audio_gain >= 0.0 && effect.audio_gain <= 1.0);
            assert!(effect.pulse_intensity >= 0.0 && effect.pulse_intensity <= 1.0);
            assert!(effect.calm_transition >= 0.0 && effect.calm_transition <= 1.0);
        }
    }
}
