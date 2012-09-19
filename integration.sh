#!/bin/bash
npm install
# For local testing, download and install selenium and the chrome driver and 
# then make sure the dev server is running
# java -Dwebdriver.chrome.driver=/path/to/chromedriver -jar ~/path/to/selenium-server-standalone-2.25.0.jar
#./node_modules/.bin/mocha -R spec -t 40000 tests/integration/CreateBudget.js

# For sauce testing. This tests using the budget2012-dev site. This will be
# deployed to after a push and should be up to date before this is triggerd by jenkins
./node_modules/.bin/mocha -R spec -t 1200000 tests/integration/CreateBudget.js --with-sauce
