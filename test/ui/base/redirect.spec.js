'use strict';

describe('Base url', () => {

  describe('DEV (FBISCC-46)', () => {

    it('should redirect to the landing page', async()=> {
      await page.goto(baseURL);

      const header = await page.$('h1');
      const submit = await page.$('input[type="submit"]');

      expect(await page.title()).to.equal('FBIS technical advice – GOV.UK');
      expect(await page.url()).to.equal(baseURL + '/landing');
      expect(await header.innerText()).to.equal('FBIS technical advice');
      expect(await submit.getAttribute('value')).to.equal('Start');
    });

  });

});
