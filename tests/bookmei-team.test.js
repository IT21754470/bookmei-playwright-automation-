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
  console.log('Navigating to team page...');
  if (!page.url().includes('/team')) {
    await page.click('text=Team');
    await page.waitForLoadState('networkidle');
  }
  
  // Take a screenshot to see what actually loaded
  await page.screenshot({ path: './test-results/team-page.png' });

   console.log('\n=== Checking team Elements ===');

  const secondtitle = await page.isVisible('text=Manage your team members effortlessly.');
  console.log('second title visible:', secondtitle);
  expect(secondtitle, 'second title should be visible').toBeTruthy();

 

 const searchinput = await page.isVisible('input[placeholder*="Search"]');
  console.log('Search input visible:', searchinput);
  expect(searchinput, 'Search input should be visible').toBeTruthy();
  await page.fill('input[placeholder*="Search"]', 'johndoe@email.com');
  await page.waitForTimeout(2000);

  // FIXED: Using a valid selector instead of the invalid 'identifier="John Malli"'
const searchresult = await page.isVisible('div:has-text("John Malli"):has-text("johndoe@email.com")');
  console.log('Search result visible:', searchresult);
  expect(searchresult, 'Search result should be visible').toBeTruthy();

    const profilepic = await page.isVisible('img[alt="John Malli"]');
  console.log('Profile picture visible:', profilepic);
  expect(profilepic, 'Profile picture should be visible').toBeTruthy();

  // Take a screenshot to see what actually loaded
  await page.screenshot({ path: './test-results/team-search-result.png' });

 

  // Find and click the calendar/schedule button for a team member
  console.log('Looking for calendar button...');
  const calendarButton = await page.isVisible('button:has(img[src*="calendar"])');
  console.log('Calendar button visible:', calendarButton);
  
  if (calendarButton) {
    // Click the calendar button to open the schedule dialog
    await page.click('button:has(img[src*="calendar"])');
    console.log('Clicked calendar button');
    await page.waitForTimeout(2000);
    
    // Take a screenshot of the opened dialog
    await page.screenshot({ path: './test-results/schedule-dialog.png' });
    
    // Use the exact selector you provided to locate the calendar form
    const exactSelector = '#root > div.w-full.h-full > div.w-full.flex.items-center.justify-center.h-full.bg-white > div > div.w-full.grid.md\\:grid-cols-\\[80px_1fr\\] > div > div.w-full.h-screen.flex.flex-row.items-center.overflow-hidden.justify-center.p-4.md\\:p-0.fixed.top-0.left-0.backdrop-blur-sm.bg-black\\/20.z-\\[7000\\] > div';
    
    // Check if the calendar form is visible using the exact selector
    const calendarForm = await page.isVisible(exactSelector);
    console.log('Calendar form visible (using exact selector):', calendarForm);
    expect(calendarForm, 'Calendar form should be visible').toBeTruthy();
    
    if (calendarForm) {
      // Use the container (exact selector) as the root for our searches
      const container = page.locator(exactSelector);

      const addschedulebutton = await container.locator('button:has-text("Add Schedule")').isVisible();
      console.log('Add Schedule button visible:', addschedulebutton);
      expect(addschedulebutton, 'Add Schedule button should be visible').toBeTruthy();
      await container.locator('button:has-text("Add Schedule")').click();
      console.log('Clicked Add Schedule button');
      await page.waitForTimeout(2000);
      
      // Check dialog title
      const dialogTitle = await container.locator('text=New Schedule').isVisible();
      console.log('New Schedule title visible:', dialogTitle);
      expect(dialogTitle, 'Dialog title should be visible').toBeTruthy();
      
      // Check workflow text
      const workflowText = await container.locator('text=Schedule your workflow').isVisible();
      console.log('Workflow text visible:', workflowText);
      expect(workflowText, 'Workflow text should be visible').toBeTruthy();
      
      // Check working days selection
      const workingDaysText = await container.locator('text=Select your working days').isVisible();
      console.log('Working days text visible:', workingDaysText);
      expect(workingDaysText, 'Working days text should be visible').toBeTruthy();
      
      // Check day buttons
      const dayButtons = [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday'
      ];
      
      console.log('Checking day buttons:');
      for (const day of dayButtons) {
        const isVisible = await container.locator(`button:has-text("${day}")`).isVisible();
        console.log(`${day} button visible:`, isVisible);
        expect(isVisible, `${day} button should be visible`).toBeTruthy();
      }
      
      // Check date range text
      const dateRangeText = await container.locator('text=Select date range').isVisible();
      console.log('Date range text visible:', dateRangeText);
      expect(dateRangeText, 'Date range text should be visible').toBeTruthy();
      
      // Check calendar title
      const calendarTitle = await container.locator('text=May 2025').isVisible();
      console.log('Calendar title visible:', calendarTitle);
      expect(calendarTitle, 'Calendar title should be visible').toBeTruthy();
      
      // Check Clear All button
      const clearAllButton = await container.locator('button:has-text("Clear All")').isVisible();
      console.log('Clear All button visible:', clearAllButton);
      expect(clearAllButton, 'Clear All button should be visible').toBeTruthy();
      
      // Test Interactions
      console.log('\n=== Testing Calendar Interactions ===');
      
      // Select Monday
      await container.locator('button:has-text("Monday")').click();
      console.log('Clicked Monday button');
      await page.waitForTimeout(1000);
      
      // Select a date (May 15, 2025)
      await container.locator('text="19"').click();
      console.log('Selected May 19, 2025');
      await page.waitForTimeout(1000);
      
      // Take a screenshot after selections
      await page.screenshot({ path: './test-results/schedule-selections.png' });
      
      // Clear selections
      if (clearAllButton) {
        await container.locator('button:has-text("Clear All")').click();
        console.log('Clicked Clear All button');
        await page.waitForTimeout(1000);
        await page.screenshot({ path: './test-results/schedule-cleared.png' });
      }
      
      // Close the dialog using the close button (×)
      const closeX = await container.locator('button:has-text("×")').isVisible();
      if (closeX) {
        await container.locator('button:has-text("×")').click();
        console.log('Clicked × to close dialog');
      } else {
        // Try clicking the button with aria-label="Close"
        const closeButton = await container.locator('button[aria-label="Close"]').isVisible();
        if (closeButton) {
          await container.locator('button[aria-label="Close"]').click();
          console.log('Clicked close button');
        } else {
          // Last resort: Click outside the dialog
          await page.mouse.click(10, 10);
          console.log('Clicked outside to close dialog');
        }
      }
      
      // Wait for dialog to close
      await page.waitForTimeout(2000);
      await page.screenshot({ path: './test-results/after-dialog-closed.png' });
      
      // Verify dialog closed
      const dialogClosed = !(await page.isVisible(exactSelector));
      console.log('Dialog closed:', dialogClosed);
      expect(dialogClosed, 'Dialog should be closed').toBeTruthy();
    }
  } else {
    console.log('Calendar button not found, cannot open schedule dialog');
  }
 await page.waitForTimeout(90000); 
});