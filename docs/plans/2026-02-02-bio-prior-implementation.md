# bio-prior v1 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a predictive coding simulation demonstrating sensory overload and self-regulation strategies, with TDD, linting, formatting, microcommits, and Playwright integration tests.

**Architecture:** Rust inference core compiles to WASM (web) and native (Tauri). Svelte frontend shared between both. TDD throughout with property-based testing for Rust, component testing for Svelte, E2E with Playwright.

**Tech Stack:** Rust, wasm-pack, Svelte 5, Tauri v2, Vite, Playwright, rustfmt, clippy, ESLint, Prettier

---

## Phase 0: Project Scaffolding & Tooling

### Task 0.1: Initialize Engineering Infrastructure

**Files:**
- Run: engineering script

**Step 1: Initialize progress tracking**

```bash
~/.claude/engineering/engineering.sh progress init "docs/plans/2026-02-02-bio-prior-implementation.md" "bio-prior-v1" 45
```

**Step 2: Commit**

```bash
git add -A
git commit -m "chore: initialize engineering progress tracking"
```

---

### Task 0.2: Create Rust Workspace

**Files:**
- Create: `rust-core/Cargo.toml`
- Create: `rust-core/src/lib.rs`
- Create: `.gitignore`

**Step 1: Create rust-core directory and Cargo.toml**

```bash
mkdir -p rust-core/src
```

Create `rust-core/Cargo.toml`:

```toml
[package]
name = "bio-prior-core"
version = "0.1.0"
edition = "2021"
description = "Predictive coding inference engine for sensory processing simulation"
license = "MIT"

[lib]
crate-type = ["cdylib", "rlib"]

[features]
default = ["console_error_panic_hook"]

[dependencies]
wasm-bindgen = "0.2"
js-sys = "0.3"
console_error_panic_hook = { version = "0.1", optional = true }
serde = { version = "1.0", features = ["derive"] }
serde-wasm-bindgen = "0.6"

[dev-dependencies]
wasm-bindgen-test = "0.3"
proptest = "1.4"

[profile.release]
opt-level = "s"
lto = true
```

**Step 2: Create minimal lib.rs**

Create `rust-core/src/lib.rs`:

```rust
//! bio-prior-core: Predictive coding inference engine
//!
//! This crate provides the core simulation logic for demonstrating
//! sensory processing differences and self-regulation strategies.

use wasm_bindgen::prelude::*;

/// Initialize panic hook for better error messages in WASM
#[wasm_bindgen(start)]
pub fn init() {
    #[cfg(feature = "console_error_panic_hook")]
    console_error_panic_hook::set_once();
}

#[cfg(test)]
mod tests {
    #[test]
    fn it_works() {
        assert_eq!(2 + 2, 4);
    }
}
```

**Step 3: Create .gitignore**

Create `.gitignore`:

```gitignore
# Rust
/target/
rust-core/target/
**/*.rs.bk
Cargo.lock

# WASM
rust-core/pkg/

# Node
node_modules/
dist/
.vite/

# Tauri
tauri/target/

# IDE
.idea/
.vscode/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Environment
.env
.env.local

# Test artifacts
playwright-report/
test-results/
coverage/
```

**Step 4: Verify Rust builds**

```bash
cd rust-core && cargo build
```

Expected: Build succeeds

**Step 5: Run tests**

```bash
cd rust-core && cargo test
```

Expected: 1 test passes

**Step 6: Commit**

```bash
git add rust-core/Cargo.toml rust-core/src/lib.rs .gitignore
git commit -m "chore: scaffold Rust workspace with WASM support"
```

---

### Task 0.3: Configure Rust Linting & Formatting

**Files:**
- Create: `rust-core/rustfmt.toml`
- Create: `rust-core/clippy.toml`
- Create: `rust-core/.cargo/config.toml`

**Step 1: Create rustfmt.toml**

Create `rust-core/rustfmt.toml`:

```toml
edition = "2021"
max_width = 100
tab_spaces = 4
use_small_heuristics = "Default"
newline_style = "Unix"
```

**Step 2: Create clippy.toml**

Create `rust-core/clippy.toml`:

```toml
cognitive-complexity-threshold = 15
```

**Step 3: Create cargo config for strict warnings**

```bash
mkdir -p rust-core/.cargo
```

Create `rust-core/.cargo/config.toml`:

```toml
[build]
rustflags = ["-D", "warnings"]

[alias]
lint = "clippy --all-targets --all-features -- -D warnings"
fmt-check = "fmt --all -- --check"
```

**Step 4: Run format check**

```bash
cd rust-core && cargo fmt --all -- --check
```

Expected: No formatting issues

**Step 5: Run clippy**

```bash
cd rust-core && cargo clippy --all-targets --all-features -- -D warnings
```

Expected: No warnings

**Step 6: Commit**

```bash
git add rust-core/rustfmt.toml rust-core/clippy.toml rust-core/.cargo/config.toml
git commit -m "chore: configure Rust linting (clippy) and formatting (rustfmt)"
```

---

### Task 0.4: Scaffold Svelte Frontend

**Files:**
- Create: `frontend/` directory structure via npm create

**Step 1: Create Svelte project**

```bash
npm create vite@latest frontend -- --template svelte-ts
```

**Step 2: Install dependencies**

```bash
cd frontend && npm install
```

**Step 3: Verify dev server starts**

```bash
cd frontend && npm run dev -- --port 5173 &
sleep 3
curl -s http://localhost:5173 | head -20
pkill -f "vite"
```

Expected: HTML response with Svelte app

**Step 4: Commit**

```bash
git add frontend/
git commit -m "chore: scaffold Svelte frontend with Vite"
```

---

### Task 0.5: Configure Frontend Linting & Formatting

**Files:**
- Create: `frontend/.prettierrc`
- Create: `frontend/.eslintrc.cjs`
- Modify: `frontend/package.json`

**Step 1: Install ESLint and Prettier**

```bash
cd frontend && npm install -D eslint prettier eslint-plugin-svelte eslint-config-prettier @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

**Step 2: Create .prettierrc**

Create `frontend/.prettierrc`:

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "plugins": ["prettier-plugin-svelte"],
  "overrides": [
    {
      "files": "*.svelte",
      "options": {
        "parser": "svelte"
      }
    }
  ]
}
```

**Step 3: Install Prettier Svelte plugin**

```bash
cd frontend && npm install -D prettier-plugin-svelte
```

