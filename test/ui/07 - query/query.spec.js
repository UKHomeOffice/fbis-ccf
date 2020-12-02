'use strict';

const config = require('../ui-test-config');

describe('/query', () => {

  beforeEach(async() => {
    await page.goto(baseURL + '/question');

    // select any question category and continue
    const radio = await page.$('input[type="radio"]');
    await radio.check();
    await submitPage();

    // submit the context page, which requires no input
    await submitPage();

    // select identity No
    const identityRadio = await page.$('input#identity-No');
    await identityRadio.click();
    await submitPage();

    // complete the applicant details page
    await page.fill('#applicant-first-names', config.validFirstNames);
    await page.fill('#applicant-last-names', config.validLastNames);
    await submitPage();

    // complete the contact details page
    await page.fill('#email', config.validEmail);
    await submitPage();
  });

  describe('FR-FOR-5/6/7 (FBISCC-71) - Collect written enquiry', () => {

    it('should include a header with text \'Tell us about the problem\'', async() => {
      const header = await page.$('h1');
      expect(await header.innerText()).to.equal('Tell us about the problem');
    });

    it('should include a text area with label \'Give a detailed description of the problem\'', async() => {
      const textArea = await page.$('textarea#query');
      const label = await page.$('label[for="query"]');

      const expectedLabel = 'Give a detailed description of the problem';
      const expectedHint = 'Describe what you were doing and any error messages';

      expect(textArea).to.not.equal(undefined);
      expect(label).to.not.equal(undefined);
      expect((await label.innerText()).includes(expectedLabel)).to.equal(true);
      expect((await label.innerText()).includes(expectedHint)).to.equal(true);
    });

  });

  describe('FR-FOR-21 (FBISCC-43) - Mandatory responses', () => {

    describe('when user submits the query page without entering a query', () => {

      it('should display an error message with text \'Enter details of the problem\'', async() => {
        await submitPage();
        const errorSummaries = await getErrorSummaries();
        const errorMessages = await getErrorMessages();

        expect(errorSummaries.length).to.equal(1);
        expect(errorMessages.length).to.equal(1);
        expect(await errorSummaries[0].innerText()).to.equal('Enter details of the problem');
        expect(await errorMessages[0].innerText()).to.equal('Enter details of the problem');
      });

    });

  });

  describe('NFR-FOR-22 (FBISCC-44) - 2000 character query count limit', () => {

    describe('when user exceeds the character limit', () => {

      it('character count live update displays an error message with amount of chars over limit', async() => {
        await page.fill('#query', config.invalidQuery);

        const errorMessages = await getErrorMessages();
        const expected = 'You have 1 character too many';

        expect(errorMessages.length).to.equal(1);
        expect(await errorMessages[0].innerText()).to.equal(expected);
      });

    });

    describe('when user submits query over character limit length', () => {

      it('should stay on the query page, display an error message and display an error summary', async()=> {
        await page.fill('#query', config.invalidQuery);
        await submitPage();

        const errorSummaries = await getErrorSummaries();
        const errorMessages = await getErrorMessages();

        const expected = 'Summary must be 2000 characters or fewer';

        expect(await page.url()).to.equal(baseURL + '/query');
        expect(errorSummaries.length).to.equal(1);
        expect(await errorSummaries[0].innerText()).to.equal(expected);
        // Two error messages with js-enabled as character count live update text is also an error
        expect(errorMessages.length).to.equal(2);
        expect(await errorMessages[0].innerText()).to.equal(expected);
      });

    });

  });

});
