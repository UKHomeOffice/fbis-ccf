'use strict';

const proxyquire = require('proxyquire');

const mockNotifyClient = {
  sendEmail: sinon.stub()
};

const mockNotifyModule = {
  NotifyClient: sinon.stub().returns(mockNotifyClient)
};

const utils = proxyquire('../../lib/utils', { 'notifications-node-client': mockNotifyModule });

describe('Utils', () => {

  describe('sendEmail', () => {

    it('should call notify client \'send email\' with template id, test address, and formatted options', () => {
      const expectedOptions = {
       personalisation: 'testData', reference: 'testReference'
      };

      utils.sendEmail('testTemplate', 'testAddress', 'testReference', 'testData');

      expect(mockNotifyClient.sendEmail).to.have.been.calledOnceWith('testTemplate', 'testAddress', expectedOptions);
    });

  });

});