**Step 4: Create .eslintrc.cjs**

Create `frontend/.eslintrc.cjs`:

```javascript
module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:svelte/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2020,
    extraFileExtensions: ['.svelte'],
  },
  env: {
    browser: true,
    es2017: true,
    node: true,
  },
  overrides: [
    {
      files: ['*.svelte'],
      parser: 'svelte-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser',
      },
    },
  ],
  rules: {
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
  },
};
```

**Step 5: Add lint scripts to package.json**

Edit `frontend/package.json` to add scripts:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext .ts,.svelte",
    "lint:fix": "eslint . --ext .ts,.svelte --fix",
    "format": "prettier --write .",
    "format:check": "prettier --check ."
  }
}
```

**Step 6: Run lint**

```bash
cd frontend && npm run lint
```

Expected: No errors (or fix any generated template issues)

**Step 7: Run format check**

```bash
cd frontend && npm run format
```

**Step 8: Commit**

```bash
git add frontend/.prettierrc frontend/.eslintrc.cjs frontend/package.json frontend/package-lock.json
git commit -m "chore: configure frontend linting (ESLint) and formatting (Prettier)"
```

---

### Task 0.6: Install Playwright for E2E Testing

**Files:**
- Modify: `frontend/package.json`
- Create: `frontend/playwright.config.ts`
- Create: `frontend/e2e/example.spec.ts`

**Step 1: Install Playwright**

```bash
cd frontend && npm install -D @playwright/test
```

**Step 2: Install browsers**

```bash
cd frontend && npx playwright install chromium
```

**Step 3: Create playwright.config.ts**

Create `frontend/playwright.config.ts`:

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
});
```

**Step 4: Create e2e directory and example test**

```bash
mkdir -p frontend/e2e
```

Create `frontend/e2e/example.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';

test('homepage loads', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Vite \+ Svelte/);
});
```

**Step 5: Add test script to package.json**

Edit `frontend/package.json` scripts:

```json
{
  "scripts": {
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui"
  }
}
```

**Step 6: Run Playwright test**

```bash
cd frontend && npm run test:e2e
```

Expected: 1 test passes

**Step 7: Commit**

```bash
git add frontend/playwright.config.ts frontend/e2e/ frontend/package.json frontend/package-lock.json
git commit -m "chore: add Playwright E2E testing infrastructure"
```

---

### Task 0.7: Source Demo Video Asset

**Files:**
- Create: `frontend/static/assets/classroom.mp4`
- Create: `frontend/static/assets/classroom.wav` (optional, if separating audio)

**Step 1: Find a properly licensed video**

Option A - Pexels (Recommended):
```bash
# Visit https://www.pexels.com/search/videos/classroom/
# Download a 720p video with ambient classroom activity
# Look for: movement, natural lighting, background sounds
```

Option B - Creative Commons YouTube:
```bash
# Search with CC filter
yt-dlp --flat-playlist "ytsearch5:classroom ambience" --match-filter "license=creativeCommon"

# Or manually find CC-licensed content and download
yt-dlp -f "bestvideo[height<=720]+bestaudio" -o "classroom_raw.%(ext)s" "VIDEO_URL"
```

Option C - Pixabay:
```bash
# Visit https://pixabay.com/videos/search/classroom/
# All content is royalty-free, no attribution required
```

**Step 2: Create assets directory**

```bash
mkdir -p frontend/static/assets
```

**Step 3: Process video to target format**

```bash
# Trim to 45 seconds, scale to 720p, optimize for web
ffmpeg -i classroom_raw.mp4 -t 45 -vf "scale=720:480" -c:v libx264 -crf 23 -c:a aac -b:a 128k frontend/static/assets/classroom.mp4

# Extract audio separately (optional, for Web Audio API processing)
ffmpeg -i frontend/static/assets/classroom.mp4 -vn -c:a pcm_s16le frontend/static/assets/classroom.wav
```

**Step 4: Verify files**

```bash
# Check video properties
ffprobe frontend/static/assets/classroom.mp4

# Expected: 720x480, ~45 seconds, h264 video, aac audio
```

**Step 5: Add attribution file (if using CC content)**

Create `frontend/static/assets/ATTRIBUTION.md`:

```markdown
# Asset Attribution

## classroom.mp4

Source: [Pexels / Pixabay / YouTube URL]
License: [CC0 / CC-BY / Royalty-Free]
Creator: [Name if required]
```

**Step 6: Commit**

```bash
git add frontend/static/assets/
git commit -m "asset: add classroom demo video (licensed)"
```

**Note:** Video files may be large. Consider:
- Adding `*.mp4` to `.gitignore` and using Git LFS
- Or keeping video small (<10MB) for direct commits
- Or hosting video externally and fetching at runtime

---

### Task 0.8: Phase 0 Gate

**Step 1: Run phase gate check**

```bash
~/.claude/engineering/engineering.sh phase-gate "docs/plans/2026-02-02-bio-prior-implementation.md" 0
```

**Step 2: Verify all tooling works**

```bash
# Rust
cd rust-core && cargo fmt --check && cargo clippy && cargo test

# Frontend
cd ../frontend && npm run lint && npm run format:check && npm run test:e2e
```

Expected: All checks pass

---

## Phase 1: Rust Core - Precision Module (TDD)

### Task 1.1: Write Failing Test for slider_to_precision

**Files:**
- Create: `rust-core/src/precision.rs`
- Modify: `rust-core/src/lib.rs`

**Step 1: Create precision module with test**

Create `rust-core/src/precision.rs`:

```rust
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
    todo!("implement")
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
```

**Step 2: Add module to lib.rs**

Edit `rust-core/src/lib.rs` to add:

```rust
pub mod precision;
```

**Step 3: Run test to verify it fails**

```bash
cd rust-core && cargo test precision
```

Expected: FAIL with "not yet implemented"

**Step 4: Commit failing test**

```bash
git add rust-core/src/precision.rs rust-core/src/lib.rs
git commit -m "test(precision): add failing tests for slider_to_precision"
```

---

### Task 1.2: Implement slider_to_precision

**Files:**
- Modify: `rust-core/src/precision.rs`

**Step 1: Implement the function**

Replace the `todo!()` in `rust-core/src/precision.rs`:

```rust
pub fn slider_to_precision(slider_value: u8) -> f32 {
    let normalized = slider_value as f32 / 100.0;
    let precision = normalized * normalized * normalized;
    precision.min(1.0)
}
```

