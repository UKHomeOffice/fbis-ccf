'use strict';

/* eslint max-nested-callbacks: off */

describe('/details', () => {

  beforeEach(async() => {
    await page.goto(baseURL + '/landing');
    await submitPage();

    // select any question category and continue
    const radio = await page.$('input[type="radio"]');
    await radio.check();
    await submitPage();

    // select 'Yes', contacting us on behalf of somebody else
    const yes = await page.$('input#identity-Yes');
    await yes.click();
    await submitPage();
  });

  describe('FR-REP-4 (FBISCC-33) - Collecting representative\'s details', () => {

    it('should include a header with text \'Your details\'', async() => {
      const header = await page.$('h1');
      expect(await header.textContent()).to.equal('Your details');
    });

    it('should include three text input fields with the correct labels', async() => {
      const textInputs = await page.$$('input[type="text"]');
      const labels = await page.$$('.form-group label');

      expect(textInputs.length).to.equal(3);
      expect(labels.length).to.equal(3);

      expect(await labels[0].innerText()).to.equal('Your full name');
      expect(await labels[1].innerText()).to.equal('Your phone number (optional)');
      expect(await labels[2].innerText()).to.equal('Your organisation\'s name (optional)');
    });

    describe('when user submits the page without entering their name', () => {

      it('should stay on the details page, display an error message, and display an error summary', async()=> {
        await submitPage();

        const errorSummaries = await getErrorSummaries();
        const errorMessages = await getErrorMessages();

        const expected = 'Enter your full name';

        expect(await page.url()).to.equal(baseURL + '/details');
        expect(errorSummaries.length).to.equal(1);
        expect(await errorSummaries[0].innerText()).to.equal(expected);
        expect(errorMessages.length).to.equal(1);
        expect(await errorMessages[0].innerText()).to.equal(expected);
      });

    });

    describe('when user submits the page after entering their name', () => {

      it('should continue to the query page', async()=> {
        await page.fill('input#representative-name', 'John Smith');
        await submitPage();
        expect(await page.url()).to.equal(baseURL + '/query');
      });

    });

  });

});
