// report.js
const fs = require('fs');
const path = require('path');

// Function to generate a readable HTML report
function generateReport() {
  // Read the JSON results file
  const resultsPath = path.join(__dirname, 'test-results', 'test-results.json');
  
  if (!fs.existsSync(resultsPath)) {
    console.error('Test results file not found. Run tests first.');
    return;
  }
  
  const results = JSON.parse(fs.readFileSync(resultsPath, 'utf8'));
  
  // Create HTML content
  let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>BookMei Test Report</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { color: #333; }
        .test { margin-bottom: 15px; border: 1px solid #ddd; padding: 10px; border-radius: 5px; }
        .passed { border-left: 5px solid green; }
        .failed { border-left: 5px solid red; }
        .details { margin-top: 10px; font-family: monospace; }
        .summary { margin-bottom: 20px; font-size: 1.2em; }
      </style>
    </head>
    <body>
      <h1>BookMei Test Report</h1>
      <div class="summary">
        Run Date: ${new Date().toLocaleString()}
      </div>
  `;
  
  // Process test results
  let passedTests = 0;
  let failedTests = 0;
  
  results.suites.forEach(suite => {
    html += `<h2>${suite.title}</h2>`;
    
    suite.specs.forEach(spec => {
      const isPassed = spec.tests.every(test => test.status === 'passed');
      if (isPassed) passedTests++;
      else failedTests++;
      
      html += `
        <div class="test ${isPassed ? 'passed' : 'failed'}">
          <h3>${spec.title}</h3>
          <p>Status: ${isPassed ? 'PASSED' : 'FAILED'}</p>
      `;
      
      if (!isPassed) {
        html += `<div class="details">`;
        spec.tests.forEach(test => {
          if (test.status !== 'passed') {
            html += `<p>Error: ${test.error?.message || 'Unknown error'}</p>`;
          }
        });
        html += `</div>`;
      }
      
      html += `</div>`;
    });
  });
  
  html += `
      <div class="summary">
        <p>Tests Passed: ${passedTests}</p>
        <p>Tests Failed: ${failedTests}</p>
        <p>Total: ${passedTests + failedTests}</p>
      </div>
    </body>
    </html>
  `;
  
  // Write HTML report
  const reportPath = path.join(__dirname, 'test-results', 'report.html');
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, html);
  
  console.log(`Report generated at: ${reportPath}`);
}

// Run the report generator
generateReport();