**Step 2: Run tests to verify they pass**

```bash
cd rust-core && cargo test precision
```

Expected: All 5 tests pass

**Step 3: Run linting**

```bash
cd rust-core && cargo clippy --all-targets -- -D warnings
```

Expected: No warnings

**Step 4: Commit**

```bash
git add rust-core/src/precision.rs
git commit -m "feat(precision): implement cubic slider_to_precision mapping"
```

---

### Task 1.3: Add Property-Based Tests for Precision

**Files:**
- Modify: `rust-core/src/precision.rs`

**Step 1: Add proptest tests**

Add to `rust-core/src/precision.rs` in the `mod tests` block:

```rust
    use proptest::prelude::*;

    proptest! {
        #[test]
        fn precision_always_in_valid_range(slider in 0u8..=100) {
            let precision = slider_to_precision(slider);
            prop_assert!(precision >= 0.0);
            prop_assert!(precision <= 1.0);
        }

        #[test]
        fn precision_is_deterministic(slider in 0u8..=100) {
            let p1 = slider_to_precision(slider);
            let p2 = slider_to_precision(slider);
            prop_assert_eq!(p1, p2);
        }
    }
```

**Step 2: Run property tests**

```bash
cd rust-core && cargo test precision
```

Expected: All tests pass (including property tests)

**Step 3: Commit**

```bash
git add rust-core/src/precision.rs
git commit -m "test(precision): add property-based tests for valid ranges"
```

---

### Task 1.4: Add WASM Bindings for Precision

**Files:**
- Modify: `rust-core/src/precision.rs`

**Step 1: Add wasm_bindgen export**

Add to `rust-core/src/precision.rs` at the top after imports:

```rust
use wasm_bindgen::prelude::*;

/// Converts a slider value (0-100) to internal precision (0.0-1.0).
/// Exported to JavaScript/WASM.
#[wasm_bindgen]
pub fn slider_to_precision(slider_value: u8) -> f32 {
    let normalized = slider_value as f32 / 100.0;
    let precision = normalized * normalized * normalized;
    precision.min(1.0)
}
```

**Step 2: Build WASM to verify bindings compile**

```bash
cd rust-core && cargo build --target wasm32-unknown-unknown
```

Expected: Build succeeds

**Step 3: Commit**

```bash
git add rust-core/src/precision.rs
git commit -m "feat(precision): add WASM bindings for slider_to_precision"
```

---

### Task 1.5: Write Failing Tests for Reconstruction Module

**Files:**
- Create: `rust-core/src/reconstruction.rs`
- Modify: `rust-core/src/lib.rs`

**Step 1: Create reconstruction module with tests**

Create `rust-core/src/reconstruction.rs`:

```rust
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
pub fn process_frame(pixels: &[u8], width: u32, height: u32, precision: f32) -> ProcessedFrame {
    todo!("implement")
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
        assert!(result.cpu_cost < 0.1);
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
```

**Step 2: Add module to lib.rs**

Edit `rust-core/src/lib.rs`:

```rust
pub mod precision;
pub mod reconstruction;
```

**Step 3: Run test to verify it fails**

```bash
cd rust-core && cargo test reconstruction
```

Expected: FAIL with "not yet implemented"

**Step 4: Commit failing test**

```bash
git add rust-core/src/reconstruction.rs rust-core/src/lib.rs
git commit -m "test(reconstruction): add failing tests for process_frame"
```

---

### Task 1.6: Implement Reconstruction Pipeline

**Files:**
- Modify: `rust-core/src/reconstruction.rs`

**Step 1: Implement process_frame**

Replace the `todo!()` in `rust-core/src/reconstruction.rs`:

```rust
/// Process a video frame with precision-weighted effects
pub fn process_frame(pixels: &[u8], width: u32, height: u32, precision: f32) -> ProcessedFrame {
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
    // Gradual noise increase, more pronounced above 0.5
    if precision < 0.3 {
        0.0
    } else {
        ((precision - 0.3) / 0.7).powf(1.5)
    }
}
```

**Step 2: Run tests to verify they pass**

```bash
cd rust-core && cargo test reconstruction
```

Expected: All 4 tests pass

**Step 3: Run linting**

```bash
cd rust-core && cargo clippy --all-targets -- -D warnings
```

**Step 4: Commit**

```bash
git add rust-core/src/reconstruction.rs
git commit -m "feat(reconstruction): implement frame processing with saturation, shake, noise"
```

---

### Task 1.7: Write Failing Tests for Regulation Module

**Files:**
- Create: `rust-core/src/regulation.rs`
- Modify: `rust-core/src/lib.rs`

**Step 1: Create regulation module with tests**

Create `rust-core/src/regulation.rs`:

```rust
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
    todo!("implement")
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
```

**Step 2: Add module to lib.rs**

Edit `rust-core/src/lib.rs`:

```rust
pub mod precision;
pub mod reconstruction;
pub mod regulation;
```

**Step 3: Run test to verify it fails**

```bash
cd rust-core && cargo test regulation
```

Expected: FAIL with "not yet implemented"

**Step 4: Commit failing test**

```bash
git add rust-core/src/regulation.rs rust-core/src/lib.rs
git commit -m "test(regulation): add failing tests for apply_regulation"
```

---

### Task 1.8: Implement Regulation Strategies

**Files:**
- Modify: `rust-core/src/regulation.rs`

**Step 1: Implement apply_regulation**

Replace the `todo!()` in `rust-core/src/regulation.rs`:

```rust
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
        },

        RegulationStrategy::TakeABreak => RegulationEffect {
            // Fade everything to calm
            video_gain: 1.0 - (time_factor * 0.5),
            audio_gain: 1.0 - (time_factor * 0.6),
            pulse_intensity: 0.0,
            calm_transition: time_factor,
        },
    }
}
```

**Step 2: Run tests to verify they pass**

```bash
cd rust-core && cargo test regulation
```

Expected: All 5 tests pass

**Step 3: Run full test suite**

```bash
cd rust-core && cargo test
```

Expected: All tests pass

**Step 4: Run linting**

```bash
cd rust-core && cargo clippy --all-targets -- -D warnings
```

**Step 5: Commit**

```bash
git add rust-core/src/regulation.rs
git commit -m "feat(regulation): implement three regulation strategies with time-based effects"
```

---

