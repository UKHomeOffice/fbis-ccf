'use strict';

const config = require('../ui-test-config');

const setUp = async(question, identity, useOptionalFields, shouldSucceed) => {
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

    // complete optional details fields if required
    if (useOptionalFields) {
      await page.fill('#representative-phone', '07000000000');
      await page.fill('#organisation', 'Charity');
    }

    await submitPage();
  }

  // complete mandatory query fields
  await page.fill('#query', config.validQuery);
  await page.fill('#applicant-name', config.validName);
  await page.fill('#email', shouldSucceed ? config.notifySuccessEmail : config.notifyFailureEmail);

  // add UAN if required
  if (question !== 'id-check') {
    await page.fill('#application-number', config.validUAN);
  }

  // complete optional query fields if required
  if (useOptionalFields) {
    await page.fill('#applicant-phone', '07111111111');
  }

  await submitPage();
  // submit query from 'check your answers' page
  await submitPage();
};

describe('/complete', () => {

  describe('FR-POS-11 (FBISCC-63) - Submission confirmation page', () => {

    describe('when the user has successfully submitted their query and is viewing confirmation', () => {

      beforeEach(async() => await setUp('id-check', 'No', false, true));

      it('should include a header with text \'Form sent\'', async() => {
        const header = await page.$('#confirm-heading');

        expect(await header.innerText()).to.equal('Form sent');
      });

      it('should include text \'We have sent a confirmation email to [provided email]\'', async() => {
        const text = await page.$('#confirm-text');
        const email = await page.$('#confirm-email');

        expect(await text.innerText()).to.equal('We have sent a confirmation email to');
        expect(await email.innerText()).to.equal(config.notifySuccessEmail);
      });

      it('should include a section titled \'What happens next\'', async() => {
        const nextSection = await page.$('#next-heading');
        expect(await nextSection.innerText()).to.equal('What happens next');
      });

      it('should include a link to the feedback page with text \'What did you think of this service?\'', async() => {
        const whatHappensNextPs = await page.$$('#what-happens-next > p');
        const expected = '<a href="/feedback">What did you think of this service?</a>';
        expect(await whatHappensNextPs[2].innerHTML()).to.include(expected);
      });

    });

  });

});
