import { expect, test } from '@playwright/test';

test('index page shows SKIFFLE', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByRole('heading', { name: 'SKIFFLE' })).toBeVisible();
});
