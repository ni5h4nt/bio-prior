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
