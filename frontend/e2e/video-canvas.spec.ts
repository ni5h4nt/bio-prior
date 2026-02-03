import { test, expect } from '@playwright/test';

test.describe('SplitViewCanvas', () => {
  test('both canvas elements exist', async ({ page }) => {
    await page.goto('/');
    const canvases = page.locator('canvas');
    await expect(canvases).toHaveCount(2);
    await expect(canvases.first()).toBeVisible();
    await expect(canvases.nth(1)).toBeVisible();
  });

  test('canvases have expected dimensions', async ({ page }) => {
    await page.goto('/');
    const canvases = page.locator('canvas');

    // Check neurotypical canvas (left)
    const leftBox = await canvases.first().boundingBox();
    expect(leftBox?.width).toBeGreaterThan(0);
    expect(leftBox?.height).toBeGreaterThan(0);

    // Check current view canvas (right)
    const rightBox = await canvases.nth(1).boundingBox();
    expect(rightBox?.width).toBeGreaterThan(0);
    expect(rightBox?.height).toBeGreaterThan(0);
  });

  test('shows neurotypical and current view labels', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Neurotypical View')).toBeVisible();
    await expect(page.getByText('Your Current View')).toBeVisible();
  });
});
