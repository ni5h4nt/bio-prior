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
    const selector = page.getByRole('combobox', { name: /scene/i });
    await selector.click();

    await expect(page.getByRole('option', { name: /abstract/i })).toBeVisible();
    await expect(page.getByRole('option', { name: /classroom/i })).toBeVisible();
    await expect(page.getByRole('option', { name: /grocery/i })).toBeVisible();
    await expect(page.getByRole('option', { name: /playground/i })).toBeVisible();
  });

  test('switching scene dispatches change event', async ({ page }) => {
    await page.goto('/');
    const selector = page.getByRole('combobox', { name: /scene/i });
    await selector.selectOption('classroom');
    await expect(selector).toHaveValue('classroom');
  });
});
