'use strict';

/* eslint max-len: off */

const config = require('../ui-test-config');

const setUp = async (inUK, question, identity, useOptionalFields, shouldSucceed) => {
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
  if (question !== 'id-check') {
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
  await page.fill('#email', shouldSucceed ? config.validEmail : config.notifyFailureEmail);
  if (useOptionalFields) {
    await page.fill('#phone', '07000000000');
  }
  await submitPage();

  // enter query
  await page.fill('#query', config.validQuery);
  await submitPage();
};

describe('/confirm', () => {
  describe('FR-RES-10 (FBISCC-75) - Response confirmation and edit', () => {
    describe('when the user is writing on their own behalf', () => {
      beforeEach(async () => await setUp(true, 'id-check', 'No', false, true));

      it('should not display representative details section', async () => {
        const h2s = await page.$$('h2');

        expect(h2s.length).to.equal(5);
        expect(await h2s[0].innerText()).to.equal('Reason for contacting UK Visas and Immigration');
        expect(await h2s[1].innerText()).to.equal('Who is filling out this form');
        expect(await h2s[2].innerText()).to.equal('Your details');
        expect(await h2s[3].innerText()).to.equal('Contact details');
        expect(await h2s[4].innerText()).to.equal('Details of the problem');
      });
    });

    describe('when the user is writing on behalf of somebody else', () => {
      beforeEach(async () => await setUp(true, 'id-check', 'Yes', false, true));

      it('should display the representative details section as well as the applicant details section', async () => {
        const h2s = await page.$$('h2');

        expect(h2s.length).to.equal(6);
        expect(await h2s[0].innerText()).to.equal('Reason for contacting UK Visas and Immigration');
        expect(await h2s[1].innerText()).to.equal('Who is filling out this form');
        expect(await h2s[2].innerText()).to.equal('Applicant\'s details');
        expect(await h2s[3].innerText()).to.equal('Your details');
        expect(await h2s[4].innerText()).to.equal('Contact details');
        expect(await h2s[5].innerText()).to.equal('Details of the problem');
      });
    });

    describe('when the user does not include optional fields', () => {
      beforeEach(async () => await setUp(true, 'status', 'Yes', false, true));

      it('should only display required fields', async () => {
        const labels = await page.$$('.confirm-label');
        const values = await page.$$('.confirm-value');

        expect(labels.length).to.equal(9);
        expect(values.length).to.equal(9);

        expect(await labels[0].innerText()).to.equal('What is your problem about?');
        expect(await labels[1].innerText()).to.equal('Are you contacting us on behalf of someone else?');
        expect(await labels[2].innerText()).to.equal('First names');
        expect(await labels[3].innerText()).to.equal('Last names');
        expect(await labels[4].innerText()).to.equal('Unique application number - UAN');
        expect(await labels[5].innerText()).to.equal('First names');
        expect(await labels[6].innerText()).to.equal('Last names');
        expect(await labels[7].innerText()).to.equal('Email address');
        expect(await labels[8].innerText()).to.equal('Details of the problem');

        expect(await values[0].innerText()).to.equal('Viewing or proving your immigration status, right to work or right to rent');
        expect(await values[1].innerText()).to.equal('Yes');
        expect(await values[2].innerText()).to.equal(config.validFirstNames);
        expect(await values[3].innerText()).to.equal(config.validLastNames);
        expect(await values[4].innerText()).to.equal(config.validUAN);
        expect(await values[5].innerText()).to.equal(config.validFirstNames);
        expect(await values[6].innerText()).to.equal(config.validLastNames);
        expect(await values[7].innerText()).to.equal(config.validEmail);
        expect(await values[8].innerText()).to.equal(config.validQuery);
      });
    });

    describe('when the user includes optional fields', () => {
      beforeEach(async () => await setUp(true, 'status', 'Yes', true, true));

      it('should display the included optional fields', async () => {
        const labels = await page.$$('.confirm-label');
        const values = await page.$$('.confirm-value');

        expect(labels.length).to.equal(11);
        expect(values.length).to.equal(11);

        expect(await labels[0].innerText()).to.equal('What is your problem about?');
        expect(await labels[1].innerText()).to.equal('Are you contacting us on behalf of someone else?');
        expect(await labels[2].innerText()).to.equal('First names');
        expect(await labels[3].innerText()).to.equal('Last names');
        expect(await labels[4].innerText()).to.equal('Unique application number - UAN');
        expect(await labels[5].innerText()).to.equal('First names');
        expect(await labels[6].innerText()).to.equal('Last names');
        expect(await labels[7].innerText()).to.equal('Organisation');
        expect(await labels[8].innerText()).to.equal('Email address');
        expect(await labels[9].innerText()).to.equal('Phone number');
        expect(await labels[10].innerText()).to.equal('Details of the problem');

        expect(await values[0].innerText()).to.equal('Viewing or proving your immigration status, right to work or right to rent');
        expect(await values[1].innerText()).to.equal('Yes');
        expect(await values[2].innerText()).to.equal(config.validFirstNames);
        expect(await values[3].innerText()).to.equal(config.validLastNames);
        expect(await values[4].innerText()).to.equal(config.validUAN);
        expect(await values[5].innerText()).to.equal(config.validFirstNames);
        expect(await values[6].innerText()).to.equal(config.validLastNames);
        expect(await values[7].innerText()).to.equal('Charity');
        expect(await values[8].innerText()).to.equal(config.validEmail);
        expect(await values[9].innerText()).to.equal('07000000000');
        expect(await values[10].innerText()).to.equal(config.validQuery);
      });
    });

    describe('when the user accesses the service with the outside-UK link', () => {
      beforeEach(async () => await setUp(false, 'status', 'No', false, true));

      it('should display \'Given names\' and \'Family names\' labels', async () => {
        const labels = await page.$$('.confirm-label');

        expect(await labels[2].innerText()).to.equal('Given names');
        expect(await labels[3].innerText()).to.equal('Family names');
      });
    });

    describe('when the user clicks a change link', () => {
      let expectedHrefs;

      beforeEach(async () => {
        await setUp(true, 'status', 'Yes', true, true);

        expectedHrefs = [
          '/question/edit#question-status',
          '/identity/edit#identity-Yes',
          '/applicant-details/edit#applicant-first-names',
          '/applicant-details/edit#applicant-last-names',
          '/applicant-details/edit#application-number',
          '/representative-details/edit#representative-first-names',
          '/representative-details/edit#representative-last-names',
          '/representative-details/edit#organisation',
          '/contact-details/edit#email',
          '/contact-details/edit#phone',
          '/query/edit#query'
        ];
      });

      it('should navigate to the page where they can change their input', async () => {
        for (let i = 0; i < expectedHrefs.length; i++) {
          const links = await page.$$('a[class="link"]');

          // expect link to have correct url
          expect(await links[i].getAttribute('href')).to.equal(expectedHrefs[i]);

          // click the link, expect navigation to succeed, continue back to confirmation page
          await links[i].click();
          await page.waitForLoadState();
          expect(await page.url()).to.equal(baseURL + expectedHrefs[i]);
          await submitPage();
        }
      });
    });

    describe('when the user makes a change and continues', () => {
      beforeEach(async () => await setUp(true, 'status', 'No', false, true));

      it('should return to the confirmation page with the new entry included', async () => {
        const updatedValue = 'I have updated my query';

        // find and click the query link
        const queryLink = await page.$('a[href="/query/edit#query"]');
        await queryLink.click();
        await page.waitForLoadState();

        // update the value
        await page.fill('#query', updatedValue);
        await submitPage();

        // check the update value is now on the confirm page
        expect(await page.url()).to.equal(baseURL + '/confirm#query');
        const values = await page.$$('.confirm-value');
        expect(await values[6].innerText()).to.equal(updatedValue);
      });
    });

    describe('when the user changes their identity from representative to applicant', () => {
      beforeEach(async () => await setUp(true, 'status', 'Yes', false, true));

      it('should not show representative details', async () => {
        // find and click identity link
        const identityLink = await page.$('a[href="/identity/edit#identity-Yes"]');
        await identityLink.click();
        await page.waitForLoadState();

        // select identity
        const noRadio = await page.$('#identity-No');
        await noRadio.click();
        await submitPage();

        expect(await page.url()).to.equal(baseURL + '/confirm#identity-Yes');

        const h2s = await page.$$('h2');

        expect(h2s.length).to.equal(5);
        expect(await h2s[0].innerText()).to.equal('Reason for contacting UK Visas and Immigration');
        expect(await h2s[1].innerText()).to.equal('Who is filling out this form');
        expect(await h2s[2].innerText()).to.equal('Your details');
        expect(await h2s[3].innerText()).to.equal('Contact details');
        expect(await h2s[4].innerText()).to.equal('Details of the problem');
      });
    });

    describe('when the user changes their identity from applicant to representative', () => {
      beforeEach(async () => await setUp(true, 'status', 'No', false, true));

      it('should collect the representative details and display them on the confirmation page', async () => {
        // find and click identity link
        const identityLink = await page.$('a[href="/identity/edit#identity-No"]');
        await identityLink.click();
        await page.waitForLoadState();

        // select identity
        const yesRadio = await page.$('#identity-Yes');
        await yesRadio.click();
        await submitPage();

        // complete the representative details page
        await page.fill('#representative-first-names', config.validFirstNames);
        await page.fill('#representative-last-names', config.validLastNames);
        await submitPage();

        expect(await page.url()).to.equal(baseURL + '/confirm#identity-No');

        const h2s = await page.$$('h2');

        expect(h2s.length).to.equal(6);
        expect(await h2s[0].innerText()).to.equal('Reason for contacting UK Visas and Immigration');
        expect(await h2s[1].innerText()).to.equal('Who is filling out this form');
        expect(await h2s[2].innerText()).to.equal('Applicant\'s details');
        expect(await h2s[3].innerText()).to.equal('Your details');
        expect(await h2s[4].innerText()).to.equal('Contact details');
        expect(await h2s[5].innerText()).to.equal('Details of the problem');
      });
    });

    describe('when the user changes their question category from \'status\' to \'id check\'', () => {
      beforeEach(async () => await setUp(true, 'status', 'No', true, true));

      it('should not show the UAN field', async () => {
        // when question category is status assert UAN field is shown
        let fields = await page.$$('.confirm-label');
        expect(fields.length).to.equal(8);
        expect(await fields[4].innerText()).to.equal('Unique application number - UAN');

        // find and click question link
        const questionLink = await page.$('a[href="/question/edit#question-status"]');
        await questionLink.click();
        await page.waitForLoadState();

        // select id-check
        const idCheckRadio = await page.$('#question-id-check');
        await idCheckRadio.click();
        await submitPage();

        expect(await page.url()).to.equal(baseURL + '/confirm#question-status');

        fields = await page.$$('.confirm-label');
        expect(fields.length).to.equal(7);
        expect(await fields[0].innerText()).to.not.equal('Unique application number - UAN');
        expect(await fields[1].innerText()).to.not.equal('Unique application number - UAN');
        expect(await fields[2].innerText()).to.not.equal('Unique application number - UAN');
        expect(await fields[3].innerText()).to.not.equal('Unique application number - UAN');
        expect(await fields[4].innerText()).to.not.equal('Unique application number - UAN');
        expect(await fields[5].innerText()).to.not.equal('Unique application number - UAN');
        expect(await fields[6].innerText()).to.not.equal('Unique application number - UAN');
      });
    });

    describe('when the user changes their question category from \'id check\' to \'status\'', () => {
      beforeEach(async () => await setUp(true, 'id-check', 'No', true, true));

      it('should collect the UAN field on the applicant details page', async () => {
        // find and click question link
        const questionLink = await page.$('a[href="/question/edit#question-id-check"]');
        await questionLink.click();
        await page.waitForLoadState();

        // select status
        const idCheckRadio = await page.$('#question-status');
        await idCheckRadio.click();
        await submitPage();

        expect(await page.url()).to.equal(baseURL + '/applicant-details/edit#question-id-check');
      });
    });
  });

  describe('FR-EMA-2 (FBISCC-37) - Emailing SRC', () => {
    describe('when the email sends successfully', () => {
      beforeEach(async () => {
        await setUp(true, 'id-check', 'No', true, true);
        await submitPage();
      });

      it('should continue to the \'complete\' page', async () => {
        expect(await page.url()).to.equal(baseURL + '/complete');
      });
    });

    describe('when the email fails to send', () => {
      beforeEach(async () => {
        await setUp(true, 'id-check', 'No', true, false);
        await submitPage();
      });

      it('should stay on the \'confirm\' page', async () => {
        expect(await page.url()).to.equal(baseURL + '/confirm');
      });

      it('should display the \'error\' template', async () => {
        const h1 = await page.$('h1');
        expect(await h1.innerText()).to.equal('Sorry, your form has not been sent');
      });
    });
  });
});
