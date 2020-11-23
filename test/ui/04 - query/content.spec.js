'use strict';

/* eslint max-len: off */

const config = require('../ui-test-config');

const setUp = async(question, identity) => {
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
    await submitPage();
  }
};

describe('/query - content', () => {

  describe('FR-FOR-5 (FBISCC-24) - Chip Checker UI', () => {

    beforeEach(async() => await setUp('id-check', 'No'));

    describe('when user selects id-check question category and navigates to the query page', () => {

      it('should include a header with text \'Tell us about a problem with the \'ID check\' app\'', async() => {
        const header = await page.$('h1');
        expect(await header.innerText()).to.equal('Tell us about a problem with the \'ID check\' app');
      });

      it('should include a text area with label \'Give a detailed description of the problem\'', async() => {
        const textArea = await page.$('textarea#query');
        const label = await page.$('label[for="query"]');

        const expected = 'Give a detailed description of the problem';

        expect(textArea).to.not.equal(undefined);
        expect(label).to.not.equal(undefined);
        expect((await label.innerText()).includes(expected)).to.equal(true);
      });

      it('should include three text input fields with the correct labels', async() => {
        const textInputs = await page.$$('input[type="text"]');
        const labels = await page.$$('.form-group label');

        expect(textInputs.length).to.equal(3);
        expect(labels.length).to.equal(4);

        expect(await labels[1].innerText()).to.equal('Full name');
        expect(await labels[2].innerText()).to.equal('Email address');
        expect(await labels[3].innerText()).to.equal('Phone number (optional)');
      });

    });

  });

  describe('FR-FOR-6 (FBISCC-25) - Access my status UI', () => {

    beforeEach(async() => await setUp('status', 'No'));

    describe('when user selects status question category and navigates to the query page', () => {

      it('should include a header with text \'Tell us about a problem viewing or proving your immigration status\'', async() => {
        const header = await page.$('h1');
        expect(await header.innerText()).to.equal('Tell us about a problem viewing or proving your immigration status');
      });

      it('should include a text area with label \'Give a detailed description of the problem\'', async() => {
        const textArea = await page.$('textarea#query');
        const label = await page.$('label[for="query"]');

        const expected = 'Give a detailed description of the problem';

        expect(textArea).to.not.equal(undefined);
        expect(label).to.not.equal(undefined);
        expect((await label.innerText()).includes(expected)).to.equal(true);
      });

      it('should include four text input fields with the correct labels', async() => {
        const textInputs = await page.$$('input[type="text"]');
        const labels = await page.$$('.form-group label');

        expect(textInputs.length).to.equal(4);
        expect(labels.length).to.equal(5);


        expect(await labels[1].innerText()).to.equal('Full name');
        expect(await labels[2].innerText()).to.equal('Email address');
        expect(await labels[3].innerText()).to.equal('Phone number (optional)');
        expect((await labels[4].innerText()).includes('Unique application number (UAN)')).to.equal(true);
        expect((await labels[4].innerText()).includes('For example, 3434-0000-0000-0001')).to.equal(true);
      });

    });

  });

  describe('FR-FOR-7 (FBISCC-26) - Update my details UI', () => {

    beforeEach(async() => await setUp('account', 'No'));

    describe('when user selects account question category and navigates to the query page', () => {

      it('should include a header with text \'Tell us about a problem updating your immigration account details\'', async() => {
        const header = await page.$('h1');
        expect(await header.innerText()).to.equal('Tell us about a problem updating your immigration account details');
      });

      it('should include a text area with label \'Give a detailed description of the problem\'', async() => {
        const textArea = await page.$('textarea#query');
        const label = await page.$('label[for="query"]');

        const expected = 'Give a detailed description of the problem';

        expect(textArea).to.not.equal(undefined);
        expect(label).to.not.equal(undefined);
        expect((await label.innerText()).includes(expected)).to.equal(true);
      });

      it('should include four text input fields with the correct labels', async() => {
        const textInputs = await page.$$('input[type="text"]');
        const labels = await page.$$('.form-group label');

        expect(textInputs.length).to.equal(4);
        expect(labels.length).to.equal(5);


        expect(await labels[1].innerText()).to.equal('Full name');
        expect(await labels[2].innerText()).to.equal('Email address');
        expect(await labels[3].innerText()).to.equal('Phone number (optional)');
        expect((await labels[4].innerText()).includes('Unique application number (UAN)')).to.equal(true);
        expect((await labels[4].innerText()).includes('For example, 3434-0000-0000-0001')).to.equal(true);
      });

    });

  });

  describe('FR-REP-4 (FBISCC-33) - Collecting Representative\'s details', () => {

    describe('when user selects \'Yes\' on the identity page', () => {

      beforeEach(async() => await setUp('status', 'Yes'));

      it('should pre-pend \'Applicant\'s\' to the text input labels for name, email, phone, and UAN', async() => {

        const textInputs = await page.$$('input[type="text"]');
        const labels = await page.$$('.form-group label');

        expect(textInputs.length).to.equal(4);
        expect(labels.length).to.equal(5);


        expect(await labels[1].innerText()).to.equal('Applicant\'s full name');
        expect(await labels[2].innerText()).to.equal('Applicant\'s email address');
        expect(await labels[3].innerText()).to.equal('Applicant\'s phone number (optional)');
        expect((await labels[4].innerText()).includes('Applicant\'s unique application number (UAN)')).to.equal(true);
      });

    });

  });

});
