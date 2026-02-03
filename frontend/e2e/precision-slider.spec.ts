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