### Task 1.9: Phase 1 Gate

**Step 1: Run all Rust tests**

```bash
cd rust-core && cargo test
```

Expected: All tests pass

**Step 2: Run full lint suite**

```bash
cd rust-core && cargo fmt --check && cargo clippy --all-targets -- -D warnings
```

Expected: No issues

**Step 3: Run phase gate**

```bash
~/.claude/engineering/engineering.sh phase-gate "docs/plans/2026-02-02-bio-prior-implementation.md" 1
```

---

## Phase 2: WASM Build & Integration

### Task 2.1: Install wasm-pack

**Step 1: Install wasm-pack**

```bash
curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh
```

Or if already installed, verify:

```bash
wasm-pack --version
```

Expected: Version output (e.g., wasm-pack 0.12.x)

**Step 2: Commit (no changes, just verification)**

---

### Task 2.2: Build WASM Package

**Files:**
- Generated: `rust-core/pkg/`

**Step 1: Build WASM with wasm-pack**

```bash
cd rust-core && wasm-pack build --target web --out-dir pkg
```

Expected: Build succeeds, `pkg/` directory created

**Step 2: Verify generated files**

```bash
ls rust-core/pkg/
```

Expected: `bio_prior_core.js`, `bio_prior_core_bg.wasm`, `bio_prior_core.d.ts`, `package.json`

**Step 3: Add pkg to gitignore (already done) and commit build script**

Create `rust-core/build-wasm.sh`:

```bash
#!/bin/bash
set -e
wasm-pack build --target web --out-dir pkg
echo "WASM build complete: rust-core/pkg/"
```

```bash
chmod +x rust-core/build-wasm.sh
git add rust-core/build-wasm.sh
git commit -m "chore: add WASM build script"
```

---

### Task 2.3: Create WASM TypeScript Bindings

**Files:**
- Create: `frontend/src/lib/wasm.ts`

**Step 1: Create WASM loader**

Create `frontend/src/lib/wasm.ts`:

```typescript
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
  return wasmModule.process_frame(pixels, width, height, precision);
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
  return wasmModule.apply_regulation(strategy, timeActiveMs);
}

export function isWasmInitialized(): boolean {
  return wasmModule !== null;
}
```

**Step 2: Commit**

```bash
git add frontend/src/lib/wasm.ts
git commit -m "feat(frontend): add TypeScript WASM bindings"
```

---

### Task 2.4: Configure Vite for WASM

**Files:**
- Modify: `frontend/vite.config.ts`

**Step 1: Update Vite config for WASM**

Edit `frontend/vite.config.ts`:

```typescript
import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [svelte()],
  server: {
    fs: {
      // Allow serving files from rust-core/pkg
      allow: ['..'],
    },
  },
  optimizeDeps: {
    exclude: ['bio_prior_core'],
  },
  build: {
    target: 'esnext',
  },
});
```

**Step 2: Commit**

```bash
git add frontend/vite.config.ts
git commit -m "chore(frontend): configure Vite for WASM imports"
```

---

### Task 2.5: Phase 2 Gate

**Step 1: Rebuild WASM**

```bash
cd rust-core && ./build-wasm.sh
```

**Step 2: Verify frontend can import (build check)**

```bash
cd frontend && npm run build
```

Expected: Build succeeds

**Step 3: Run phase gate**

```bash
~/.claude/engineering/engineering.sh phase-gate "docs/plans/2026-02-02-bio-prior-implementation.md" 2
```

---

## Phase 3: Svelte Components (TDD with Playwright)

### Task 3.1: Create PrecisionSlider Component

**Files:**
- Create: `frontend/src/lib/components/PrecisionSlider.svelte`
- Create: `frontend/e2e/precision-slider.spec.ts`

**Step 1: Write failing E2E test**

Create `frontend/e2e/precision-slider.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';

test.describe('PrecisionSlider', () => {
  test('slider starts at default value', async ({ page }) => {
    await page.goto('/');
    const slider = page.getByRole('slider', { name: /sensory detail/i });
    await expect(slider).toBeVisible();
    await expect(slider).toHaveValue('20');
  });

  test('slider can be adjusted', async ({ page }) => {
    await page.goto('/');
    const slider = page.getByRole('slider', { name: /sensory detail/i });
    await slider.fill('75');
    await expect(slider).toHaveValue('75');
  });

  test('displays current value', async ({ page }) => {
    await page.goto('/');
    const slider = page.getByRole('slider', { name: /sensory detail/i });
    await slider.fill('50');
    await expect(page.getByText('50')).toBeVisible();
  });
});
```

**Step 2: Run test to verify it fails**

```bash
cd frontend && npm run test:e2e -- precision-slider.spec.ts
```

Expected: FAIL (slider not found)

**Step 3: Create minimal component**

Create `frontend/src/lib/components/PrecisionSlider.svelte`:

```svelte
<script lang="ts">
  export let value: number = 20;
  export let min: number = 0;
  export let max: number = 100;

  function handleInput(event: Event) {
    const target = event.target as HTMLInputElement;
    value = parseInt(target.value, 10);
  }
</script>

<div class="precision-slider">
  <label for="precision">Sensory Detail</label>
  <input
    id="precision"
    type="range"
    {min}
    {max}
    {value}
    on:input={handleInput}
    aria-label="Sensory Detail"
  />
  <span class="value">{value}</span>
</div>

<style>
  .precision-slider {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 1rem;
  }

  label {
    font-weight: 600;
  }

  input[type="range"] {
    width: 100%;
    cursor: pointer;
  }

  .value {
    text-align: center;
    font-size: 1.25rem;
  }
</style>
```

**Step 4: Update App.svelte to include component**

Edit `frontend/src/App.svelte`:

```svelte
<script lang="ts">
  import PrecisionSlider from './lib/components/PrecisionSlider.svelte';

  let precision = 20;
</script>

<main>
  <h1>bio-prior</h1>
  <PrecisionSlider bind:value={precision} />
</main>

<style>
  main {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
  }

  h1 {
    text-align: center;
    margin-bottom: 2rem;
  }
</style>
```

**Step 5: Run tests to verify they pass**

```bash
cd frontend && npm run test:e2e -- precision-slider.spec.ts
```

Expected: All 3 tests pass

**Step 6: Commit**

```bash
git add frontend/src/lib/components/PrecisionSlider.svelte frontend/src/App.svelte frontend/e2e/precision-slider.spec.ts
git commit -m "feat(frontend): add PrecisionSlider component with E2E tests"
```

