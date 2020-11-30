'use strict';

const config = require('../../ui-test-config');

describe('/query - character count', () => {

  describe('NFR-FOR-22 (FBISCC-44) - 2000 character query count limit', () => {

    beforeEach(async() => {
      await page.goto(baseURL + '/landing');
      await submitPage();

      // select any question category and continue
      const radios = await page.$$('input[type="radio"]');
      await radios[0].click();
      await submitPage();

      // select 'No', not contacting us on behalf of somebody else, and continue
      const no = await page.$('input#identity-No');
      await no.click();
      await submitPage();
    });

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
        await page.fill('#applicant-name', config.validName);
        await page.fill('#email', config.validEmail);
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
