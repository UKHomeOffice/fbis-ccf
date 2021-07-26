'use strict';

describe('/feedback-submitted', () => {
  beforeEach(async () => {
    // Get to feedback submitted page
    await page.goto(baseURL + '/start');
    await page.waitForLoadState();
    await page.click('a[href="/feedback"]');
    await page.waitForLoadState();

    const radio = await page.$('input[type="radio"]');
    await radio.click();
    await page.fill('#feedbackText', 'Feedback');
    await submitPage();
  });

  describe('FR-FEE-1 (FBISCC-17) - service feedback page', () => {
    describe('when the user has successfully submitted feedback and is viewing confirmation', () => {
      it('should include a header with text \'Feedback sent\'', async () => {
        const header = await page.$('#confirm-heading');
        expect(await header.innerText()).to.equal('Feedback sent');
      });

      it('should include a link to return to the form with the text \'Return to form.\'', async () => {
        const inputLink = await page.$('input[type="submit"]');
        expect(await inputLink.getAttribute('value')).to.equal('Return to form.');
      });
    });
  });
});