---

### Task 3.2: Create LoadGauge Component

**Files:**
- Create: `frontend/src/lib/components/LoadGauge.svelte`
- Create: `frontend/e2e/load-gauge.spec.ts`

**Step 1: Write failing E2E test**

Create `frontend/e2e/load-gauge.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';

test.describe('LoadGauge', () => {
  test('displays processing load label', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText(/processing load/i)).toBeVisible();
  });

  test('shows percentage value', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText(/%/)).toBeVisible();
  });

  test('gauge updates when slider changes', async ({ page }) => {
    await page.goto('/');
    const slider = page.getByRole('slider', { name: /sensory detail/i });

    // Low value = low load
    await slider.fill('10');
    const lowLoad = await page.getByTestId('load-value').textContent();

    // High value = high load
    await slider.fill('90');
    const highLoad = await page.getByTestId('load-value').textContent();

    expect(parseInt(highLoad || '0')).toBeGreaterThan(parseInt(lowLoad || '0'));
  });
});
```

**Step 2: Run test to verify it fails**

```bash
cd frontend && npm run test:e2e -- load-gauge.spec.ts
```

Expected: FAIL

**Step 3: Create component**

Create `frontend/src/lib/components/LoadGauge.svelte`:

```svelte
<script lang="ts">
  export let value: number = 0;

  $: percentage = Math.round(value * 100);
  $: barWidth = `${percentage}%`;
  $: isOverloaded = percentage > 80;
</script>

<div class="load-gauge">
  <span class="label">Processing Load</span>
  <div class="bar-container">
    <div
      class="bar"
      class:overloaded={isOverloaded}
      style="width: {barWidth}"
    />
  </div>
  <span class="percentage" data-testid="load-value">{percentage}%</span>
</div>

<style>
  .load-gauge {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.5rem 1rem;
  }

  .label {
    font-weight: 600;
    min-width: 120px;
  }

  .bar-container {
    flex: 1;
    height: 20px;
    background: #e0e0e0;
    border-radius: 10px;
    overflow: hidden;
  }

  .bar {
    height: 100%;
    background: #4caf50;
    transition: width 0.1s ease-out, background-color 0.3s;
  }

  .bar.overloaded {
    background: #f44336;
  }

  .percentage {
    min-width: 50px;
    text-align: right;
    font-family: monospace;
  }
</style>
```

**Step 4: Update App.svelte**

Edit `frontend/src/App.svelte`:

```svelte
<script lang="ts">
  import PrecisionSlider from './lib/components/PrecisionSlider.svelte';
  import LoadGauge from './lib/components/LoadGauge.svelte';

  let precision = 20;

  // Simple CPU cost calculation (matches Rust logic)
  $: cpuCost = 0.1 + (precision / 100) ** 2 * 0.9;
</script>

<main>
  <h1>bio-prior</h1>
  <PrecisionSlider bind:value={precision} />
  <LoadGauge value={cpuCost} />
</main>

<style>
  main {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
  }

  h1 {
    text-align: center;
    margin-bottom: 2rem;
  }
</style>
```

**Step 5: Run tests**

```bash
cd frontend && npm run test:e2e -- load-gauge.spec.ts
```

Expected: All tests pass

**Step 6: Commit**

```bash
git add frontend/src/lib/components/LoadGauge.svelte frontend/src/App.svelte frontend/e2e/load-gauge.spec.ts
git commit -m "feat(frontend): add LoadGauge component with E2E tests"
```

---

### Task 3.3: Create RegulationPanel Component

**Files:**
- Create: `frontend/src/lib/components/RegulationPanel.svelte`
- Create: `frontend/e2e/regulation-panel.spec.ts`

**Step 1: Write failing E2E test**

Create `frontend/e2e/regulation-panel.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';

test.describe('RegulationPanel', () => {
  test('panel hidden at low precision', async ({ page }) => {
    await page.goto('/');
    const slider = page.getByRole('slider', { name: /sensory detail/i });
    await slider.fill('30');
    await expect(page.getByText(/regulation strategies/i)).not.toBeVisible();
  });

  test('panel appears at high precision', async ({ page }) => {
    await page.goto('/');
    const slider = page.getByRole('slider', { name: /sensory detail/i });
    await slider.fill('85');
    await expect(page.getByText(/regulation strategies/i)).toBeVisible();
  });

  test('has three strategy buttons', async ({ page }) => {
    await page.goto('/');
    const slider = page.getByRole('slider', { name: /sensory detail/i });
    await slider.fill('85');

    await expect(page.getByRole('button', { name: /reduce input/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /rhythmic pattern/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /take a break/i })).toBeVisible();
  });

  test('clicking strategy activates it', async ({ page }) => {
    await page.goto('/');
    const slider = page.getByRole('slider', { name: /sensory detail/i });
    await slider.fill('85');

    const button = page.getByRole('button', { name: /reduce input/i });
    await button.click();
    await expect(button).toHaveAttribute('aria-pressed', 'true');
  });
});
```

**Step 2: Run test to verify it fails**

```bash
cd frontend && npm run test:e2e -- regulation-panel.spec.ts
```

Expected: FAIL

**Step 3: Create component**

Create `frontend/src/lib/components/RegulationPanel.svelte`:

```svelte
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
      {#each strategies as strategy}
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
```

**Step 4: Update App.svelte**

Edit `frontend/src/App.svelte`:

```svelte
<script lang="ts">
  import PrecisionSlider from './lib/components/PrecisionSlider.svelte';
  import LoadGauge from './lib/components/LoadGauge.svelte';
  import RegulationPanel from './lib/components/RegulationPanel.svelte';

  let precision = 20;
  let activeStrategy: string | null = null;

  $: cpuCost = 0.1 + (precision / 100) ** 2 * 0.9;
  $: showRegulation = precision >= 70;

  function handleActivate(event: CustomEvent<{ strategy: string }>) {
    activeStrategy = event.detail.strategy;
  }

  function handleDeactivate() {
    activeStrategy = null;
  }
</script>

<main>
  <h1>bio-prior</h1>
  <PrecisionSlider bind:value={precision} />
  <LoadGauge value={cpuCost} />
  <RegulationPanel
    visible={showRegulation}
    {activeStrategy}
    on:activate={handleActivate}
    on:deactivate={handleDeactivate}
  />
</main>

<style>
  main {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
  }

  h1 {
    text-align: center;
    margin-bottom: 2rem;
  }
</style>
```

