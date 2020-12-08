'use strict';

/* eslint max-len: off */

const config = require('../ui-test-config');

describe('Error - Form not submitted', () => {

  beforeEach(async() => {
    await page.goto(baseURL + '/question');

    // select a question category
    const questionRadio = await page.$('input#question-id-check');
    await questionRadio.click();
    await submitPage();

    // submit the context page, which requires no input
    await submitPage();

    // select identity
    const identityRadio = await page.$('input#identity-No');
    await identityRadio.click();
    await submitPage();

    // fill applicant details
    await page.fill('#applicant-first-names', config.validFirstNames);
    await page.fill('#applicant-last-names', config.validLastNames);
    await submitPage();

    // fill contact details
    await page.fill('#email', config.notifyFailureEmail);
    await submitPage();

    // enter query
    await page.fill('#query', config.validQuery);
    await submitPage();

    // submit from confirm page
    await submitPage();
  });

  describe('FR-ERR-29, (FBISCC-83) - \'Form not submitted\' error page', () => {

    it('should include a header with text \'Sorry, your form has not been sent\'', async() => {
      const header = await page.$('h1');
      expect(await header.innerText()).to.equal('Sorry, your form has not been sent');
    });

    it('should include a link to try again', async() => {
      const link = await page.$('.error a[href="/question"]');
      expect(await link.innerText()).to.equal('Try again using the online form');
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

