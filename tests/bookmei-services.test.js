const { test, expect } = require('@playwright/test');

test.use({
  headless: false,
  slowMo: 500,
  viewport: { width: 1280, height: 800 }
});

test('Check BookMei services page functionality', async ({ page }) => {
  // Increase timeout
  test.setTimeout(60000);
  
  test.info().annotations.push({ type: 'issue', description: 'BookMei Services Test' });
  
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
  
  // Navigate to Services page
  console.log('Navigating to Services page...');
  if (!page.url().includes('/services')) {
    await page.click('text=Services');
    await page.waitForLoadState('networkidle');
  }
  
  // Take a screenshot to see what actually loaded
  await page.screenshot({ path: './test-results/services-page.png' });
  
  console.log('\n=== Checking services page Elements ===');
  
  const secondTitle = await page.isVisible('text=Manage your services effortlessly.');
  console.log('Services page title visible:', secondTitle);
  expect(secondTitle, 'Services page title should be visible').toBeTruthy();
  
  const checkItem = await page.isVisible('text=Hair Care Master');
  console.log('Services item visible:', checkItem);
  expect(checkItem, 'Services item should be visible').toBeTruthy();
  
  const checkItem2 = await page.isVisible('text=45 mins');
  console.log('Services item visible:', checkItem2);
  expect(checkItem2, 'Services item should be visible').toBeTruthy();
  
  const editButtonXPath = '//*[@id="Hair Care Master"]/div/div/div[2]/button[1]';
  
  // Take a screenshot before clicking
  await page.screenshot({ path: './test-results/before-edit-click.png' });
  
  console.log('Checking edit button using XPath...');
  const editButton = await page.isVisible(`xpath=${editButtonXPath}`);
  console.log('Edit button visible (using XPath):', editButton);
  
  if (editButton) {
    // ADDED: Click the edit button
    console.log('Clicking the edit button...');
    await page.click(`xpath=${editButtonXPath}`);
    console.log('Clicked edit button');
    
    // Wait for any modal or form to appear
    await page.waitForTimeout(2000);
    await page.screenshot({ path: './test-results/after-edit-click.png' });
    
    // Check if edit form/modal appeared
    const editForm = await page.isVisible('.modal, .dialog, form, [role="dialog"]');
    console.log('Edit form/modal visible:', editForm);
    
    if (editForm) {
      console.log('Edit form appeared successfully');
      
      // Check for expected elements in the edit form
      const serviceNameField = await page.isVisible('input[name=Select only one option."], input[placeholder*="name"]');
      console.log('Service name field visible:', serviceNameField);
      
      const durationField = await page.isVisible('input[name="duration"], select[name="duration"]');
      console.log('Duration field visible:', durationField);
      
      const priceField = await page.isVisible('input[name="price"], input[type="number"]');
      console.log('Price field visible:', priceField);
      
      // Take screenshot of the edit form
      await page.screenshot({ path: './test-results/edit-form.png' });
      
      // Optional: Modify a field to test editing functionality
      if (serviceNameField) {
        // Add a test suffix to the name
      const selectoption=await page.isVisible('text=Select only one option.');
        console.log('Select option visible:', selectoption);
        if (selectoption) {
          await page.click('Hair Care');
          console.log('Clicked select option');
        }

        

        // Take screenshot after modification
        await page.screenshot({ path: './test-results/after-field-edit.png' });
      }
      
      // Look for Save and Cancel buttons
      const saveButton = await page.isVisible('button:has-text("Save"), button:has-text("Update")');
      console.log('Save button visible:', saveButton);
      
      const cancelButton = await page.isVisible('button:has-text("Cancel"), button:has-text("Close")');
      console.log('Cancel button visible:', cancelButton);
      
      // Click Cancel to avoid making changes
      if (cancelButton) {
        await page.click('button:has-text("Cancel"), button:has-text("Close")');
        console.log('Clicked Cancel button');
        
        // Wait for modal to close
        await page.waitForTimeout(2000);
        await page.screenshot({ path: './test-results/after-cancel.png' });
      }
    } else {
      console.log('Edit form did not appear after clicking edit button');
      
      // Try to check if any changes happened on the page
      const pageChanged = await page.evaluate(() => {
        return {
          url: window.location.href,
          newElements: document.querySelectorAll('.modal, form, .dialog').length
        };
      });
      
      console.log('Page state after clicking edit:', pageChanged);
    }
  } else {
    // This section runs if the edit button isn't found
    console.log('Button not visible, trying to debug...');
    
    const allButtons = await page.$$eval('button', buttons => 
      buttons.map(b => ({
        text: b.textContent.trim(),
        classes: b.className,
        isVisible: b.offsetWidth > 0 && b.offsetHeight > 0
      }))
    );
    
    const checkOptions = await page.isVisible('text=Select only one option.');
    console.log('Options are visible:', checkOptions);
    
    const checkImage = await page.isVisible('img[alt="beauty & wellness"]');
    console.log('Booking icon visible:', checkImage);
    
    if (checkImage) {
      await page.click('img[alt="beauty & wellness"]');
      console.log('Clicked on beauty & wellness image');
      await page.waitForTimeout(3000);
      await page.screenshot({ path: './test-results/after-image-click.png' });
    }
    
    console.log('All buttons on page:', allButtons);
    
    // Try to find edit button with a more generic selector
    const editButtons = await page.$$('button:has-text("Edit")');
    console.log(`Found ${editButtons.length} buttons with text "Edit"`);
    
    if (editButtons.length > 0) {
      console.log('Clicking first Edit button found');
      await editButtons[0].click();
      await page.waitForTimeout(2000);
      await page.screenshot({ path: './test-results/after-generic-edit-click.png' });
    }
  }
});