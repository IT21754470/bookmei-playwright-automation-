-- Uploading "Screenshot (2173).png"... 

##📋 Overview
This project contains automated end-to-end tests for BookMei, a salon and spa management platform. The tests cover various functionalities including user authentication, calendar management, team management, service operations, and review systems.
#🚀 Features

Login & Authentication 
Automated login testing with credential verification
Dashboard Testing - Validation of key metrics, navigation, and UI elements
Calendar Management - Testing of calendar views, scheduling, and date interactions
Team Management - Employee profile checks, schedule updates, and role management
Service Operations - Service creation, editing, and management workflows
Review System - Review display, interaction, and response functionality
Cross-browser Testing - Support for Chromium, Firefox, and WebKit
Visual Testing - Screenshot capture for visual regression detection
Detailed Reporting - HTML reports with test results and debugging information

#🛠️ Tech Stack

Testing Framework: Playwright
Language: JavaScript (Node.js)
Test Runner: Playwright Test
CI/CD: GitHub Actions
Reporting: HTML Reports, Screenshots, Video Recording

#📁 Project Structure
bookmei-tests/
├── tests/
│   ├── check-bookmei.test.js      # Main dashboard and login tests
│   ├── bookmei-calendar.test.js   # Calendar functionality tests
│   ├── bookmei-team.test.js       # Team management tests
│   ├── bookmei-services.test.js   # Service management tests
│   └── bookmei-reviews.test.js    # Review system tests
├── test-results/                  # Test artifacts (screenshots, videos)
├── playwright-report/             # HTML test reports
