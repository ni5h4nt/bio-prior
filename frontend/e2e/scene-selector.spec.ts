import { test, expect } from '@playwright/test';

test.describe('SceneSelector', () => {
  test('dropdown renders with Abstract as default', async ({ page }) => {
    await page.goto('/');
    const selector = page.getByRole('combobox', { name: /scene/i });
    await expect(selector).toBeVisible();
    await expect(selector).toHaveValue('abstract');
  });

  test('shows all scene options', async ({ page }) => {
    await page.goto('/');

    // Native select options are not visible in DOM sense, check they exist
    await expect(page.getByRole('option', { name: /abstract/i })).toHaveCount(1);
    await expect(page.getByRole('option', { name: /classroom/i })).toHaveCount(1);
    await expect(page.getByRole('option', { name: /grocery/i })).toHaveCount(1);
    await expect(page.getByRole('option', { name: /playground/i })).toHaveCount(1);
  });

  test('switching scene dispatches change event', async ({ page }) => {
    await page.goto('/');
    const selector = page.getByRole('combobox', { name: /scene/i });
    await selector.selectOption('classroom');
    await expect(selector).toHaveValue('classroom');
  });
});
