import { test, expect } from '@playwright/test';

test.describe('AudioProcessor', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    const selector = page.getByRole('combobox', { name: /scene/i });
    await selector.selectOption('classroom');
  });

  test('shows audio enable button initially', async ({ page }) => {
    const audioButton = page.getByRole('button', { name: /enable audio/i });
    await expect(audioButton).toBeVisible();
  });

  test('audio button click changes state', async ({ page }) => {
    const audioButton = page.getByRole('button', { name: /enable audio/i });
    await audioButton.click();

    // Button should change to show "Audio On" or similar after click
    await expect(page.getByRole('button', { name: /audio on|mute/i })).toBeVisible();
  });

  test('mute button returns to enable state', async ({ page }) => {
    // Enable audio first
    const enableButton = page.getByRole('button', { name: /enable audio/i });
    await enableButton.click();

    // Now click to mute
    const muteButton = page.getByRole('button', { name: /audio on|mute/i });
    await muteButton.click();

    // Should show enable button again
    await expect(page.getByRole('button', { name: /enable audio/i })).toBeVisible();
  });
});
