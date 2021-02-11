'use strict';

/* eslint max-len: off */

const config = require('../ui-test-config');

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
};

describe('/applicant-details - validation', () => {

  describe('FR-FOR-21 (FBISCC-43) - Mandatory responses', () => {

    describe('when the user accesses the service with the in-UK link', () => {

      describe('when user selects \'No\' on the identity page', () => {

        beforeEach(async() => setUp(true, 'id-check', 'No'));

        describe('when user submits the page without entering first names', () => {

          it('should display an error message with text \'Enter your first names\'', async() => {
            // populate other fields with valid inputs
            await page.fill('#applicant-last-names', config.validLastNames);

            await submitPage();

            const errorSummaries = await getErrorSummaries();
            const errorMessages = await getErrorMessages();

            expect(errorSummaries.length).to.equal(1);
            expect(errorMessages.length).to.equal(1);
            expect(await errorSummaries[0].innerText()).to.equal('Enter your first names');
            expect(await errorMessages[0].innerText()).to.equal('Enter your first names');
          });

        });

        describe('when user submits the page without entering last names', () => {

          it('should display an error message with text \'Enter your last names\'', async() => {
            // populate other fields with valid inputs
            await page.fill('#applicant-first-names', config.validFirstNames);

            await submitPage();

            const errorSummaries = await getErrorSummaries();
            const errorMessages = await getErrorMessages();

            expect(errorSummaries.length).to.equal(1);
            expect(errorMessages.length).to.equal(1);
            expect(await errorSummaries[0].innerText()).to.equal('Enter your last names');
            expect(await errorMessages[0].innerText()).to.equal('Enter your last names');
          });

        });

        describe('when user submits the page with a URL in the \'first names\' field', () => {

          it('should display an error message with text \'Enter your first names\'', async() => {
            await page.fill('#applicant-first-names', 'www.test.com');
            await page.fill('#applicant-last-names', config.validLastNames);

            await submitPage();

            const errorSummaries = await getErrorSummaries();
            const errorMessages = await getErrorMessages();

            expect(errorSummaries.length).to.equal(1);
            expect(errorMessages.length).to.equal(1);
            expect(await errorSummaries[0].innerText()).to.equal('Enter your first names');
            expect(await errorMessages[0].innerText()).to.equal('Enter your first names');
          });

        });

        describe('when user submits the page with a URL in the \'last names\' field', () => {

          it('should display an error message with text \'Enter your last names\'', async() => {
            await page.fill('#applicant-first-names', config.validFirstNames);
            await page.fill('#applicant-last-names', 'www.test.com');

            await submitPage();

            const errorSummaries = await getErrorSummaries();
            const errorMessages = await getErrorMessages();

            expect(errorSummaries.length).to.equal(1);
            expect(errorMessages.length).to.equal(1);
            expect(await errorSummaries[0].innerText()).to.equal('Enter your last names');
            expect(await errorMessages[0].innerText()).to.equal('Enter your last names');
          });

        });

      });

      describe('when user selects \'Yes\' on the identity page', () => {

        beforeEach(async() => setUp(true, 'id-check', 'Yes'));

        describe('when user submits the page without entering first names', () => {

          it('should display an error message with text \'Enter the applicant\'s first names\'', async() => {
            // populate other fields with valid inputs
            await page.fill('#applicant-last-names', config.validLastNames);

            await submitPage();

            const errorSummaries = await getErrorSummaries();
            const errorMessages = await getErrorMessages();

            expect(errorSummaries.length).to.equal(1);
            expect(errorMessages.length).to.equal(1);
            expect(await errorSummaries[0].innerText()).to.equal('Enter the applicant\'s first names');
            expect(await errorMessages[0].innerText()).to.equal('Enter the applicant\'s first names');
          });

        });

        describe('when user submits the page without entering last names', () => {

          it('should display an error message with text \'Enter the applicant\'s last names\'', async() => {
            // populate other fields with valid inputs
            await page.fill('#applicant-first-names', config.validFirstNames);

            await submitPage();

            const errorSummaries = await getErrorSummaries();
            const errorMessages = await getErrorMessages();

            expect(errorSummaries.length).to.equal(1);
            expect(errorMessages.length).to.equal(1);
            expect(await errorSummaries[0].innerText()).to.equal('Enter the applicant\'s last names');
            expect(await errorMessages[0].innerText()).to.equal('Enter the applicant\'s last names');
          });

        });

        describe('when user submits the page with a URL in the \'First names\' field', () => {

          it('should display an error message with text \'Enter the applicant\'s first names\'', async() => {
            await page.fill('#applicant-first-names', 'www.test.com');
            await page.fill('#applicant-last-names', config.validLastNames);

            await submitPage();

            const errorSummaries = await getErrorSummaries();
            const errorMessages = await getErrorMessages();

            expect(errorSummaries.length).to.equal(1);
            expect(errorMessages.length).to.equal(1);
            expect(await errorSummaries[0].innerText()).to.equal('Enter the applicant\'s first names');
            expect(await errorMessages[0].innerText()).to.equal('Enter the applicant\'s first names');
          });

        });

        describe('when user submits the page with a URL in the \'Last names\' field', () => {

          it('should display an error message with text \'Enter the applicant\'s last names\'', async() => {
            await page.fill('#applicant-first-names', config.validFirstNames);
            await page.fill('#applicant-last-names', 'www.test.com');

            await submitPage();

            const errorSummaries = await getErrorSummaries();
            const errorMessages = await getErrorMessages();

            expect(errorSummaries.length).to.equal(1);
            expect(errorMessages.length).to.equal(1);
            expect(await errorSummaries[0].innerText()).to.equal('Enter the applicant\'s last names');
            expect(await errorMessages[0].innerText()).to.equal('Enter the applicant\'s last names');
          });

        });

      });

    });

    describe('when the user accesses the service with the outside-UK link', () => {

      describe('when user selects \'No\' on the identity page', () => {

        beforeEach(async() => setUp(false, 'id-check', 'No'));

        describe('when user submits the page without entering given names', () => {

          it('should display an error message with text \'Enter your given names\'', async() => {
            // populate other fields with valid inputs
            await page.fill('#applicant-last-names', config.validLastNames);

            await submitPage();

            const errorSummaries = await getErrorSummaries();
            const errorMessages = await getErrorMessages();

            expect(errorSummaries.length).to.equal(1);
            expect(errorMessages.length).to.equal(1);
            expect(await errorSummaries[0].innerText()).to.equal('Enter your given names');
            expect(await errorMessages[0].innerText()).to.equal('Enter your given names');
          });

        });

        describe('when user submits the page without entering family names', () => {

          it('should display an error message with text \'Enter your family names\'', async() => {
            // populate other fields with valid inputs
            await page.fill('#applicant-first-names', config.validFirstNames);

            await submitPage();

            const errorSummaries = await getErrorSummaries();
            const errorMessages = await getErrorMessages();

            expect(errorSummaries.length).to.equal(1);
            expect(errorMessages.length).to.equal(1);
            expect(await errorSummaries[0].innerText()).to.equal('Enter your family names');
            expect(await errorMessages[0].innerText()).to.equal('Enter your family names');
          });

        });

        describe('when user submits the page with a URL in the \'Given names\' field', () => {

          it('should display an error message with text \'Enter your given names\'', async() => {
            await page.fill('#applicant-first-names', 'www.test.com');
            await page.fill('#applicant-last-names', config.validLastNames);

            await submitPage();

            const errorSummaries = await getErrorSummaries();
            const errorMessages = await getErrorMessages();

            expect(errorSummaries.length).to.equal(1);
            expect(errorMessages.length).to.equal(1);
            expect(await errorSummaries[0].innerText()).to.equal('Enter your given names');
            expect(await errorMessages[0].innerText()).to.equal('Enter your given names');
          });

        });

        describe('when user submits the page with a URL in the \'Family names\' field', () => {

          it('should display an error message with text \'Enter your family names\'', async() => {
            await page.fill('#applicant-first-names', config.validFirstNames);
            await page.fill('#applicant-last-names', 'www.test.com');

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

      describe('when user selects \'Yes\' on the identity page', () => {

        beforeEach(async() => setUp(false, 'id-check', 'Yes'));

        describe('when user submits the page without entering given names', () => {

          it('should display an error message with text \'Enter the applicant\'s given names\'', async() => {
            // populate other fields with valid inputs
            await page.fill('#applicant-last-names', config.validLastNames);

            await submitPage();

            const errorSummaries = await getErrorSummaries();
            const errorMessages = await getErrorMessages();

            expect(errorSummaries.length).to.equal(1);
            expect(errorMessages.length).to.equal(1);
            expect(await errorSummaries[0].innerText()).to.equal('Enter the applicant\'s given names');
            expect(await errorMessages[0].innerText()).to.equal('Enter the applicant\'s given names');
          });

        });

        describe('when user submits the page without entering family names', () => {

          it('should display an error message with text \'Enter the applicant\'s family names\'', async() => {
            // populate other fields with valid inputs
            await page.fill('#applicant-first-names', config.validFirstNames);

            await submitPage();

            const errorSummaries = await getErrorSummaries();
            const errorMessages = await getErrorMessages();

            expect(errorSummaries.length).to.equal(1);
            expect(errorMessages.length).to.equal(1);
            expect(await errorSummaries[0].innerText()).to.equal('Enter the applicant\'s family names');
            expect(await errorMessages[0].innerText()).to.equal('Enter the applicant\'s family names');
          });

        });

        describe('when user submits the page with a URL in the \'given names\' field', () => {

          it('should display an error message with text \'Enter the applicant\'s given names\'', async() => {
            await page.fill('#applicant-first-names', 'www.test.com');
            await page.fill('#applicant-last-names', config.validLastNames);

            await submitPage();

            const errorSummaries = await getErrorSummaries();
            const errorMessages = await getErrorMessages();

            expect(errorSummaries.length).to.equal(1);
            expect(errorMessages.length).to.equal(1);
            expect(await errorSummaries[0].innerText()).to.equal('Enter the applicant\'s given names');
            expect(await errorMessages[0].innerText()).to.equal('Enter the applicant\'s given names');
          });

        });

        describe('when user submits the page with a URL in the \'family names\' field', () => {

          it('should display an error message with text \'Enter the applicant\'s family names\'', async() => {
            await page.fill('#applicant-first-names', config.validFirstNames);
            await page.fill('#applicant-last-names', 'www.test.com');

            await submitPage();

            const errorSummaries = await getErrorSummaries();
            const errorMessages = await getErrorMessages();

            expect(errorSummaries.length).to.equal(1);
            expect(errorMessages.length).to.equal(1);
            expect(await errorSummaries[0].innerText()).to.equal('Enter the applicant\'s family names');
            expect(await errorMessages[0].innerText()).to.equal('Enter the applicant\'s family names');
          });

        });

      });

    });

  });

  describe('FR-VAL-9 (FBISCC-31) - UAN validation', () => {

    beforeEach(async() => await setUp(true, 'status', 'No'));

    describe('when user submits the page without entering a UAN', () => {

      it('should display an error message with text \'Enter a unique application number (UAN)\'', async() => {
        // populate other fields with valid inputs
        await page.fill('#applicant-first-names', config.validFirstNames);
        await page.fill('#applicant-last-names', config.validLastNames);

        await submitPage();

        const errorSummaries = await getErrorSummaries();
        const errorMessages = await getErrorMessages();

        expect(errorSummaries.length).to.equal(1);
        expect(errorMessages.length).to.equal(1);
        expect(await errorSummaries[0].innerText()).to.equal('Enter a unique application number (UAN)');
        expect(await errorMessages[0].innerText()).to.equal('Enter a unique application number (UAN)');
      });

    });

    describe('when user submits an invalid UAN', () => {

      it('should display an error message with text \'Check that the format of your UAN matches the example\'', async() => {
        await page.fill('#application-number', config.invalidUAN);

        // populate other fields with valid inputs
        await page.fill('#applicant-first-names', config.validFirstNames);
        await page.fill('#applicant-last-names', config.validLastNames);

        await submitPage();

        const errorSummaries = await getErrorSummaries();
        const errorMessages = await getErrorMessages();

        expect(errorSummaries.length).to.equal(1);
        expect(errorMessages.length).to.equal(1);
        expect(await errorSummaries[0].innerText()).to.equal('Check that the format of your UAN matches the example');
        expect(await errorMessages[0].innerText()).to.equal('Check that the format of your UAN matches the example');
      });

    });

  });

});
