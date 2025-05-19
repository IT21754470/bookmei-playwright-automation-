const { test, expect } = require('@playwright/test');
const { time } = require('console');

test.use({
  headless: false,
  slowMo: 500,
  viewport: { width: 1280, height: 800 }
});

test('Check BookMei New Schedule dialog functionality', async ({ page }) => {
  // Increase timeout
  test.setTimeout(60000);
  
  test.info().annotations.push({ type: 'issue', description: 'BookMei Schedule Modal Test' });
  
  console.log('Navigating to BookMei website...');
  
  // Login process
  await page.goto('http://localhost:4000/biz');
  await page.waitForLoadState('networkidle');
  
  // Check if we need to login
  if (await page.isVisible('input[name="phone"]')) {
    console.log('Login page detected, performing login...');
    await page.fill('input[name="phone"]', '701231234');
    await page.fill('input[name="password"]', 'Qazxsw@1');
    await page.click('button:has-text("Sign In")');
    await page.waitForTimeout(3000);
  }
  
  // Navigate to Team page
  console.log('Navigating to customers page...');
  if (!page.url().includes('/customers')) {
    await page.click('text=customers');
    await page.waitForLoadState('networkidle');
  }
  
  // Take a screenshot to see what actually loaded
  await page.screenshot({ path: './test-results/customers-page.png' });

   console.log('\n=== Checking team Elements ===');

   const title = await page.isVisible('text=Customers');
    console.log('title visible:', title);
    expect(title, 'title should be visible').toBeTruthy();

    const secondtitle = await page.isVisible('text=Manage your customers here.');
    console.log('second title visible:', secondtitle);
    expect(secondtitle, 'second title should be visible').toBeTruthy();

const searchinput = await page.isVisible('input[placeholder*="Search"]');
  console.log('Search input visible:', searchinput);
  expect(searchinput, 'Search input should be visible').toBeTruthy();
  await page.fill('input[placeholder*="Search"]', 'aadil.titan@gmail.com');
  await page.waitForTimeout(2000);

  // FIXED: Using a valid selector instead of the invalid 'identifier="John Malli"'
const searchresult = await page.isVisible('div:has-text("John Malli"):has-text("aadil.titan@gmail.com")');
  console.log('Search result visible:', searchresult);
  expect(searchresult, 'Search result should be visible').toBeTruthy();

 const exactSelector = '#root > div.w-full.h-full > div.w-full.flex.items-center.justify-center.h-full.bg-white > div > div.w-full.grid.md\:grid-cols-\[80px_1fr\] > div > div > div.w-full.overflow-x-auto > div > div > table';
    
    // Check if the calendar form is visible using the exact selector
    const customerForm = await page.isVisible(exactSelector);
    console.log('Calendar form visible (using exact selector):',  customerForm );
    expect( customerForm , 'Calendar form should be visible').toBeTruthy();
    
    if ( customerForm ) {
      // Use the container (exact selector) as the root for our searches
      const container = page.locator(exactSelector);


    }

});
