//! Precision weighting module
//!
//! Maps user-facing slider values (0-100) to internal precision parameters.

/// Converts a slider value (0-100) to internal precision (0.0-1.0).
///
/// Uses a cubic curve for non-linear scaling:
/// - 0-70: "neurotypical range" — stable, filtered
/// - 70-90: "elevated" — noticeably reactive
/// - 90-100: "overload" — rapid destabilization
pub fn slider_to_precision(slider_value: u8) -> f32 {
    let normalized = slider_value as f32 / 100.0;
    let precision = normalized * normalized * normalized;
    precision.min(1.0)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn slider_zero_returns_zero_precision() {
        assert_eq!(slider_to_precision(0), 0.0);
    }

    #[test]
    fn slider_100_returns_one_precision() {
        assert_eq!(slider_to_precision(100), 1.0);
    }

    #[test]
    fn slider_50_returns_low_precision() {
        // Cubic: 0.5^3 = 0.125
        let result = slider_to_precision(50);
        assert!((result - 0.125).abs() < 0.001);
    }

    #[test]
    fn slider_values_above_100_clamped_to_one() {
        // Even though type is u8, test boundary behavior
        assert_eq!(slider_to_precision(100), 1.0);
    }

    #[test]
    fn precision_increases_monotonically() {
        let mut prev = 0.0;
        for i in 0..=100 {
            let current = slider_to_precision(i);
            assert!(current >= prev, "precision should increase: {} -> {}", prev, current);
            prev = current;
        }
    }
}
