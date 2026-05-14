const { test, expect } = require('@playwright/test');

    test.beforeEach(async ({ page })=> 
{

/*TS 1 - Open autotrader.co.uk and accepts cookies (It repeats in all tests so may as well do it before each test*/

    await page.goto('https://www.autotrader.co.uk/');
    const cookies = page.frameLocator('iframe[title="SP Consent Message"]');
    await cookies.getByRole('button', { name: 'Accept All' }).waitFor();
    await cookies.getByRole('button', { name: 'Accept All' }).click();
});

/*I ran into the issue of needing to put in a postcode/valid postcode, so thought to keep both in as negative tests*/
    test('User cannot search with empty postcode', async ({ page })=> 

{
    await page.getByTestId('make').selectOption('BMW');
    await page.getByTestId('model').selectOption('1 Series');
    await page.getByTestId('connected-form-search-button').click();

    await expect(page.getByText('Enter a valid UK postcode')).toBeVisible();
});

/*One more for an invalid postcode*/
    test('User cannot search with invalid postcode', async ({ page })=>
{
    await page.getByTestId('make').selectOption('BMW');
    await page.getByTestId('model').selectOption('1 Series');
    await page.locator('#postcode').fill('S999XXA');
    await page.getByTestId('connected-form-search-button').click();

    await expect(page.getByText(/valid postcode/i)).toBeVisible({ timeout: 5000 });

});

/*This code below is for searching for a 1 series and I put it here so I can reuse it instead of repeating code*/
                /*CHANGE CAR/DETAILS IF NEEDED*/

async function searchBMW(page) {
  await page.getByTestId('make').selectOption('BMW');
  await page.getByTestId('model').selectOption('1 Series');
  await page.locator('#postcode').fill('M160LX');
  await page.getByTestId('connected-form-search-button').click();
}


/*This code below is for filtering for an M140i and I put it here so I can reuse it instead of repeating code*/
                /*CHANGE CAR/DETAILS IF NEEDED*/

async function filterM140(page) {
  await page.getByTestId('search-filter-toggle').click();
  await page.getByTestId('make_and_model-facet-group').click();
  await page.locator('#aggregated_trim').selectOption('M140i');
  await page.getByTestId('search-apply-button').click();
}

/*TS 2 - Search for a rammi BMW 1 series*/ 
    test('Autotrader Basic Searching', async ({page})=>
{
    await searchBMW(page);
});

/*TS 3 - Wicked car but we want an M140 cuz*/
    test('Filtering on Autotrader', async ({page})=>
{
    await searchBMW(page);
    await filterM140(page);

    await expect(page).toHaveURL(/M140i/i);
});

/*TS 4 - Now that's bloody wicked, but top it off with a rammi manual, low miles and just a rammi spec*/
    test('Filtering for the perfect car', async ({page})=>
{
    await searchBMW(page);
    await filterM140(page);

    await page.getByTestId('search-filter-toggle-gearbox').click();
    await page.getByTestId('transmission-automatic-container').click();
    await page.getByTestId('colour-facet-group').click();
    await page.getByTestId('colour-black-container').click();
    
    const mileageFilter = page.getByTestId('mileage-facet-group')
    await mileageFilter.scrollIntoViewIfNeeded();
    await mileageFilter.click();
    await page.locator('#max_mileage').selectOption('100000');
    await page.getByTestId('search-apply-button').click();

/*TS 5 - Now this M140i looks bloody wicked!*/

    await page.locator('[data-testid^="advertCard"]').first().click();
    await page.getByRole('button', { name: 'Next image' }).click();
    await expect(page).toHaveURL(/advert/);

/*TS 6 - Lets look at what it's pushing (oi oi oi) */

    const spec = page.getByTestId('view-all-spec-and-features-signpost');
    await spec.scrollIntoViewIfNeeded();
    await spec.click();
    
    await page.getByRole('button', { name: 'Performance' }).nth(1).click();
    
    const enginePower = page.getByText('Engine Power');
    await enginePower.scrollIntoViewIfNeeded();
    await expect(enginePower).toBeVisible();
});