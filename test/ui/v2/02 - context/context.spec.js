'use strict';

/* eslint max-len: off */

const setUp = async(question) => {
  // select a question category
  await page.goto(baseURL + '/question');
  const questionRadio = await page.$(`input#question-${question}`);
  await questionRadio.click();
  await submitPage();
};

describe('/context', () => {

  describe('FR-CAT-27 (FBISCC-73) - Context screen', () => {

    describe('when user selects any question category and submits the page', () => {

      beforeEach(async() => await setUp('id-check'));

      it('should include a header with text \'What you will need\'', async() => {
        const header = await page.$('h1');
        expect(await header.innerText()).to.equal('What you will need');
      });

      it('should include a list of items needed from the user with text \'You will need to give us:\'', async() => {
        const listText = await page.$('#context>p');
        expect(await listText.innerText()).to.equal('You will need to give us:');
      });

      it('should include list items for name, contact details and problem details', async() => {
        const list = await page.$$('#context-requirements > li');
        expect(await list[0].innerText()).to.equal('your name');
        expect(await list[1].innerText()).to.equal('contact details where we can send our response');
        expect(await list[2].innerText()).to.equal('details about the problem');
      });

      it('should include a message about filling out the form on another person\'s behalf', async() => {
        const representativeInfo = await page.$('#representative-info');
        expect(await representativeInfo.innerText()).to.equal('If you are filling this form out on behalf of someone else, we will also need your name.');
      });

      it('should include a time-out warning message', async() => {
        const timeout = await page.$('.notice > strong');
        expect(await timeout.innerText()).to.equal('If you do not do anything for 30 minutes, the service will time out and you will need to start again.');
      });

    });

    describe('when user selects id-check question category and submits the page', () => {

      beforeEach(async() => await setUp('id-check'));

      it('should include three items in the \'You will need to give us\' section', async() => {
        const items = await page.$$('#context-requirements > li');
        expect(items.length).to.equal(3);
      });

    });

    describe('when user selects status question category and submits the page', () => {

      beforeEach(async() => await setUp('status'));

      it('should include four items in the \'You will need to give us\' section, including UAN', async() => {
        const items = await page.$$('#context-requirements > li');
        expect(items.length).to.equal(4);
        expect(await items[1].innerText()).to.include('your unique application number (UAN), if you have it');
      });

    });

    describe('when user selects account question category and submits the page', () => {

      beforeEach(async() => await setUp('account'));

      it('should include four items in the \'You will need to give us\' section, including UAN', async() => {
        const items = await page.$$('#context-requirements > li');
        expect(items.length).to.equal(4);
        expect(await items[1].innerText()).to.include('your unique application number (UAN), if you have it');
      });

    });

  });

});
