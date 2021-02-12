'use strict';

const config = require('../ui-test-config');

const setUp = async(inUK, question, identity, useOptionalFields) => {
  await page.goto(baseURL + '/start' + (inUK ? '' : '?outside-UK'));
  await submitPage();

  // select a question category
  const questionRadio = await page.$(`input#question-${question}`);
  await questionRadio.click();
  await submitPage();

  // select identity
  const identityRadio = await page.$(`input#identity-${identity}`);
  await identityRadio.click();
  await submitPage();

  // fill applicant details
  await page.fill('#applicant-first-names', config.validFirstNames);
  await page.fill('#applicant-last-names', config.validLastNames);
  if (useOptionalFields && question !== 'id-check') {
    await page.fill('#application-number', config.validUAN);
  }
  await submitPage();

  // fill representative details page if applicable
  if (identity === 'Yes') {
    await page.fill('#representative-first-names', config.validFirstNames);
    await page.fill('#representative-last-names', config.validLastNames);
    if (useOptionalFields) {
      await page.fill('#organisation', 'Charity');
    }
  }
  await submitPage();

  // fill contact details
  await page.fill('#email', config.validEmail);
  if (useOptionalFields) {
    await page.fill('#phone', '07000000000');
  }
  await submitPage();

  // enter query
  await page.fill('#query', config.validQuery);
  await submitPage();

  // confirm responses and send email
  await submitPage();
};

describe('/complete', () => {

  describe('FR-POS-11 (FBISCC-63) - Submission confirmation page', () => {

    describe('when the user has successfully submitted their query and is viewing confirmation', () => {

      beforeEach(async() => await setUp(true, 'id-check', 'No', false));

      it('should include a header with text \'Form sent\'', async() => {
        const header = await page.$('#confirm-heading');

        expect(await header.innerText()).to.equal('Form sent');
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

