'use strict';

/* eslint max-len: off */

describe('Error - 404', () => {

  describe('FR-ERR-28, (FBISCC-74) - \'Page not found\' error page', () => {

    beforeEach(async() => {
      await page.goto(baseURL + '/pageThatDoesntExist');
    });

    it('should include a header with text \'Page not found\'', async() => {
      const header = await page.$('h1');
      expect(await header.innerText()).to.equal('Page not found');
    });

    it('should have a section to get help by phone', async() => {
      const phoneSection = await page.$('#help-by-phone');
      expect(await phoneSection.innerText()).to.equal('If the web address is correct or you selected a link or button, get help with your problem by phone on:');
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
