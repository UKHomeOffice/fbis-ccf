'use strict';

/* eslint max-nested-callbacks: off */

describe('/question', () => {

  describe('FR-CAT-3 (FBISCC-7) - In-country query categorisation', () => {

    beforeEach(async() => {
      await page.goto(baseURL + '/landing');
      await submitPage();
    });

    it('should include header with text \'What is your technical problem about?\'', async()=> {
      const header = await page.$('h1');
      expect(await header.innerText()).to.equal('What is your technical problem about?');
    });

    it('should include three radio buttons with correct query categories', async()=> {
      const radios = await page.$$('input[type="radio"]');
      const labels = await page.$$('label');

      expect(radios.length).to.equal(3);
      expect(labels.length).to.equal(3);

      expect(await labels[0].innerText()).to.equal('The \'ID check\' app');
      expect(await labels[1].innerText()).to.equal('Viewing or proving your immigration status');
      expect(await labels[2].innerText()).to.equal('Updating your immigration account details');
    });

    it('should include a submit button with text \'Continue\'', async()=> {
      const submit = await getSubmit();
      expect(await submit.getAttribute('value')).to.equal('Continue');
    });

    describe('if user clicks submit without choosing a question', () => {

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

        const expected = 'Select what your technical problem is about';

        expect(await page.url()).to.equal(baseURL + '/question');
        expect(errorSummaries.length).to.equal(1);
        expect(await errorSummaries[0].innerText()).to.equal(expected);
        expect(errorMessages.length).to.equal(1);
        expect(await errorMessages[0].innerText()).to.equal(expected);
      });

    });

    describe('if user clicks submit after choosing a question', () => {

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

  describe('FR-CAT-19 (FBISCC-41) - Out-country query categorisation', () => {

    beforeEach(async() => {
      await page.goto(baseURL + '/landing?outside-UK');
      await submitPage();
    });

    it('should include header with text \'What is your technical problem about?\'', async()=> {
      const header = await page.$('h1');
      expect(await header.innerText()).to.equal('What is your technical problem about?');
    });

    it('should include three radio buttons with correct query categories', async()=> {
      const radios = await page.$$('input[type="radio"]');
      const labels = await page.$$('label');

      expect(radios.length).to.equal(3);
      expect(labels.length).to.equal(3);

      expect(await labels[0].innerText()).to.equal('The \'ID check\' app');
      expect(await labels[1].innerText()).to.equal('Viewing or proving your immigration status');
      expect(await labels[2].innerText()).to.equal('Updating your immigration account details');
    });

    it('should include a submit button with text \'Continue\'', async()=> {
      const submit = await getSubmit();
      expect(await submit.getAttribute('value')).to.equal('Continue');
    });

    describe('if user clicks submit without choosing a question', () => {

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

        const expected = 'Select what your technical problem is about';

        expect(await page.url()).to.equal(baseURL + '/question');
        expect(errorSummaries.length).to.equal(1);
        expect(await errorSummaries[0].innerText()).to.equal(expected);
        expect(errorMessages.length).to.equal(1);
        expect(await errorMessages[0].innerText()).to.equal(expected);
      });

    });

    describe('if user clicks submit after choosing a question', () => {

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
