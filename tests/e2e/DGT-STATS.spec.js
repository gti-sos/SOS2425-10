// @ts-check
import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('localhost:16079');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/DGT STATS/);
});




test('get accidents link', async ({ page }) => {
  await page.goto('localhost:16079');

  // Click the get started link.
  await page.getByRole('link', { name: 'accidents-stats' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page).toHaveTitle(/ACCIDENTS STATS/);
});


test('get registrations link', async ({ page }) => {
  await page.goto('localhost:16079');

  // Click the get started link.
  await page.getByRole('link', { name: 'registrations-stats' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page).toHaveTitle(/REGISTRATIONS STATS/);
});

test('create and delete registrations', async ({ page }) => {
  const testYear = "2025";
  const testProvince = "Sevilla";
  const testTotal_general_national = "1125153";
  const testTotal_general_import = "12";
  const testTotal_general_auction = "12";
  const testTotal_general= "23";
  await page.goto('localhost:16079');

  // Click the get started link.
  await page.getByRole('link', { name: 'registrations-stats' }).click();

  await page.getByRole('textbox').nth(0).fill(testYear);
  await page.getByRole('textbox').nth(1).fill(testProvince);
  await page.getByRole('textbox').nth(2).fill(testTotal_general_national);
  await page.getByRole('textbox').nth(3).fill(testTotal_general_import);
  await page.getByRole('textbox').nth(4).fill(testTotal_general_auction);
  await page.getByRole('textbox').nth(5).fill(testTotal_general);

  await page.getByRole('button', {name: "Create Registration"}).click();
  const registrationRow = page.locator('tr', { hasText: testTotal_general_national });
  await expect(registrationRow).toContainText(testProvince);

  const deleteButton = registrationRow.getByRole('button', { name: 'Delete'});
  await deleteButton.click();

  await expect(registrationRow).toHaveCount(0);


});

test('create and delete accident', async ({ page }) => {
  const testaccidentId="65556987";
  const testyear="2021";
  const testmonth="1";
  const testprovince="TEST_PROVINCE";
  const testmunicipality_code="TEST_MUNICIPALITY";
  const testroad="213";
  const testkm="12";
  const testdirection_1f="45";
  const testaccidentType="1";
  const testtotal_victims="2";
  await page.goto('localhost:16079');

  // Click the get started link.
  await page.getByRole('link', { name: 'accidents-stats' }).click();

  await page.getByRole('textbox').nth(0).fill(testaccidentId);
  await page.getByRole('textbox').nth(1).fill(testyear);
  await page.getByRole('textbox').nth(2).fill(testmonth);
  await page.getByRole('textbox').nth(3).fill(testprovince);
  await page.getByRole('textbox').nth(4).fill(testmunicipality_code);
  await page.getByRole('textbox').nth(5).fill(testroad);
  await page.getByRole('textbox').nth(6).fill(testkm);
  await page.getByRole('textbox').nth(7).fill(testdirection_1f);
  await page.getByRole('textbox').nth(8).fill(testaccidentType);
  await page.getByRole('textbox').nth(9).fill(testtotal_victims);




  await page.getByRole('button', {name: "Create Accident"}).click();
  const accidentRow = page.locator('tr', { hasText: testaccidentId });
  await expect(accidentRow).toContainText(testprovince);

  const deleteButton = accidentRow.getByRole('button', { name: 'Delete'});
  await deleteButton.click();

  await expect(accidentRow).toHaveCount(0);


});