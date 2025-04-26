// @ts-check
import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('localhost:16079');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/DGT STATS/);
});

test('get radars link', async ({ page }) => {
  await page.goto('localhost:16079');

  // Click the get started link.
  await page.getByRole('link', { name: 'radars-stats' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page).toHaveTitle(/RADARS STATS/);
});


test('create and delete radars', async ({ page }) => {
  const testAutonomousCommunity = "__TEST_AC__"
  const testProvince = "__TEST_PROVINCE__"
  const testWay = "AC-99"
  const testKilometerPoint = "99"
  const testComplaint = "99"
  const testYear= "99"
  const testSpeedEstimation = "99"
  const testAverageSpeedFined = "999"
  await page.goto('localhost:16079');

  // Click the get started link.
  await page.getByRole('link', { name: 'radars-stats' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page).toHaveTitle(/Radars-stats/);

  await page.getByRole('textbox').nth(0).fill(testAutonomousCommunity);
  await page.getByRole('textbox').nth(1).fill(testProvince);
  await page.getByRole('textbox').nth(2).fill(testWay);
  await page.getByRole('textbox').nth(3).fill(testKilometerPoint);
  await page.getByRole('textbox').nth(4).fill(testComplaint);
  await page.getByRole('textbox').nth(5).fill(testYear);
  await page.getByRole('textbox').nth(6).fill(testSpeedEstimation);
  await page.getByRole('textbox').nth(7).fill(testAverageSpeedFined);

  await page.getByRole('button',{name: "Crear Radar"}).click();

  const contactRow = page.locator('tr',{hasText: testWay});

  await expect(contactRow).toContainText(testKilometerPoint);

  const deleteButton = contactRow.getByRole('button',{name: 'Eliminar'});
  await deleteButton.click();

  await expect(contactRow).toHaveCount(0);
});