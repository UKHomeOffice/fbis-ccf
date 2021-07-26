'use strict';

/* eslint max-len: off */

const setUp = async (inUK, question, identity) => {
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
};

describe('/applicant-details - content', () => {
  describe('FR-FOR-5 (FBISCC-24) - Chip Checker UI', () => {
    describe('when the user accesses the service with the in-UK link', () => {
      beforeEach(async () => await setUp(true, 'id-check', 'No'));

      describe('when user selects id-check question category and navigates to the applicant details page', () => {
        it('should include a header with text \'Your name\'', async () => {
          const header = await page.$('h1');
          expect(await header.innerText()).to.equal('Your name');
        });

        it('should include two text input fields with labels \'First names\' and \'Last names\'', async () => {
          const textInputs = await page.$$('input[type="text"]');
          const labels = await page.$$('.form-group label');

          expect(textInputs.length).to.equal(2);
          expect(labels.length).to.equal(2);

          expect(await labels[0].innerText()).to.equal('First names');
          expect(await labels[1].innerText()).to.equal('Last names');
        });
      });
    });

    describe('when the user accesses the service with the outside-UK link', () => {
      beforeEach(async () => await setUp(false, 'id-check', 'No'));

      describe('when user selects id-check question category and navigates to the applicant details page', () => {
        it('should include two text input fields with labels \'Given names\' and \'Family names\'', async () => {
          const textInputs = await page.$$('input[type="text"]');
          const labels = await page.$$('.form-group label');

          expect(textInputs.length).to.equal(2);
          expect(labels.length).to.equal(2);

          expect(await labels[0].innerText()).to.equal('Given names');
          expect(await labels[1].innerText()).to.equal('Family names');
        });
      });
    });
  });

  describe('FR-FOR-6 (FBISCC-25) - Access my status UI', () => {
    describe('when the user accesses the service with the in-UK link', () => {
      beforeEach(async () => await setUp(true, 'status', 'No'));

      describe('when user selects id-check question category and navigates to the applicant details page', () => {
        it('should include a header with text \'Your details\'', async () => {
          const header = await page.$('h1');
          expect(await header.innerText()).to.equal('Your details');
        });

        it('should include two text input fields with labels \'First names\' and \'Last names\'', async () => {
          const textInputs = await page.$$('input[type="text"]');
          const labels = await page.$$('.form-group label');

          expect(textInputs.length).to.equal(3);
          expect(labels.length).to.equal(3);

          expect(await labels[0].innerText()).to.equal('First names');
          expect(await labels[1].innerText()).to.equal('Last names');
        });

        it('should include a text input field for the Unique Application Number (UAN)', async () => {
          const textInputs = await page.$$('input[type="text"]');
          const labels = await page.$$('.form-group label');

          expect(textInputs.length).to.equal(3);
          expect(labels.length).to.equal(3);

          expect((await labels[2].innerText()).includes('Unique application number - UAN')).to.equal(true);
          expect((await labels[2].innerText()).includes('For example, 3434-0000-0000-0001')).to.equal(true);
        });
      });
    });

    describe('when the user accesses the service with the outside-UK link', () => {
      beforeEach(async () => await setUp(false, 'status', 'No'));

      describe('when user selects id-check question category and navigates to the applicant details page', () => {
        it('should include two text input fields with labels \'Given names\' and \'Family names\'', async () => {
          const textInputs = await page.$$('input[type="text"]');
          const labels = await page.$$('.form-group label');

          expect(textInputs.length).to.equal(3);
          expect(labels.length).to.equal(3);

          expect(await labels[0].innerText()).to.equal('Given names');
          expect(await labels[1].innerText()).to.equal('Family names');
        });
      });
    });
  });

  describe('FR-FOR-7 (FBISCC-26) - Update my details UI', () => {
    describe('when the user accesses the service with the in-UK link', () => {
      beforeEach(async () => await setUp(true, 'account', 'No'));

      describe('when user selects id-check question category and navigates to the applicant details page', () => {
        it('should include a header with text \'Your details\'', async () => {
          const header = await page.$('h1');
          expect(await header.innerText()).to.equal('Your details');
        });

        it('should include two text input fields with labels \'First names\' and \'Last names\'', async () => {
          const textInputs = await page.$$('input[type="text"]');
          const labels = await page.$$('.form-group label');

          expect(textInputs.length).to.equal(3);
          expect(labels.length).to.equal(3);

          expect(await labels[0].innerText()).to.equal('First names');
          expect(await labels[1].innerText()).to.equal('Last names');
        });

        it('should include a text input field for the Unique Application Number (UAN)', async () => {
          const textInputs = await page.$$('input[type="text"]');
          const labels = await page.$$('.form-group label');

          expect(textInputs.length).to.equal(3);
          expect(labels.length).to.equal(3);

          expect((await labels[2].innerText()).includes('Unique application number - UAN')).to.equal(true);
          expect((await labels[2].innerText()).includes('For example, 3434-0000-0000-0001')).to.equal(true);
        });
      });
    });

    describe('when the user accesses the service with the outside-UK link', () => {
      beforeEach(async () => await setUp(false, 'account', 'No'));

      describe('when user selects id-check question category and navigates to the applicant details page', () => {
        it('should include two text input fields with labels \'Given names\' and \'Family names\'', async () => {
          const textInputs = await page.$$('input[type="text"]');
          const labels = await page.$$('.form-group label');

          expect(textInputs.length).to.equal(3);
          expect(labels.length).to.equal(3);

          expect(await labels[0].innerText()).to.equal('Given names');
          expect(await labels[1].innerText()).to.equal('Family names');
        });
      });
    });
  });

  describe('FR-REP-4 (FBISCC-33) - Collecting representative\'s details', () => {
    describe('when user selects \'Yes\' on the identity page', () => {
      beforeEach(async () => await setUp(true, 'id-check', 'Yes'));

      it('should include a header with text \'Applicant\' details\'', async () => {
        const header = await page.$('h1');
        expect(await header.innerText()).to.equal('Applicant\'s details');
      });
    });
  });
});
