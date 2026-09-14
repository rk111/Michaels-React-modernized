import { test, expect } from '@playwright/test';

const sizes = [
  { name: 'mobile', width: 375, height: 2400 },
  { name: 'tablet', width: 768, height: 2400 },
  { name: 'desktop', width: 1440, height: 2600 },
];

for (const size of sizes) {
  test(`no horizontal overflow at ${size.name}`, async ({ page }) => {
    await page.setViewportSize({ width: size.width, height: size.height });
    await page.goto('/');
    const hasOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    expect(hasOverflow).toBeFalsy();
    await expect(page.getByText('Make more. Save more. Shop weekly deals')).toBeVisible();
  });
}

for (const width of [375, 768, 1440]) {
  test(`Prototype 10 content and frequency interaction at ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Oil paint set, 24 oil-based colors');
    await expect(page.getByRole('img')).toBeVisible();
    await expect(page.getByText('Order summary')).toHaveCount(0);
    await expect(page.getByText(/coverage map/i)).toHaveCount(0);
    for (const frequency of ['60', '90', '30']) {
      await page.getByLabel('Delivery frequency').selectOption(frequency);
      await expect(page.getByLabel('Delivery frequency')).toHaveValue(frequency);
    }
    const addButton = page.getByRole('button', { name: 'Add subscription to cart' });
    await expect(addButton).toHaveCSS('line-height', '24px');
    expect((await addButton.boundingBox()).height).toBeCloseTo(48, 0);
    const subscription = page.getByRole('radio', { name: 'Subscribe & Save' });
    await subscription.focus();
    await expect(page.locator('.purchase-card.selected')).toHaveCSS('outline-style', 'solid');
    await page.keyboard.press('ArrowUp');
    await expect(page.getByRole('radio', { name: 'One-time purchase' })).toBeChecked();
    await page.keyboard.press('ArrowDown');
    await expect(subscription).toBeChecked();
    if (width === 1440) {
      const artwork = await page.locator('.gallery img').boundingBox();
      expect(artwork.width).toBeCloseTo(585.14, 0);
      const buyBox = await page.locator('.buy-box').boundingBox();
      expect(buyBox.x).toBeCloseTo(816, 0);
      expect(buyBox.width).toBeCloseTo(576, 0);
    }
    if (width === 375) {
      const artwork = await page.locator('.gallery img').boundingBox();
      expect(artwork.width).toBeCloseTo(313.6, 0);
    }
    await page.screenshot({ path: `test-results/prototype-10-${width}.png`, fullPage: true });
  });
}
