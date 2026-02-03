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
