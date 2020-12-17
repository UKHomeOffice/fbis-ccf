'use strict';

const config = require('../ui-test-config');

describe('/feedback', () => {

  beforeEach(async() => {
    // Go to feedback page
    await page.goto(baseURL + '/question');
    await page.waitForLoadState();
    await page.click('a[href="/feedback"]');
    await page.waitForLoadState();
  });

  describe('FR-FEE-1 (FBISCC-17) - service feedback page', () => {

    describe('content', () => {

      it('should include header with text \'Give feedback\'', async() => {
        const header = await page.$('h1');
        expect(await header.innerText()).to.equal('Give feedback');
      });

      it('should include five radio buttons with satisfaction ratings', async() => {
        const radios = await page.$$('input[type="radio"]');
        const labels = await page.$$('.block-label');

        expect(radios.length).to.equal(5);
        expect(labels.length).to.equal(5);

        expect(await labels[0].innerText()).to.equal('Very satisfied');
        expect(await labels[1].innerText()).to.equal('Satisfied');
        expect(await labels[2].innerText()).to.equal('Neither satisfied or dissatisfied');
        expect(await labels[3].innerText()).to.equal('Dissatisfied');
        expect(await labels[4].innerText()).to.equal('Very dissatisfied');
      });

      it('should include a textarea for written feedback with a hint', async() => {
        const feedbackLabel = await page.$('#feedbackText-group .form-label');
        const expectedLabel = 'Tell us how we could improve this service';
        // eslint-disable-next-line max-len
        const expectedHint = 'Do not include any personal information - for example, your unique application number (UAN)';

        expect((await feedbackLabel.innerText()).includes(expectedLabel)).to.equal(true);
        expect((await feedbackLabel.innerText()).includes(expectedHint)).to.equal(true);
      });

      it('should include an input field for the users email', async() => {
        const labels = await page.$('.label-text');
        const inputs = await page.$$('input[type="text"]');

        expect(inputs.length).to.equal(1);
        expect(await labels.innerText()).to.equal('Email address (optional)');
      });

    });

    describe('field validation', () => {

      describe('when the user attempts to send feedback without selecting a rating', () => {

        it('should stay on the feedback page, display an error message and an error summary', async() => {
          await page.fill('#feedbackText', config.validQuery);
          await page.fill('#feedbackEmail', config.validEmail);
          await submitPage();

          const errorSummaries = await getErrorSummaries();
          const errorMessages = await getErrorMessages();

          const expected = 'Select how you feel about the service you received';

          expect(await page.url()).to.equal(baseURL + '/feedback');
          expect(errorSummaries.length).to.equal(1);
          expect(await errorSummaries[0].innerText()).to.equal(expected);
          expect(errorMessages.length).to.equal(1);
          expect(await errorMessages[0].innerText()).to.equal(expected);
        });
      });

      describe('when the user attempts to send feedback without any improvements', async() => {

        it('should stay on the feedback page, display an error message and an error summary', async() => {
          const radios = await page.$$('input[type="radio"]');
          await radios[0].click();
          await page.fill('#feedbackEmail', config.validEmail);
          await submitPage();

          const errorSummaries = await getErrorSummaries();
          const errorMessages = await getErrorMessages();

          const expected = 'Enter feedback';

          expect(await page.url()).to.equal(baseURL + '/feedback');
          expect(errorSummaries.length).to.equal(1);
          expect(await errorSummaries[0].innerText()).to.equal(expected);
          expect(errorMessages.length).to.equal(1);
          expect(await errorMessages[0].innerText()).to.equal(expected);
        });

      });

      describe('when the user attempts to send feedback with an invalid email', async() => {

        it('should stay on the feedback page, display an error message and an error summary', async() => {
          const radios = await page.$$('input[type="radio"]');
          await radios[0].click();
          await page.fill('#feedbackText', config.validQuery);
          await page.fill('#feedbackEmail', config.invalidEmail);
          await submitPage();

          const errorSummaries = await getErrorSummaries();
          const errorMessages = await getErrorMessages();

          const expected = 'Enter a valid email address';

          expect(await page.url()).to.equal(baseURL + '/feedback');
          expect(errorSummaries.length).to.equal(1);
          expect(await errorSummaries[0].innerText()).to.equal(expected);
          expect(errorMessages.length).to.equal(1);
          expect(await errorMessages[0].innerText()).to.equal(expected);
        });

      });

      describe('when the user attempts to send feedback with no email', () => {

        it('should continue to the feedback submitted page', async() => {
          const radios = await page.$$('input[type="radio"]');
          await radios[0].click();
          await page.fill('#feedbackText', config.validQuery);
          await submitPage();
          // valid so page will be submitted page
          expect(await page.url()).to.equal(baseURL + '/feedback-submitted');
        });

      });

    });

    describe('when the user submits the feedback page with valid rating and text', () => {

      describe('when the email sends successfully', () => {

        beforeEach(async() => {
          // Select radio button and input valid feedback text, mock email success and continue to next page
          const radios = await page.$$('input[type="radio"]');
          await radios[0].click();
          await page.fill('#feedbackText', config.validQuery);
          await page.fill('#feedbackEmail', config.notifySuccessEmail);
          await submitPage();
        });

        it('should continue to the \'feedback-submitted\' page', async() => {
          expect(await page.url()).to.equal(baseURL + '/feedback-submitted');
        });

      });

      describe('when the email fails to send', () => {

        beforeEach(async() => {
          // Select radio button and input valid feedback text, mock email failure and attempt to continue to next page
          const radios = await page.$$('input[type="radio"]');
          await radios[0].click();
          await page.fill('#feedbackText', config.validQuery);
          await page.fill('#feedbackEmail', config.notifyFailureEmail);
          await submitPage();
        });

        it('should stay on the \'feedback\' page', async() => {
          expect(await page.url()).to.equal(baseURL + '/feedback');
        });

        it('should display the \'error\' template', async() => {
          const h1 = await page.$('h1');
          expect(await h1.innerText()).to.equal('Sorry, there is a problem with this service');
        });

      });

    });

  });

});
