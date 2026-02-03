import { test, expect } from '@playwright/test';

test.describe('VideoSplitView', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    const selector = page.getByRole('combobox', { name: /scene/i });
    await selector.selectOption('classroom');
  });

  test('renders two video elements', async ({ page }) => {
    const videos = page.locator('video');
    await expect(videos).toHaveCount(2);
  });

  test('videos have correct labels', async ({ page }) => {
    await expect(page.getByText('Neurotypical View')).toBeVisible();
    await expect(page.getByText('Current Experience')).toBeVisible();
  });

  test('applies CSS filters at high precision', async ({ page }) => {
    const slider = page.getByRole('slider', { name: /sensory detail/i });
    await slider.fill('85');

    const effectVideo = page.locator('[data-testid="effect-video"]');
    const filter = await effectVideo.evaluate((el) =>
      window.getComputedStyle(el).filter
    );

    expect(filter).toContain('contrast');
    expect(filter).toContain('saturate');
  });

  test('applies shake transform above 70%', async ({ page }) => {
    const slider = page.getByRole('slider', { name: /sensory detail/i });
    await slider.fill('75');

    // Wait for animation frame
    await page.waitForTimeout(100);

    const container = page.locator('[data-testid="effect-container"]');
    const transform = await container.evaluate((el) =>
      window.getComputedStyle(el).transform
    );

    expect(transform).not.toBe('none');
  });
});
