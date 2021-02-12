'use strict';

/* eslint max-len: off */

const config = require('../ui-test-config');

describe('/contact-details', () => {

  beforeEach(async() => {
    await page.goto(baseURL + '/start');
    await submitPage();

    // select any question category and continue
    const radio = await page.$('input[type="radio"]');
    await radio.check();
    await submitPage();

    // select identity No
    const identityRadio = await page.$('input#identity-No');
    await identityRadio.click();
    await submitPage();

    // complete the applicant details page
    await page.fill('#applicant-first-names', config.validFirstNames);
    await page.fill('#applicant-last-names', config.validLastNames);
    await submitPage();
  });

  describe('FR-FOR-5/6/7 (FBISCC-70) - Contact details', () => {

    it('should include a header with text \'Where should we send our response?\'', async() => {
      const header = await page.$('h1');
      expect(await header.innerText()).to.equal('Where should we send our response?');
    });

    it('should include a text input field for email', async() => {
      const textInputs = await page.$$('input[type="text"]');
      const labels = await page.$$('.form-group label');

      expect(textInputs.length).to.equal(2);
      expect(labels.length).to.equal(2);

      expect(await labels[0].innerText()).to.include('Applicant\'s email address');
      expect(await labels[0].innerText()).to.include('This is where we\'ll send our reply. Make sure this is the same email address used for the application');
    });

    it('should include a text input field for phone', async() => {
      const textInputs = await page.$$('input[type="text"]');
      const labels = await page.$$('.form-group label');

      expect(textInputs.length).to.equal(2);
      expect(labels.length).to.equal(2);

      expect((await labels[1].innerText()).includes('Telephone number (optional)')).to.equal(true);
      expect((await labels[1].innerText()).includes('We may want to contact you by telephone if we need more information to answer your question. Include the country code if this is not a UK number')).to.equal(true);
    });

  });

  describe('FR-FOR-21 (FBISCC-43) - Mandatory responses', () => {

    describe('when user submits the page without entering an email', () => {

      it('should display an error message with text \'Enter your email address\'', async() => {
        await submitPage();

        const errorSummaries = await getErrorSummaries();
        const errorMessages = await getErrorMessages();

        expect(errorSummaries.length).to.equal(1);
        expect(errorMessages.length).to.equal(1);
        expect(await errorSummaries[0].innerText()).to.equal('Enter your email address');
        expect(await errorMessages[0].innerText()).to.equal('Enter your email address');
      });

    });

    describe('when user submits the page without entering a phone number', () => {

      it('should should not show an error', async() => {
        await page.fill('#email', config.validEmail);
        await submitPage();

        expect(await page.url()).to.equal(baseURL + '/query');
      });

    });

    describe('when the user submits the page with text in the phone field', () => {

      it('should display an error message with text \'Enter a valid phone number\'', async() => {
        await page.fill('#email', config.validEmail);
        await page.fill('#phone', 'Text');
        await submitPage();

        const errorSummaries = await getErrorSummaries();
        const errorMessages = await getErrorMessages();

        expect(errorSummaries.length).to.equal(1);
        expect(errorMessages.length).to.equal(1);
        expect(await errorSummaries[0].innerText()).to.equal('Enter a valid phone number');
        expect(await errorMessages[0].innerText()).to.equal('Enter a valid phone number');
      });

    });

  });

  describe('FR-VAL-8 (FBISCC-32) - Email address validation', () => {

    describe('when user submits an email address with special characters in the user section', () => {

      it('should not display an error for the email field', async() => {
        await page.fill('#email', config.validEmailWithSpecialChars);
        await submitPage();

        expect(await page.url()).to.equal(baseURL + '/query');
      });

    });

    describe('when user submits an invalid email address', () => {

      it('should display an error message with text \'Enter a valid email address\'', async() => {
        await page.fill('#email', config.invalidEmail);
        await submitPage();

        const errorSummaries = await getErrorSummaries();
        const errorMessages = await getErrorMessages();

        expect(errorSummaries.length).to.equal(1);
        expect(errorMessages.length).to.equal(1);
        expect(await errorSummaries[0].innerText()).to.equal('Enter a valid email address');
        expect(await errorMessages[0].innerText()).to.equal('Enter a valid email address');
      });

    });

  });

});
