'use strict';

/* eslint max-len: off */

describe('/question', () => {

  describe('FR-CAT-3 (FBISCC-7), FR-CAT-19 (FBISCC-41) - In- and out-country query categorisation', () => {

    beforeEach(async() => {
      await page.goto(baseURL + '/start');
      await submitPage();
    });

    it('should include header with text \'What is your question about?\'', async()=> {
      const header = await page.$('h1');
      expect(await header.innerText()).to.equal('What is your question about?');
    });

    it('should include three radio buttons with correct query categories', async()=> {
      const radios = await page.$$('input[type="radio"]');
      const labels = await page.$$('.form-group label');

      expect(radios.length).to.equal(3);
      expect(labels.length).to.equal(3);

      expect(await labels[0].innerText()).to.equal('The UK Immigration \'ID check\' app');
      expect(await labels[1].innerText()).to.equal('Viewing or proving your online immigration status, right to rent or right to work');
      expect(await labels[2].innerText()).to.equal('Updating your immigration account details');
    });

    describe('when user clicks submit without choosing a question', () => {

      beforeEach(async() => {
        const radios = await page.$$('input[type="radio"]');
        for (const radio of radios) {
          await radio.uncheck();
        }
      });

      it('should stay on the question page, display an error message, and display an error summary', async()=> {
        await submitPage();

        const errorSummaries = await getErrorSummaries();
        const errorMessages = await getErrorMessages();

        const expected = 'Select what your problem is about';

        expect(await page.url()).to.equal(baseURL + '/question');
        expect(errorSummaries.length).to.equal(1);
        expect(await errorSummaries[0].innerText()).to.equal(expected);
        expect(errorMessages.length).to.equal(1);
        expect(await errorMessages[0].innerText()).to.equal(expected);
      });

    });

    describe('when user clicks submit after choosing a question', () => {

      let radios;

      beforeEach(async() => {
        radios = await page.$$('input[type="radio"]');
        for (const radio of radios) {
          await radio.uncheck();
        }
      });

      it('should continue to the identity page', async()=> {
        await radios[0].click();
        await submitPage();
        expect(await page.url()).to.equal(baseURL + '/identity');
      });

    });

  });

});
