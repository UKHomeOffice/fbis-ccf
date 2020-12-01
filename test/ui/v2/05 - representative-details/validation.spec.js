'use strict';

/* eslint max-len: off */

const config = require('../../ui-test-config');

const setUp = async(inUK, question, identity) => {
  await page.goto(baseURL + '/question' + (inUK ? '' : '?outside-UK'));
  // select a question category
  const questionRadio = await page.$(`input#question-${question}`);
  await questionRadio.click();
  await submitPage();

  // submit the context page, which requires no input
  await submitPage();

  // select identity
  const identityRadio = await page.$(`input#identity-${identity}`);
  await identityRadio.click();
  await submitPage();

  // fill applicant details
  await page.fill('#applicant-first-names', config.validFirstNames);
  await page.fill('#applicant-last-names', config.validLastNames);
  await submitPage();
};

describe('/representative-details - validation', () => {

  describe('FR-FOR-21 (FBISCC-43) - Mandatory responses', () => {

    describe('when the user accesses the service from the in-UK link', () => {

      beforeEach(async() => setUp(true, 'id-check', 'Yes'));

      describe('when the user submits the page without entering first names', () => {

        it('should display an error message with text \'Enter your first names\'', async() => {
          await page.fill('#representative-last-names', config.validLastNames);
          await submitPage();

          const errorSummaries = await getErrorSummaries();
          const errorMessages = await getErrorMessages();

          expect(errorSummaries.length).to.equal(1);
          expect(errorMessages.length).to.equal(1);
          expect(await errorSummaries[0].innerText()).to.equal('Enter your first names');
          expect(await errorMessages[0].innerText()).to.equal('Enter your first names');
        });

      });

      describe('when the user submits the page without entering last names', () => {

        it('should display an error message with text \'Enter your last names\'', async() => {
          await page.fill('#representative-first-names', config.validFirstNames);
          await submitPage();

          const errorSummaries = await getErrorSummaries();
          const errorMessages = await getErrorMessages();

          expect(errorSummaries.length).to.equal(1);
          expect(errorMessages.length).to.equal(1);
          expect(await errorSummaries[0].innerText()).to.equal('Enter your last names');
          expect(await errorMessages[0].innerText()).to.equal('Enter your last names');
        });

      });

      describe('when the user submits the page without entering an organisation', () => {

        it('should continue to the contact-details page', async() => {
          await page.fill('#representative-first-names', config.validFirstNames);
          await page.fill('#representative-last-names', config.validLastNames);
          await submitPage();

          expect(await page.url()).to.equal(baseURL + '/contact-details');
        });

      });

    });

    describe('when the user accesses the service from the outside-UK link', () => {

      beforeEach(async() => setUp(false, 'id-check', 'Yes'));

      describe('when the user submits the page without entering given names', () => {

        it('should display an error message with text \'Enter your given names\'', async() => {
          await page.fill('#representative-last-names', config.validLastNames);
          await submitPage();

          const errorSummaries = await getErrorSummaries();
          const errorMessages = await getErrorMessages();

          expect(errorSummaries.length).to.equal(1);
          expect(errorMessages.length).to.equal(1);
          expect(await errorSummaries[0].innerText()).to.equal('Enter your given names');
          expect(await errorMessages[0].innerText()).to.equal('Enter your given names');
        });

      });

      describe('when the user submits the page without entering family names', () => {

        it('should display an error message with text \'Enter your family names\'', async() => {
          await page.fill('#representative-first-names', config.validFirstNames);
          await submitPage();

          const errorSummaries = await getErrorSummaries();
          const errorMessages = await getErrorMessages();

          expect(errorSummaries.length).to.equal(1);
          expect(errorMessages.length).to.equal(1);
          expect(await errorSummaries[0].innerText()).to.equal('Enter your family names');
          expect(await errorMessages[0].innerText()).to.equal('Enter your family names');
        });

      });

    });

  });

});
