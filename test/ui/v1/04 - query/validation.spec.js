'use strict';

/* eslint max-len: off */

const config = require('../../ui-test-config');

const setUp = async(question, identity) => {
  await page.goto(baseURL + '/landing');
  await submitPage();

  // select a question category
  const questionRadio = await page.$(`input#question-${question}`);
  await questionRadio.click();
  await submitPage();

  // select identity
  const identityRadio = await page.$(`input#identity-${identity}`);
  await identityRadio.click();
  await submitPage();

  // complete details page if applicable
  if (identity === 'Yes') {
    await page.fill('#representative-name', config.validName);
    await submitPage();
  }
};

describe('/query - validation', () => {

  describe('FR-FOR-21 - Mandatory responses', () => {

    describe('when user selects \'No\' on the identity page', () => {

      beforeEach(async() => await setUp('status', 'No'));

      describe('when user submits the query page without entering a query', () => {

        it('should display an error message with text \'Enter details of the problem\'', async() => {
          // populate other fields with valid inputs
          await page.fill('#email', config.validEmail);
          await page.fill('#applicant-name', config.validName);
          await page.fill('#application-number', config.validUAN);

          await submitPage();
          const errorSummaries = await getErrorSummaries();
          const errorMessages = await getErrorMessages();

          expect(errorSummaries.length).to.equal(1);
          expect(errorMessages.length).to.equal(1);
          expect(await errorSummaries[0].innerText()).to.equal('Enter details of the problem');
          expect(await errorMessages[0].innerText()).to.equal('Enter details of the problem');
        });

      });

      describe('when user submits the query page without a name', () => {

        it('should display an error message with text \'Enter your full name\'', async() => {
          // populate other fields with valid inputs
          await page.fill('#query', config.validQuery);
          await page.fill('#email', config.validEmail);
          await page.fill('#application-number', config.validUAN);

          await submitPage();

          const errorSummaries = await getErrorSummaries();
          const errorMessages = await getErrorMessages();

          expect(errorSummaries.length).to.equal(1);
          expect(errorMessages.length).to.equal(1);
          expect(await errorSummaries[0].innerText()).to.equal('Enter your full name');
          expect(await errorMessages[0].innerText()).to.equal('Enter your full name');
        });

      });

      describe('when user submits the query page without an email', () => {

        it('should display an error message with text \'Enter your email address\'', async() => {
          // populate other fields with valid inputs
          await page.fill('#query', config.validQuery);
          await page.fill('#applicant-name', config.validName);
          await page.fill('#application-number', config.validUAN);

          await submitPage();

          const errorSummaries = await getErrorSummaries();
          const errorMessages = await getErrorMessages();

          expect(errorSummaries.length).to.equal(1);
          expect(errorMessages.length).to.equal(1);
          expect(await errorSummaries[0].innerText()).to.equal('Enter your email address');
          expect(await errorMessages[0].innerText()).to.equal('Enter your email address');
        });

      });

      describe('when user submits the query page without a UAN', () => {

        it('should display an error message with text \'Enter your unique application number (UAN)\'', async() => {
          // populate other fields with valid inputs
          await page.fill('#query', config.validQuery);
          await page.fill('#applicant-name', config.validName);
          await page.fill('#email', config.validEmail);

          await submitPage();

          const errorSummaries = await getErrorSummaries();
          const errorMessages = await getErrorMessages();

          expect(errorSummaries.length).to.equal(1);
          expect(errorMessages.length).to.equal(1);
          expect(await errorSummaries[0].innerText()).to.equal('Enter your unique application number (UAN)');
          expect(await errorMessages[0].innerText()).to.equal('Enter your unique application number (UAN)');
        });

      });

    });

    describe('when user selects \'Yes\' on the identity page', () => {

      beforeEach(async() => await setUp('status', 'Yes'));

      describe('when user submits the query page without entering a query', () => {

        it('should display an error message with text \'Enter details of the problem\'', async() => {
          // populate other fields with valid inputs
          await page.fill('#email', config.validEmail);
          await page.fill('#applicant-name', config.validName);
          await page.fill('#application-number', config.validUAN);

          await submitPage();
          const errorSummaries = await getErrorSummaries();
          const errorMessages = await getErrorMessages();

          expect(errorSummaries.length).to.equal(1);
          expect(errorMessages.length).to.equal(1);
          expect(await errorSummaries[0].innerText()).to.equal('Enter details of the problem');
          expect(await errorMessages[0].innerText()).to.equal('Enter details of the problem');
        });

      });

      describe('when user submits the query page without a name', () => {

        it('should display an error message with text \'Enter the applicant\'s full name\'', async() => {
          // populate other fields with valid inputs
          await page.fill('#query', config.validQuery);
          await page.fill('#email', config.validEmail);
          await page.fill('#application-number', config.validUAN);

          await submitPage();

          const errorSummaries = await getErrorSummaries();
          const errorMessages = await getErrorMessages();

          expect(errorSummaries.length).to.equal(1);
          expect(errorMessages.length).to.equal(1);
          expect(await errorSummaries[0].innerText()).to.equal('Enter the applicant\'s full name');
          expect(await errorMessages[0].innerText()).to.equal('Enter the applicant\'s full name');
        });

      });

      describe('when user submits the query page without an email', () => {

        it('should display an error message with text \'Enter the applicant\'s email address\'', async() => {
          // populate other fields with valid inputs
          await page.fill('#query', config.validQuery);
          await page.fill('#applicant-name', config.validName);
          await page.fill('#application-number', config.validUAN);

          await submitPage();

          const errorSummaries = await getErrorSummaries();
          const errorMessages = await getErrorMessages();

          expect(errorSummaries.length).to.equal(1);
          expect(errorMessages.length).to.equal(1);
          expect(await errorSummaries[0].innerText()).to.equal('Enter the applicant\'s email address');
          expect(await errorMessages[0].innerText()).to.equal('Enter the applicant\'s email address');
        });

      });

      describe('when user submits the query page without a UAN', () => {

        it('should display an error message with text \'Enter the applicant\'s unique application number (UAN)\'', async() => {
          // populate other fields with valid inputs
          await page.fill('#query', config.validQuery);
          await page.fill('#applicant-name', config.validName);
          await page.fill('#email', config.validEmail);

          await submitPage();

          const errorSummaries = await getErrorSummaries();
          const errorMessages = await getErrorMessages();

          expect(errorSummaries.length).to.equal(1);
          expect(errorMessages.length).to.equal(1);
          expect(await errorSummaries[0].innerText()).to.equal('Enter the applicant\'s unique application number (UAN)');
          expect(await errorMessages[0].innerText()).to.equal('Enter the applicant\'s unique application number (UAN)');
        });

      });

    });

  });

  describe('FR-VAL-8 (FBISCC-32) - Email address validation', () => {

    beforeEach(async() => await setUp('status', 'No'));

    describe('when user submits an email address with special characters in the user section', () => {

      it('should not display an error for the email field', async() => {
        await page.fill('#email', config.validEmailWithSpecialChars);

        // populate other fields with valid inputs
        await page.fill('#query', config.validQuery);
        await page.fill('#applicant-name', config.validName);
        await page.fill('#application-number', config.validUAN);

        await submitPage();

        expect(await page.url()).to.equal(baseURL + '/confirm');
      });

    });

    describe('when user submits an invalid email address', () => {

      it('should display an error message with text \'Enter a valid email address\'', async() => {
        await page.fill('#email', config.invalidEmail);

        // populate other fields with valid inputs
        await page.fill('#query', config.validQuery);
        await page.fill('#applicant-name', config.validName);
        await page.fill('#application-number', config.validUAN);

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

  describe('FR-VAL-9 (FBISCC-31) - UAN validation', () => {

    beforeEach(async() => await setUp('status', 'No'));

    describe('when user submits an invalid UAN', () => {

      it('should display an error message with text \'Enter a valid unique application number (UAN)\'', async() => {
        await page.fill('#application-number', config.invalidUAN);

        // populate other fields with valid inputs
        await page.fill('#query', config.validQuery);
        await page.fill('#applicant-name', config.validName);
        await page.fill('#email', config.validEmail);

        await submitPage();

        const errorSummaries = await getErrorSummaries();
        const errorMessages = await getErrorMessages();

        expect(errorSummaries.length).to.equal(1);
        expect(errorMessages.length).to.equal(1);
        expect(await errorSummaries[0].innerText()).to.equal('Enter a valid unique application number (UAN)');
        expect(await errorMessages[0].innerText()).to.equal('Enter a valid unique application number (UAN)');
      });

    });

  });

});
