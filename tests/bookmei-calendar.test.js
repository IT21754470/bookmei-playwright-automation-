// check-calendar.test.js
const { test, expect } = require('@playwright/test');

test('Check BookMei Calendar page functionality', async ({ page }) => {
  // Increase timeout
  test.setTimeout(60000);
  
  test.info().annotations.push({ type: 'issue', description: 'BookMei Calendar Test' });
  
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
  
  // Navigate to Calendar page
  console.log('Navigating to Calendar page...');
  if (!page.url().includes('/calendar')) {
    await page.click('text=Calendar');
    await page.waitForLoadState('networkidle');
  }
  
  // Take a screenshot to see what actually loaded
  await page.screenshot({ path: './test-results/calendar-page.png' });
  
  // Log page title for debugging
  const pageTitle = await page.title();
  console.log('Page title:', pageTitle);
  
  // Check for essential calendar elements
  console.log('\n=== Checking Calendar Elements ===');
  
  // *** FIXED SELECTORS BASED ON YOUR HTML ***
  const todayButton = await page.isVisible('.sx__today-button');
  console.log('Today button visible:', todayButton);
  
  const navigationControls = await page.isVisible('.sx__forward-backward-navigation');
  console.log('Navigation controls visible:', navigationControls);
  
  const monthDisplay = await page.isVisible('.sx__range-heading');
  console.log('Month display visible:', monthDisplay);
  

  
  // Create a combined check for calendar presence
  const calendarUIPresent = todayButton && navigationControls && monthDisplay;
  console.log('Calendar UI elements present:', calendarUIPresent);
  
  // FIXED: Make one combined assertion with the correct syntax
  expect(calendarUIPresent, 'Calendar UI elements should be present').toBeTruthy();
  
  // Check for "No Bookings Found" message
  const noBookingsMsg = await page.isVisible('text="No Bookings Found"');
  console.log('No Bookings Found message visible:', noBookingsMsg);
  
  // Test calendar interactions if UI elements are present
  if (calendarUIPresent) {
    console.log('\n=== Testing Calendar Interactions ===');
    
    // Test Today button
    if (todayButton) {
      await page.click('.sx__today-button');
      console.log('Clicked Today button');
      await page.waitForTimeout(1000);
    }
    
    // Test previous navigation
    if (await page.isVisible('.sx__chevron--previous')) {
      await page.click('.sx__chevron--previous');
      console.log('Clicked previous month button');
      await page.waitForTimeout(1000);
      
      // Take screenshot after navigation
      await page.screenshot({ path: './test-results/calendar-prev-month.png' });
      
      // Check if month display changed
      if (monthDisplay) {
        const monthText = await page.textContent('.sx__range-heading');
        console.log('Month display after previous click:', monthText);
      }
    }
    
    // Test next navigation
    if (await page.isVisible('.sx__chevron--next')) {
      await page.click('.sx__chevron--next');
      console.log('Clicked next month button');
      await page.waitForTimeout(1000);
      
      // Take screenshot after navigation
      await page.screenshot({ path: './test-results/calendar-next-month.png' });
      
      // Check if month display changed
      if (monthDisplay) {
        const monthText = await page.textContent('.sx__range-heading');
        console.log('Month display after next click:', monthText);
      }
    }
  }
  
  console.log('\nCalendar page test completed');
});