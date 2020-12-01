'use strict';

/* eslint max-len: off */

const config = require('../../ui-test-config');

const setUp = async(inUK, question, identity) => {
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
  await submitPage();
};

describe('/representative-details - content', () => {

  describe('FR-REP-4 (FBISCC-69) - Representative details', () => {

    describe('when the user accesses the service with the in-UK link', () => {

      beforeEach(async() => await setUp(true, 'id-check', 'Yes'));

      describe('when user inputs the applicants details and continues to the representative details page', () => {

        it('should include a header with text \'Your details\'', async() => {
          const header = await page.$('h1');
          expect(await header.innerText()).to.equal('Your details');
        });

        it('should include a hint with text \'Details of person filling out this form\'', async() => {
          const hint = await page.$('#representative-name-hint');
          expect(await hint.innerText()).to.equal('Details of the person filling out this form');
        });

        it('should include three text input fields with labels \'First names\', \'Last names\' and \'Organisation (optional)\'', async() => {
          const textInputs = await page.$$('input[type="text"]');
          const labels = await page.$$('.form-group label');

          expect(textInputs.length).to.equal(3);
          expect(labels.length).to.equal(3);

          expect(await labels[0].innerText()).to.equal('First names');
          expect(await labels[1].innerText()).to.equal('Last names');
          expect(await labels[2].innerText()).to.equal('Organisation name (optional)');
        });

      });

    });

    describe('when the user accesses the service with the outside-UK link', () => {

      beforeEach(async() => await setUp(false, 'id-check', 'Yes'));

      describe('when user inputs the applicants details and continues to the representative details page', () => {

        it('should include three text input fields with the labels \'Given names\', \'Family names\' and \'Organisation (optional)\'', async() => {
          const textInputs = await page.$$('input[type="text"]');
          const labels = await page.$$('.form-group label');

          expect(textInputs.length).to.equal(3);
          expect(labels.length).to.equal(3);

          expect(await labels[0].innerText()).to.equal('Given names');
          expect(await labels[1].innerText()).to.equal('Family names');
          expect(await labels[2].innerText()).to.equal('Organisation name (optional)');
        });

      });

    });

  });

});