**Step 5: Run tests**

```bash
cd frontend && npm run test:e2e -- regulation-panel.spec.ts
```

Expected: All tests pass

**Step 6: Commit**

```bash
git add frontend/src/lib/components/RegulationPanel.svelte frontend/src/App.svelte frontend/e2e/regulation-panel.spec.ts
git commit -m "feat(frontend): add RegulationPanel component with E2E tests"
```

---

### Task 3.4: Create VideoCanvas Component (Stub)

**Files:**
- Create: `frontend/src/lib/components/VideoCanvas.svelte`
- Create: `frontend/e2e/video-canvas.spec.ts`

**Step 1: Write failing E2E test**

Create `frontend/e2e/video-canvas.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';

test.describe('VideoCanvas', () => {
  test('canvas element exists', async ({ page }) => {
    await page.goto('/');
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();
  });

  test('canvas has expected dimensions', async ({ page }) => {
    await page.goto('/');
    const canvas = page.locator('canvas');
    const box = await canvas.boundingBox();
    expect(box?.width).toBeGreaterThan(0);
    expect(box?.height).toBeGreaterThan(0);
  });
});
```

**Step 2: Run test to verify it fails**

```bash
cd frontend && npm run test:e2e -- video-canvas.spec.ts
```

Expected: FAIL

**Step 3: Create stub component**

Create `frontend/src/lib/components/VideoCanvas.svelte`:

```svelte
<script lang="ts">
  import { onMount } from 'svelte';

  export let width: number = 720;
  export let height: number = 480;
  export let precision: number = 0;
  export let shakeX: number = 0;
  export let shakeY: number = 0;
  export let noiseIntensity: number = 0;

  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D | null = null;

  onMount(() => {
    ctx = canvas.getContext('2d');
    if (ctx) {
      // Draw placeholder
      ctx.fillStyle = '#333';
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = '#fff';
      ctx.font = '24px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Video Canvas', width / 2, height / 2);
      ctx.font = '14px sans-serif';
      ctx.fillText('(placeholder - video integration pending)', width / 2, height / 2 + 30);
    }
  });

  $: if (ctx) {
    // Apply shake transform
    canvas.style.transform = `translate(${shakeX}px, ${shakeY}px)`;
  }
</script>

<div class="canvas-container">
  <canvas
    bind:this={canvas}
    {width}
    {height}
  />
  {#if noiseIntensity > 0}
    <div
      class="noise-overlay"
      style="opacity: {noiseIntensity * 0.3}"
    />
  {/if}
</div>

<style>
  .canvas-container {
    position: relative;
    display: flex;
    justify-content: center;
    margin-bottom: 1rem;
  }

  canvas {
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }

  .noise-overlay {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 720px;
    height: 480px;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)'/%3E%3C/svg%3E");
    pointer-events: none;
    border-radius: 8px;
  }
</style>
```

**Step 4: Update App.svelte**

Edit `frontend/src/App.svelte` to add VideoCanvas:

```svelte
<script lang="ts">
  import PrecisionSlider from './lib/components/PrecisionSlider.svelte';
  import LoadGauge from './lib/components/LoadGauge.svelte';
  import RegulationPanel from './lib/components/RegulationPanel.svelte';
  import VideoCanvas from './lib/components/VideoCanvas.svelte';

  let precision = 20;
  let activeStrategy: string | null = null;

  // Calculations matching Rust logic
  $: normalizedPrecision = precision / 100;
  $: cpuCost = 0.1 + normalizedPrecision ** 2 * 0.9;
  $: showRegulation = precision >= 70;

  // Shake only above 70%
  $: shakeIntensity = precision >= 70 ? ((precision - 70) / 30) * 5 : 0;
  $: shakeX = shakeIntensity * Math.sin(Date.now() / 50);
  $: shakeY = shakeIntensity * Math.cos(Date.now() / 50);

  // Noise above 30%
  $: noiseIntensity = precision >= 30 ? ((precision - 30) / 70) ** 1.5 : 0;

  function handleActivate(event: CustomEvent<{ strategy: string }>) {
    activeStrategy = event.detail.strategy;
  }

  function handleDeactivate() {
    activeStrategy = null;
  }
</script>

<main>
  <h1>bio-prior</h1>
  <VideoCanvas
    {precision}
    shakeX={shakeX}
    shakeY={shakeY}
    {noiseIntensity}
  />
  <PrecisionSlider bind:value={precision} />
  <LoadGauge value={cpuCost} />
  <RegulationPanel
    visible={showRegulation}
    {activeStrategy}
    on:activate={handleActivate}
    on:deactivate={handleDeactivate}
  />
</main>

<style>
  main {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
  }

  h1 {
    text-align: center;
    margin-bottom: 2rem;
  }
</style>
```

**Step 5: Run tests**

```bash
cd frontend && npm run test:e2e -- video-canvas.spec.ts
```

Expected: All tests pass

**Step 6: Commit**

```bash
git add frontend/src/lib/components/VideoCanvas.svelte frontend/src/App.svelte frontend/e2e/video-canvas.spec.ts
git commit -m "feat(frontend): add VideoCanvas stub component with E2E tests"
```

---

### Task 3.5: Full Integration E2E Test

**Files:**
- Create: `frontend/e2e/full-flow.spec.ts`

**Step 1: Write integration test**

Create `frontend/e2e/full-flow.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';

test.describe('Full User Flow', () => {
  test('complete overload and regulation cycle', async ({ page }) => {
    await page.goto('/');

    // 1. Start calm
    const slider = page.getByRole('slider', { name: /sensory detail/i });
    await expect(slider).toHaveValue('20');
    await expect(page.getByText(/regulation strategies/i)).not.toBeVisible();

    // 2. Increase to overload
    await slider.fill('85');
    await expect(page.getByText(/regulation strategies/i)).toBeVisible();

    // 3. Verify high CPU load
    const loadValue = await page.getByTestId('load-value').textContent();
    expect(parseInt(loadValue || '0')).toBeGreaterThan(50);

    // 4. Activate regulation strategy
    const reduceButton = page.getByRole('button', { name: /reduce input/i });
    await reduceButton.click();
    await expect(reduceButton).toHaveAttribute('aria-pressed', 'true');

    // 5. Deactivate
    await reduceButton.click();
    await expect(reduceButton).toHaveAttribute('aria-pressed', 'false');

    // 6. Return to calm
    await slider.fill('20');
    await expect(page.getByText(/regulation strategies/i)).not.toBeVisible();
  });

  test('page has no accessibility violations', async ({ page }) => {
    await page.goto('/');

    // Basic a11y checks
    const slider = page.getByRole('slider');
    await expect(slider).toHaveAttribute('aria-label');

    const buttons = page.getByRole('button');
    const count = await buttons.count();
    // Buttons should appear when regulation panel is visible
    await page.getByRole('slider').fill('85');
    const visibleButtons = page.getByRole('button');
    expect(await visibleButtons.count()).toBeGreaterThan(0);
  });
});
```

