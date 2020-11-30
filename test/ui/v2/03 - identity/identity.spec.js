'use strict';

describe('/identity', () => {

  beforeEach(async() => {
    await page.goto(baseURL + '/question');
    // select any question category and continue
    const radio = await page.$('input[type="radio"]');
    await radio.check();
    await submitPage();

    // submit the context page, which requires no input
    await submitPage();
  });

  describe('FR-REP-4 (FBISCC-33) - Collecting representative\'s details', () => {

    it('should include header with text \'Are you contacting us on behalf of someone else?\'', async()=> {
      const header = await page.$('h1');
      expect(await header.innerText()).to.equal('Are you contacting us on behalf of someone else?');
    });

    it('should include two radio buttons with labels \'Yes\' and \'No\'', async()=> {
      const radios = await page.$$('input[type="radio"]');
      const labels = await page.$$('.form-group label');

      expect(radios.length).to.equal(2);
      expect(labels.length).to.equal(2);

      expect(await labels[0].innerText()).to.equal('Yes');
      expect(await labels[1].innerText()).to.equal('No');
    });

    describe('when user clicks submit without choosing an option', () => {

      beforeEach(async() => {
        const radios = await page.$$('input[type="radio"]');
        for (const radio of radios) {
          await radio.uncheck();
        }
      });

      it('should stay on the identity page, display an error message, and display an error summary', async()=> {
        await submitPage();

        const errorSummaries = await getErrorSummaries();
        const errorMessages = await getErrorMessages();

        const expected = 'Select if you are contacting us on behalf of someone else';

        expect(await page.url()).to.equal(baseURL + '/identity');
        expect(errorSummaries.length).to.equal(1);
        expect(await errorSummaries[0].innerText()).to.equal(expected);
        expect(errorMessages.length).to.equal(1);
        expect(await errorMessages[0].innerText()).to.equal(expected);
      });

    });

    describe('when user clicks submit after choosing \'Yes\'', () => {

      beforeEach(async() => {
        const yes = await page.$('input#identity-Yes');
        await yes.click();
        await submitPage();
      });

      it('should continue to the applicant details page', async() => {
        expect(await page.url()).to.equal(baseURL + '/applicant-details');
      });

    });

    describe('when user clicks submit after choosing \'No\'', () => {

      beforeEach(async() => {
        const no = await page.$('input#identity-No');
        await no.click();
        await submitPage();
      });

      it('should continue to the applicant details page', async() => {
        expect(await page.url()).to.equal(baseURL + '/applicant-details');
      });

    });

  });

});
