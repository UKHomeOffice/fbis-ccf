'use strict';

/* eslint max-len: off */

const config = require('../../ui-test-config');

const setUp = async(inUK, question, identity, useOptionalFields) => {
  await page.goto(baseURL + '/question' + (inUK ? '' : '?outside-UK'));

  // select a question category
  const questionRadio = await page.$(`input#question-${question}`);
  await questionRadio.click();
  await submitPage();

  // submit the context page, which requires no input
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
};

describe.only('/confirm', () => {

  describe('FR-RES-10 (FBISCC-75) - Response confirmation and edit', () => {

    describe('when the user is writing on their own behalf', () => {

      beforeEach(async() => await setUp(true, 'id-check', 'No', false));

      it('should not display representative details section', async() => {
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

      beforeEach(async() => await setUp(true, 'id-check', 'Yes', false));

      it('should display the representative details section as well as with the applicants details section', async() => {
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

      beforeEach(async() => await setUp(true, 'status', 'Yes', false));

      it('should only display required fields', async() => {
        const labels = await page.$$('.confirm-label');
        const values = await page.$$('.confirm-value');

        expect(labels.length).to.equal(8);
        expect(values.length).to.equal(8);

        expect(await labels[0].innerText()).to.equal('What is your problem about?');
        expect(await labels[1].innerText()).to.equal('Are you contacting us on behalf of someone else?');
        expect(await labels[2].innerText()).to.equal('First names');
        expect(await labels[3].innerText()).to.equal('Last names');
        expect(await labels[4].innerText()).to.equal('First names');
        expect(await labels[5].innerText()).to.equal('Last names');
        expect(await labels[6].innerText()).to.equal('Email address');
        expect(await labels[7].innerText()).to.equal('Details of the problem');

        expect(await values[0].innerText()).to.equal('Viewing or proving your immigration status, right to work or right to rent');
        expect(await values[1].innerText()).to.equal('Yes');
        expect(await values[2].innerText()).to.equal(config.validFirstNames);
        expect(await values[3].innerText()).to.equal(config.validLastNames);
        expect(await values[4].innerText()).to.equal(config.validFirstNames);
        expect(await values[5].innerText()).to.equal(config.validLastNames);
        expect(await values[6].innerText()).to.equal(config.validEmail);
        expect(await values[7].innerText()).to.equal(config.validQuery);
      });

    });

    describe('when the user includes optional fields', () => {

      beforeEach(async() => await setUp(true, 'status', 'Yes', true));

      it('should display the included optional fields', async() => {
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

    describe('when the user access the service with the outside-UK link', () => {

      beforeEach(async() => await setUp(false, 'status', 'No', false));

      it('should display \'Given names\' and \'Family names\' labels', async() => {
        const labels = await page.$$('.confirm-label');

        expect(await labels[2].innerText()).to.equal('Given names');
        expect(await labels[3].innerText()).to.equal('Family names');
      });

    });

  });

});