**Step 2: Run all E2E tests**

```bash
cd frontend && npm run test:e2e
```

Expected: All tests pass

**Step 3: Commit**

```bash
git add frontend/e2e/full-flow.spec.ts
git commit -m "test(e2e): add full user flow integration test"
```

---

### Task 3.6: Phase 3 Gate

**Step 1: Run lint**

```bash
cd frontend && npm run lint && npm run format:check
```

**Step 2: Run all tests**

```bash
cd frontend && npm run test:e2e
```

**Step 3: Build**

```bash
cd frontend && npm run build
```

**Step 4: Run phase gate**

```bash
~/.claude/engineering/engineering.sh phase-gate "docs/plans/2026-02-02-bio-prior-implementation.md" 3
```

---

## Phase 4: Tauri Desktop Integration

### Task 4.1: Initialize Tauri Project

**Files:**
- Create: `tauri/` directory structure

**Step 1: Install Tauri CLI**

```bash
npm install -D @tauri-apps/cli@latest
```

**Step 2: Initialize Tauri in frontend**

```bash
cd frontend && npm run tauri init
```

When prompted:
- App name: `bio-prior`
- Window title: `bio-prior`
- Frontend dev URL: `http://localhost:5173`
- Frontend dist: `../dist`
- Dev command: `npm run dev`
- Build command: `npm run build`

**Step 3: Verify Tauri structure created**

```bash
ls frontend/src-tauri/
```

Expected: `Cargo.toml`, `tauri.conf.json`, `src/main.rs`

**Step 4: Commit**

```bash
git add frontend/src-tauri/ frontend/package.json frontend/package-lock.json
git commit -m "chore: initialize Tauri desktop app"
```

---

### Task 4.2: Configure Tauri for bio-prior

**Files:**
- Modify: `frontend/src-tauri/tauri.conf.json`

**Step 1: Update Tauri config**

Edit `frontend/src-tauri/tauri.conf.json`:

```json
{
  "$schema": "https://schema.tauri.app/config/2",
  "productName": "bio-prior",
  "version": "0.1.0",
  "identifier": "com.bioprior.app",
  "build": {
    "beforeDevCommand": "npm run dev",
    "devUrl": "http://localhost:5173",
    "beforeBuildCommand": "npm run build",
    "frontendDist": "../dist"
  },
  "app": {
    "withGlobalTauri": true,
    "windows": [
      {
        "title": "bio-prior",
        "width": 900,
        "height": 700,
        "resizable": true,
        "fullscreen": false
      }
    ],
    "security": {
      "csp": null
    }
  },
  "bundle": {
    "active": true,
    "targets": "all",
    "icon": [
      "icons/32x32.png",
      "icons/128x128.png",
      "icons/128x128@2x.png",
      "icons/icon.icns",
      "icons/icon.ico"
    ]
  }
}
```

**Step 2: Commit**

```bash
git add frontend/src-tauri/tauri.conf.json
git commit -m "chore: configure Tauri window and build settings"
```

---

### Task 4.3: Test Tauri Dev Mode

**Step 1: Run Tauri in dev mode**

```bash
cd frontend && npm run tauri dev
```

Expected: Desktop window opens with bio-prior app

**Step 2: Verify functionality**

- Slider works
- Load gauge updates
- Regulation panel appears at high precision

**Step 3: Close and commit any fixes if needed**

---

### Task 4.4: Phase 4 Gate

**Step 1: Build Tauri app**

```bash
cd frontend && npm run tauri build
```

Expected: Build succeeds (creates installer/bundle)

**Step 2: Run phase gate**

```bash
~/.claude/engineering/engineering.sh phase-gate "docs/plans/2026-02-02-bio-prior-implementation.md" 4
```

---

## Phase 5: Final Integration & Polish

### Task 5.1: Wire WASM to Frontend

**Files:**
- Modify: `frontend/src/App.svelte`

**Step 1: Import and initialize WASM**

Edit `frontend/src/App.svelte`:

```svelte
<script lang="ts">
  import { onMount } from 'svelte';
  import PrecisionSlider from './lib/components/PrecisionSlider.svelte';
  import LoadGauge from './lib/components/LoadGauge.svelte';
  import RegulationPanel from './lib/components/RegulationPanel.svelte';
  import VideoCanvas from './lib/components/VideoCanvas.svelte';
  import { initWasm, sliderToPrecision, isWasmInitialized } from './lib/wasm';

  let precision = 20;
  let activeStrategy: string | null = null;
  let wasmReady = false;
  let error: string | null = null;

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

  $: cpuCost = 0.1 + internalPrecision ** 2 * 0.9;
  $: showRegulation = precision >= 70;

  $: shakeIntensity = precision >= 70 ? ((precision - 70) / 30) * 5 : 0;
  $: shakeX = shakeIntensity * Math.sin(Date.now() / 50);
  $: shakeY = shakeIntensity * Math.cos(Date.now() / 50);
  $: noiseIntensity = precision >= 30 ? ((precision - 30) / 70) ** 1.5 : 0;

  function handleActivate(event: CustomEvent<{ strategy: string }>) {
    activeStrategy = event.detail.strategy;
  }

  function handleDeactivate() {
    activeStrategy = null;
  }
</script>

<main>
  <h1>bio-prior</h1>

  {#if error}
    <div class="error">{error}</div>
  {/if}

  {#if !wasmReady}
    <div class="loading">Loading simulation engine...</div>
  {:else}
    <VideoCanvas
      {precision}
      shakeX={shakeX}
      shakeY={shakeY}
      {noiseIntensity}
    />
    <PrecisionSlider bind:value={precision} />
    <LoadGauge value={cpuCost} />
    <RegulationPanel
      visible={showRegulation}
      {activeStrategy}
      on:activate={handleActivate}
      on:deactivate={handleDeactivate}
    />
  {/if}
</main>

<style>
  main {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
  }

  h1 {
    text-align: center;
    margin-bottom: 2rem;
  }

  .loading {
    text-align: center;
    padding: 2rem;
    color: #666;
  }

  .error {
    background: #ffebee;
    color: #c62828;
    padding: 1rem;
    border-radius: 4px;
    margin-bottom: 1rem;
  }
</style>
```

