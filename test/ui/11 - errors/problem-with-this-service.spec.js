'use strict';

const config = require('../ui-test-config');

describe('Error - 500', () => {

  describe('FR-ERR-29 (FBISCC-76) - \'Service failure\' error page', () => {

    beforeEach(async() => {
      // Go to feedback page
      await page.goto(baseURL + '/start');
      await page.waitForLoadState();
      await page.click('a[href="/feedback"]');
      await page.waitForLoadState();

      const radios = await page.$$('input[type="radio"]');
      await radios[0].click();
      await page.fill('#feedbackText', config.validQuery);
      await page.fill('#feedbackEmail', config.notifyFailureEmail);
      await submitPage();
    });

    it('should include a header with text \'Sorry, there is a problem with this service\'', async() => {
      const header = await page.$('h1');
      expect(await header.innerText()).to.equal('Sorry, there is a problem with this service');
    });

    it('should have a section to get help by phone', async() => {
      const phoneSection = await page.$('#help-by-phone');
      expect(await phoneSection.innerText()).to.equal('Try again later or get help by phone on:');
    });

    it('should have a section with times you can call', async() => {
      const callInfo = await page.$$('.call-info');
      expect(callInfo.length).to.equal(3);
    });

    it('should include a link with text \'Find out about call charges\'', async() => {
      const callInfo = await page.$$('.call-info');
      const expected = '<a href="https://www.gov.uk/call-charges" class="link">Find out about call charges</a>';
      expect(await callInfo[2].innerHTML()).to.include(expected);
    });

  });

});
