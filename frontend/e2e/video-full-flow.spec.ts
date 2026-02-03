import { test, expect } from '@playwright/test';

test.describe('Video Mode Full Flow', () => {
  test('complete user journey with video mode', async ({ page }) => {
    await page.goto('/');

    // Start in abstract mode
    const selector = page.getByRole('combobox', { name: /scene/i });
    await expect(selector).toHaveValue('abstract');

    // Verify canvas elements in abstract mode
    await expect(page.locator('canvas')).toHaveCount(2);

    // Switch to classroom
    await selector.selectOption('classroom');
    await expect(page.locator('video')).toHaveCount(2);

    // Enable audio
    const audioButton = page.getByRole('button', { name: /enable audio/i });
    await audioButton.click();
    await expect(page.getByRole('button', { name: /audio on|mute/i })).toBeVisible();

    // Increase precision to trigger regulation panel
    const slider = page.getByRole('slider', { name: /sensory detail/i });
    await slider.fill('75');

    // Regulation panel should appear
    await expect(page.getByText(/system overwhelmed/i)).toBeVisible();

    // Activate a regulation strategy
    const reduceButton = page.getByRole('button', { name: /reduce input/i });
    await reduceButton.click();

    // Switch to grocery scene
    await selector.selectOption('grocery');
    await expect(page.locator('video')).toHaveCount(2);

    // Switch back to abstract
    await selector.selectOption('abstract');
    await expect(page.locator('video')).toHaveCount(0);
    await expect(page.locator('canvas')).toHaveCount(2);
  });

  test('mobile responsive layout', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    const selector = page.getByRole('combobox', { name: /scene/i });
    await selector.selectOption('classroom');

    // Videos should stack vertically on mobile
    const splitView = page.locator('.split-view');
    const flexDirection = await splitView.evaluate((el) =>
      window.getComputedStyle(el).flexDirection
    );
    expect(flexDirection).toBe('column');
  });
});
