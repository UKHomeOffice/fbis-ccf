'use strict';

const config = require('../ui-test-config');

describe('/confirm', () => {

  describe('FR-EMA-2 (FBISCC-37) - Emailing SRC', () => {

    beforeEach(async() => {
      await page.goto(baseURL + '/landing');
      await submitPage();

      // select any question category and continue to identity page
      const radios = await page.$$('input[type="radio"]');
      await radios[0].click();
      await submitPage();

      // select 'No', not contacting us on behalf of somebody else, and continue to query page
      const no = await page.$('input#identity-No');
      await no.click();
      await submitPage();

    });

    describe('when the email sends successfully', () => {

      beforeEach(async() => {
        // enter a valid query and details, using the mock notify guaranteed success email, and continue to confirm page
        await page.fill('#query', config.validQuery);
        await page.fill('#applicant-name', config.validName);
        await page.fill('#email', config.notifySuccessEmail);
        await submitPage();

        // submit the query from the confirm page
        await submitPage();
      });

      it('should continue to the \'complete\' page', async() => {
        expect(await page.url()).to.equal(baseURL + '/complete');
      });

    });

    describe('when the email fails to send', () => {

      beforeEach(async() => {
        // enter a valid query and details, using the mock notify guaranteed failure email, and continue to confirm page
        await page.fill('#query', config.validQuery);
        await page.fill('#applicant-name', config.validName);
        await page.fill('#email', config.notifyFailureEmail);
        await submitPage();

        // submit the query from the confirm page
        await submitPage();
      });

      it('should stay on the \'confirm\' page', async() => {
        expect(await page.url()).to.equal(baseURL + '/confirm');
      });

      it('should display the \'error\' template', async() => {
        const h1 = await page.$('h1');
        expect(await h1.innerText()).to.equal('Sorry, there is a problem with the service');
      });

    });

  });

});
