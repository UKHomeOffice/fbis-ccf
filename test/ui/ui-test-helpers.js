'use strict';

/* eslint no-console: off */

const playwright = require('playwright');
const minimist = require('minimist');
const browserEngine = minimist(process.argv)['browser-engine'] || 'chromium';
global.baseURL = 'http://localhost:8080';

before(async() => {
  try {
    console.log(`Launching ${browserEngine}`);

    /*
     Launch browser with /dev/shm usage disabled, so that shared memory files are written to larger /tmp directory.
     This helps prevent crashes when rendering large pages.
     This arg is not available for webkit.
    */
    global.browser = await playwright[browserEngine].launch({
      args: [browserEngine !== 'webkit' ? '--disable-dev-shm-usage' : '']
    });

    console.log(`Starting tests in ${browserEngine}`);
  } catch (e) {
    console.log(`Error launching ${browserEngine}`);
    console.log(e);
  }
});

after(async() => {
  try {
    console.log(`Closing ${browserEngine}`);
    return await browser.close();
  } catch (e) {
    console.log(`Error closing ${browserEngine}`);
    console.log(e);
  }
});

beforeEach(async() => {
  try {
    global.page = await browser.newPage();
  } catch (e) {
    console.log('Error opening page.');
    console.log(e);
  }
});

afterEach(async() => {
  try {
    await page.close();
  } catch (e) {
    console.log('Error closing page.');
    console.log(e);
  }
});

global.getSubmit = async() => await page.$('input[type="submit"]');

global.submitPage = async() => {
  const submit = await getSubmit();
  await submit.click();
  await page.waitForLoadState();
};

global.getErrorSummaries = async() => await page.$$('.error-summary a');
global.getErrorMessages = async() => await page.$$('.error-message');
