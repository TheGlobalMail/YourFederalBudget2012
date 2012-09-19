#!/bin/bash
npm install
./server.sh devserver &
# for local testing
#./node_modules/.bin/mocha -R spec -t 40000 tests/integration/CreateBudget.js
# for sauce testing
./node_modules/.bin/mocha -R spec -t 1200000 tests/integration/CreateBudget.js --with-sauce
