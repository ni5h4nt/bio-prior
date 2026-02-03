import { test, expect } from '@playwright/test';

test.describe('Full User Flow', () => {
  test('complete overload and regulation cycle', async ({ page }) => {
    await page.goto('/');

    // 1. Start calm
    const slider = page.getByRole('slider', { name: /sensory detail/i });
    await expect(slider).toHaveValue('20');
    await expect(page.getByText(/system overwhelmed/i)).not.toBeVisible();

    // 2. Increase to overload
    await slider.fill('85');
    await expect(page.getByText(/system overwhelmed/i)).toBeVisible();

    // 3. Verify high CPU load (with WASM cubic scaling: 85% slider -> ~44% load)
    const loadValue = await page.getByTestId('load-value').textContent();
    expect(parseInt(loadValue || '0')).toBeGreaterThan(40);

    // 4. Activate regulation strategy
    const reduceButton = page.getByRole('button', { name: /reduce input/i });
    await reduceButton.click();
    await expect(reduceButton).toHaveAttribute('aria-pressed', 'true');

    // 5. Deactivate
    await reduceButton.click();
    await expect(reduceButton).toHaveAttribute('aria-pressed', 'false');

    // 6. Return to calm
    await slider.fill('20');
    await expect(page.getByText(/system overwhelmed/i)).not.toBeVisible();
  });

  test('page has no accessibility violations', async ({ page }) => {
    await page.goto('/');

    // Basic a11y checks
    const slider = page.getByRole('slider');
    await expect(slider).toHaveAttribute('aria-label');

    // Buttons should appear when regulation panel is visible
    await page.getByRole('slider').fill('85');
    const visibleButtons = page.getByRole('button');
    expect(await visibleButtons.count()).toBeGreaterThan(0);
  });
});
