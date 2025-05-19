@echo off
echo ===== RUNNING BOOKMEI LOGIN TEST =====
npx playwright test check-bookmei.test.js
echo.
echo ===== RUNNING BOOKMEI HOMEPAGE TEST =====
npx playwright test check-homepage.test.js
echo.
echo ===== ALL TESTS COMPLETED =====
echo View the report with: npx playwright show-report