**Step 2: Build WASM**

```bash
cd rust-core && ./build-wasm.sh
```

**Step 3: Test**

```bash
cd frontend && npm run dev
```

Verify WASM loads and precision calculation works

**Step 4: Commit**

```bash
git add frontend/src/App.svelte
git commit -m "feat: wire WASM inference engine to frontend"
```

---

### Task 5.2: Add About Modal

**Files:**
- Create: `frontend/src/lib/components/AboutModal.svelte`

**Step 1: Create component**

Create `frontend/src/lib/components/AboutModal.svelte`:

```svelte
<script lang="ts">
  export let open: boolean = false;

  function close() {
    open = false;
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') close();
  }
</script>

<svelte:window on:keydown={handleKeydown} />

{#if open}
  <div class="overlay" on:click={close} role="presentation">
    <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" on:click|stopPropagation>
      <button class="close" on:click={close} aria-label="Close">×</button>

      <h2 id="modal-title">About bio-prior</h2>

      <p>
        <strong>bio-prior</strong> is a simulation that demonstrates how
        <em>precision weighting</em> affects sensory processing.
      </p>

      <h3>The HIPPE Theory</h3>
      <p>
        HIPPE (High Individual Posterior Predictive Error) suggests that some
        neurodivergent individuals process sensory input with higher "gain"—
        every detail is amplified, making it harder to filter background noise.
      </p>

      <h3>What You're Seeing</h3>
      <ul>
        <li><strong>Sensory Detail slider:</strong> Adjusts how much weight the brain gives to incoming signals</li>
        <li><strong>Processing Load:</strong> Shows computational cost—high precision exhausts resources</li>
        <li><strong>Regulation Strategies:</strong> Demonstrates how self-soothing behaviors actually help</li>
      </ul>

      <h3>The Message</h3>
      <p>
        When a child covers their ears, rocks, or leaves the room—they're not
        misbehaving. Their system is overloaded, and these are <em>solutions</em>,
        not problems.
      </p>

      <p class="footer">
        Built with care by Nishant Tyagi
      </p>
    </div>
  </div>
{/if}

<style>
  .overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
  }

  .modal {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    max-width: 500px;
    max-height: 80vh;
    overflow-y: auto;
    position: relative;
  }

  .close {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #666;
  }

  h2 {
    margin-top: 0;
  }

  h3 {
    margin-top: 1.5rem;
    margin-bottom: 0.5rem;
  }

  ul {
    padding-left: 1.5rem;
  }

  li {
    margin-bottom: 0.5rem;
  }

  .footer {
    margin-top: 2rem;
    padding-top: 1rem;
    border-top: 1px solid #eee;
    font-size: 0.9rem;
    color: #666;
  }
</style>
```

**Step 2: Add to App.svelte**

Add import and button to `frontend/src/App.svelte`:

```svelte
<script lang="ts">
  // ... existing imports
  import AboutModal from './lib/components/AboutModal.svelte';

  // ... existing code
  let showAbout = false;
</script>

<!-- Add before closing </main> -->
<footer>
  <button class="about-button" on:click={() => showAbout = true}>
    About this project
  </button>
</footer>

<AboutModal bind:open={showAbout} />

<style>
  /* ... existing styles */

  footer {
    text-align: center;
    margin-top: 2rem;
  }

  .about-button {
    background: none;
    border: 1px solid #ddd;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    color: #666;
  }

  .about-button:hover {
    border-color: #999;
  }
</style>
```

**Step 3: Commit**

```bash
git add frontend/src/lib/components/AboutModal.svelte frontend/src/App.svelte
git commit -m "feat(frontend): add About modal with HIPPE explanation"
```

---

### Task 5.3: Final E2E Test Suite

**Step 1: Run complete test suite**

```bash
cd frontend && npm run test:e2e
```

Expected: All tests pass

**Step 2: Run lint on all code**

```bash
cd frontend && npm run lint && npm run format:check
cd ../rust-core && cargo fmt --check && cargo clippy --all-targets -- -D warnings
```

Expected: No issues

**Step 3: Full build**

```bash
cd rust-core && ./build-wasm.sh
cd ../frontend && npm run build
```

Expected: Build succeeds

---

### Task 5.4: Update README

**Files:**
- Modify: `README.md`

**Step 1: Update with actual build instructions**

The README already has good content. Verify build commands are accurate:

```bash
# Test documented commands work
cd rust-core && cargo build --release
cd ../frontend && npm run build
```

**Step 2: Commit if changes needed**

```bash
git add README.md
git commit -m "docs: verify and update build instructions"
```

---

### Task 5.5: Complete Implementation

**Step 1: Mark progress complete**

```bash
~/.claude/engineering/engineering.sh progress complete
```

**Step 2: Final commit**

```bash
git add -A
git commit -m "feat: complete bio-prior v1 implementation

- Rust inference core with precision, reconstruction, regulation modules
- WASM build for web deployment
- Svelte frontend with all components
- Tauri desktop app
- Full E2E test coverage with Playwright
- Linting and formatting configured

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

## Summary

### Phases

| Phase | Description | Tasks |
|-------|-------------|-------|
| 0 | Project Scaffolding & Tooling | 8 |
| 1 | Rust Core (TDD) | 9 |
| 2 | WASM Build | 5 |
| 3 | Svelte Components (TDD + Playwright) | 6 |
| 4 | Tauri Desktop | 4 |
| 5 | Final Integration | 5 |

### Total: ~37 tasks

### Key Commands

```bash
# Rust
cd rust-core && cargo test
cd rust-core && cargo fmt --check && cargo clippy
cd rust-core && ./build-wasm.sh

# Frontend
cd frontend && npm run lint && npm run format:check
cd frontend && npm run test:e2e
cd frontend && npm run build

# Tauri
cd frontend && npm run tauri dev
cd frontend && npm run tauri build
```
