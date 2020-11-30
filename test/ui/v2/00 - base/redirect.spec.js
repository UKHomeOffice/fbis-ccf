'use strict';

describe('base url', () => {

  describe('DEV (FBISCC-46) - Base url page redirect', () => {

    it('should redirect to the question page', async() => {
      await page.goto(baseURL);
      expect(await page.url()).to.equal(baseURL + '/question');
    });

  });

});
