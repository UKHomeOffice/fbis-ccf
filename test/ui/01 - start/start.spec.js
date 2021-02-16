'use strict';

/* eslint max-len: off */

describe('/start', () => {

  describe('FR-CAT-27 (FBISCC-73) - Start screen', () => {

    describe('when user accesses the service', () => {

      beforeEach(async() => await page.goto(baseURL + '/start'));

      it('should include a header with text \'Help with the \'ID Check\' app or your online immigration account\'', async() => {
        const header = await page.$('h1');
        expect(await header.innerText()).to.equal('Help with the \'ID Check\' app or your online immigration account');
      });

      it('should include a list of use cases for the service with text \'Use this service to get help with:\'', async() => {
        const listText = await page.$$('#start-info > p');
        expect(await listText[0].innerText()).to.equal('Use this service to get help with:');
      });

      it('should include list of use cases for the service', async() => {
        const list = await page.$$('#start-uses-1 > li');
        expect((await list[0].innerText()).includes('using the \'UK Immigration: ID Check\' app')).to.equal(true);
        expect((await list[1].innerText()).includes('viewing and proving your immigration status, right to work, or right to rent online')).to.equal(true);
        expect((await list[2].innerText()).includes('updating your UK Visas and Immigration account details')).to.equal(true);
      });

      it('should include a list of visa types applicable with text \'You can only use this service if you have applied:\'', async() => {
        const listText = await page.$$('#start-info > p');
        expect(await listText[1].innerText()).to.equal('You can only use this service if you have applied:');
      });

      it('should include a list of visa types applicable for the service', async() => {
        const list = await page.$$('#start-uses-2 > li');
        expect((await list[0].innerText()).includes('to work and study in the UK')).to.equal(true);
        expect((await list[1].innerText()).includes('for a Hong Kong BNO visa application')).to.equal(true);
      });

      it('should include a link for users of the EU settlement scheme', async() => {
        const listText = await page.$$('#start-info > p');
        expect(await listText[2].innerText()).to.equal('There\'s a different way to contact us if you are applying to the EU Settlement Scheme');
      });

      it('should link users to the correct external URL', async() => {
        const link = await page.$('a[href="https://www.gov.uk/contact-ukvi-inside-outside-uk/y/inside-the-uk/eu-settlement-scheme-frontier-worker-or-service-provider-from-switzerland-visa-applications"]');
        await link.click();
        await page.waitForLoadState();

        const externalTitle = await page.$('h1');
        expect(await externalTitle.innerText()).to.equal('EU Settlement Scheme, Frontier Worker or Service Provider from Switzerland visa applications');
      });

      it('should include a list things the user needs to fill out the form', async() => {
        const list = await page.$$('#start-requirements > li');
        expect((await list[0].innerText()).includes('the applicant\'s name')).to.equal(true);
        expect((await list[1].innerText()).includes('the email address that was used in the application - this is the email address that the confirmation email was sent to')).to.equal(true);
        expect((await list[2].innerText()).includes('the 16-digit unique application number (UAN)')).to.equal(true);
        expect((await list[3].innerText()).includes('your name if you are filling this form out for someone else')).to.equal(true);
      });

      it('should include a time-out warning message', async() => {
        const timeout = await page.$('.notice > strong');
        expect(await timeout.innerText()).to.equal('This service will time out after 30 minutes if there is no activity and you will have to start again. This is to protect your personal information.');
      });

    });

  });

});
