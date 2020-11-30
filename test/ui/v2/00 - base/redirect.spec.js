'use strict';

describe('Base url', () => {

  describe('DEV (FBISCC-46) - Base url page redirect', () => {

    it('should redirect to the question page', async() => {
      await page.goto(baseURL);

      const header = await page.$('h1');
      const submit = await getSubmit();

      expect(await page.title()).to.equal('What is your technical problem about? – GOV.UK');
      expect(await page.url()).to.equal(baseURL + '/question');
      expect(await header.innerText()).to.equal('What is your technical problem about?');
      expect(await submit.getAttribute('value')).to.equal('Continue');
    });

  });

});
