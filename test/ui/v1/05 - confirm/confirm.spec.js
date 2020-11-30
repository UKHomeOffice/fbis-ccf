'use strict';

/* eslint max-len: off */

const config = require('../../ui-test-config');

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
};

describe('/confirm', () => {

  describe('FR-RES-10 (FBISCC-50) - Response confirmation and edit', () => {

    describe('when the user is writing on their own behalf', () => {

      beforeEach(async() => await setUp('id-check', 'No', false, true));

      it('should not display representative details', async() => {
        const h1 = await page.$('h1');
        const h2s = await page.$$('h2');

        expect(await h1.innerText()).to.equal('Check your answers');
        expect(h2s.length).to.equal(3);
        expect(await h2s[0].innerText()).to.equal('Reason for contacting UK Visas and Immigration');
        expect(await h2s[1].innerText()).to.equal('Your details');
        expect(await h2s[2].innerText()).to.equal('Details of the problem');
      });

    });

    describe('when the user is writing on behalf of somebody else', () => {

      beforeEach(async() => await setUp('id-check', 'Yes', false, true));

      it('should display representative details in addition to applicant details', async() => {
        const h1 = await page.$('h1');
        const h2s = await page.$$('h2');

        expect(await h1.innerText()).to.equal('Check your answers');
        expect(h2s.length).to.equal(4);
        expect(await h2s[0].innerText()).to.equal('Reason for contacting UK Visas and Immigration');
        expect(await h2s[1].innerText()).to.equal('Your details');
        expect(await h2s[2].innerText()).to.equal('Applicant\'s details');
        expect(await h2s[3].innerText()).to.equal('Details of the problem');
      });

    });

    describe('when the user does not include optional fields', () => {

      beforeEach(async() => await setUp('status', 'Yes', false, true));

      it('should only display required fields', async() => {
        const labels = await page.$$('.confirm-label');
        const values = await page.$$('.confirm-value');

        expect(labels.length).to.equal(7);
        expect(values.length).to.equal(7);

        expect(await labels[0].innerText()).to.equal('What is your problem about?');
        expect(await labels[1].innerText()).to.equal('Are you contacting us on behalf of someone else?');
        expect(await labels[2].innerText()).to.equal('Name of person filling in the form');
        expect(await labels[3].innerText()).to.equal('Applicant\'s full name');
        expect(await labels[4].innerText()).to.equal('Applicant\'s email address');
        expect(await labels[5].innerText()).to.equal('Applicant\'s unique application number (UAN)');
        expect(await labels[6].innerText()).to.equal('Details of the problem');

        expect(await values[0].innerText()).to.equal('Viewing or proving your immigration status');
        expect(await values[1].innerText()).to.equal('Yes');
        expect(await values[2].innerText()).to.equal(config.validName);
        expect(await values[3].innerText()).to.equal(config.validName);
        expect(await values[4].innerText()).to.equal(config.notifySuccessEmail);
        expect(await values[5].innerText()).to.equal(config.validUAN);
        expect(await values[6].innerText()).to.equal(config.validQuery);
      });

    });

    describe('when the user does include optional fields', () => {

      beforeEach(async() => await setUp('status', 'Yes', true, true));

      it('should also display the included optional fields', async() => {
        const labels = await page.$$('.confirm-label');
        const values = await page.$$('.confirm-value');

        expect(labels.length).to.equal(10);
        expect(values.length).to.equal(10);

        expect(await labels[0].innerText()).to.equal('What is your problem about?');
        expect(await labels[1].innerText()).to.equal('Are you contacting us on behalf of someone else?');
        expect(await labels[2].innerText()).to.equal('Name of person filling in the form');
        expect(await labels[3].innerText()).to.equal('Phone number of person filling in the form');
        expect(await labels[4].innerText()).to.equal('Organisation of person filling in the form');
        expect(await labels[5].innerText()).to.equal('Applicant\'s full name');
        expect(await labels[6].innerText()).to.equal('Applicant\'s email address');
        expect(await labels[7].innerText()).to.equal('Applicant\'s phone number');
        expect(await labels[8].innerText()).to.equal('Applicant\'s unique application number (UAN)');
        expect(await labels[9].innerText()).to.equal('Details of the problem');

        expect(await values[0].innerText()).to.equal('Viewing or proving your immigration status');
        expect(await values[1].innerText()).to.equal('Yes');
        expect(await values[2].innerText()).to.equal(config.validName);
        expect(await values[3].innerText()).to.equal('07000000000');
        expect(await values[4].innerText()).to.equal('Charity');
        expect(await values[5].innerText()).to.equal(config.validName);
        expect(await values[6].innerText()).to.equal(config.notifySuccessEmail);
        expect(await values[7].innerText()).to.equal('07111111111');
        expect(await values[8].innerText()).to.equal(config.validUAN);
        expect(await values[9].innerText()).to.equal(config.validQuery);
      });

    });

    describe('when the user clicks a change link', () => {

      let expectedHrefs;

      beforeEach(async() => {
        await setUp('status', 'Yes', true, true);

        expectedHrefs = [
          '/question/edit#question',
          '/identity/edit#identity',
          '/details/edit#representative-name',
          '/details/edit#representative-phone',
          '/details/edit#organisation',
          '/query/edit#applicant-name',
          '/query/edit#email',
          '/query/edit#applicant-phone',
          '/query/edit#application-number',
          '/query/edit#query'
        ];
      });

      it('should navigate to the page where they can change their input', async() => {
        for (let i = 0; i < expectedHrefs.length; i++) {
          const links = await page.$$('#content a');

          // expect the link to have the right url
          expect(await links[i].getAttribute('href')).to.equal(expectedHrefs[i]);

          // click the link, expect the navigation to succeed, continue back to the confirmation page
          await links[i].click();
          await page.waitForLoadState();
          expect(await page.url()).to.equal(baseURL + expectedHrefs[i]);
          await submitPage();
        }
      });

      describe('when the user makes a change and continues', () => {

        beforeEach(async() => await setUp('status', 'Yes', true, true));

        it('should return to the confirmation page with the new entry included', async() => {
          const updatedValue = 'I have updated my query';

          // find and click the query link
          const queryLink = await page.$('a[href="/query/edit#query"]');
          await queryLink.click();
          await page.waitForLoadState();

          // update the value
          await page.fill('#query', updatedValue);
          await submitPage();

          // check the updated value persists on the confirm page
          expect(await page.url()).to.equal(baseURL + '/confirm#query');
          const values = await page.$$('.confirm-value');
          expect(await values[9].innerText()).to.equal(updatedValue);
        });

      });

      describe('when the user changes their identity from representative to applicant', () => {

        beforeEach(async() => await setUp('status', 'Yes', true, true));

        it('should not show representative details on returning to the confirm page', async() => {
          // find and click the identity link
          const identityLink = await page.$('a[href="/identity/edit#identity"]');
          await identityLink.click();
          await page.waitForLoadState();

          // select identity
          const yesRadio = await page.$('input#identity-No');
          await yesRadio.click();
          await submitPage();

          expect(await page.url()).to.equal(baseURL + '/confirm#identity');

          const h2s = await page.$$('h2');

          expect(h2s.length).to.equal(3);
          expect(await h2s[0].innerText()).to.equal('Reason for contacting UK Visas and Immigration');
          expect(await h2s[1].innerText()).to.equal('Your details');
          expect(await h2s[2].innerText()).to.equal('Details of the problem');
        });

      });

      describe('when the user changes their identity from applicant to representative', () => {

        beforeEach(async() => await setUp('status', 'No', true, true));

        it('should also collect representative details and display them on return to the confirmation page', async() => {
          // find and click the identity link
          const identityLink = await page.$('a[href="/identity/edit#identity"]');
          await identityLink.click();
          await page.waitForLoadState();

          // select identity
          const yesRadio = await page.$('input#identity-Yes');
          await yesRadio.click();
          await submitPage();

          // complete the details page
          await page.fill('#representative-name', config.validName);
          await submitPage();

          expect(await page.url()).to.equal(baseURL + '/confirm#identity');

          const h2s = await page.$$('h2');

          expect(h2s.length).to.equal(4);
          expect(await h2s[0].innerText()).to.equal('Reason for contacting UK Visas and Immigration');
          expect(await h2s[1].innerText()).to.equal('Your details');
          expect(await h2s[2].innerText()).to.equal('Applicant\'s details');
          expect(await h2s[3].innerText()).to.equal('Details of the problem');
        });

      });

    });

  });

  describe('FR-EMA-2 (FBISCC-37) - Emailing SRC', () => {

    describe('when the email sends successfully', () => {

      beforeEach(async() => {
        await setUp('id-check', 'No', false, true);
        await submitPage();
      });

      it('should continue to the \'complete\' page', async() => {
        expect(await page.url()).to.equal(baseURL + '/complete');
      });

    });

    describe('when the email fails to send', () => {

      beforeEach(async() => {
        await setUp('id-check', 'No', false, false);
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
