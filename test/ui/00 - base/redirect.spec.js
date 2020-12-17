'use strict';

/* eslint max-len: off */

describe('base url', () => {

  beforeEach(async() => {
    await page.goto(baseURL);
    await page.waitForLoadState();
  });

  describe('DEV (FBISCC-46) - Base url page redirect', () => {

    it('should redirect to the question page', async() => {
      expect(await page.url()).to.equal(baseURL + '/question');
    });

  });

  describe('DEV - header and footer navigation', () => {

    it('should have a link to the question page in the header', async() => {
      const headerLink = await page.$('header a[href="/question"]');
      expect(await headerLink.innerText()).to.equal('Get help with your online immigration account');
    });

    it('should have a link to the cookies page in the footer', async() => {
      const footerLink = await page.$('footer a[href="/cookies"]');
      expect(await footerLink.innerText()).to.equal('Cookies');

      await footerLink.click();
      await page.waitForLoadState();

      const header = await page.$('h1');
      expect(await header.innerText()).to.equal('Cookies');
    });

    it('should have a link to the terms and conditions page in the footer', async() => {
      const footerLink = await page.$('footer a[href="/terms-and-conditions"]');
      expect(await footerLink.innerText()).to.equal('Terms and conditions');

      await footerLink.click();
      await page.waitForLoadState();

      const header = await page.$('h1');
      expect(await header.innerText()).to.equal('Terms and conditions');
    });

    it('should have a link to the accessibility statement page in the footer', async() => {
      const footerLink = await page.$('footer a[href="/accessibility"]');
      expect(await footerLink.innerText()).to.equal('Accessibility statement');

      await footerLink.click();
      await page.waitForLoadState();

      const header = await page.$('h1');
      expect(await header.innerText()).to.equal('Accessibility statement for \'Get help with your online immigration account\'');
    });

  });

});
