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
