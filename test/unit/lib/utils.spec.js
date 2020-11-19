'use strict';

/* eslint max-nested-callbacks: 0 */

const proxyquire = require('proxyquire');

const mockNotifyClient = {
  sendEmail: sinon.stub(),
  getNotifications: sinon.stub()
};

const mockNotifyModule = {
  NotifyClient: sinon.stub().returns(mockNotifyClient)
};

const utils = proxyquire('../../../lib/utils', { 'notifications-node-client': mockNotifyModule });
const config = require('../../../config');

afterEach(() => {
  mockNotifyClient.sendEmail.reset();
  mockNotifyClient.getNotifications.reset();
});

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


  describe('getEmail', () => {

    it('should return the email if it exists', () => {
      mockNotifyClient.getNotifications.resolves({ data: { notifications: ['testEmailData'] } });

      return utils.getEmail('testRef')
        .then(res => {
          expect(res).to.equal('testEmailData');
        });
    });

    it('should return undefined if the email does not exist', () => {
      mockNotifyClient.getNotifications.resolves({ data: { notifications: [] } });

      return utils.getEmail('testRef')
        .then(res => {
          expect(res).to.equal(undefined);
        });
    });

    it('should return undefined if there is an error', () => {
      mockNotifyClient.getNotifications.rejects(new Error('testError'));

      return utils.getEmail('testRef')
        .then(res => {
          expect(res).to.equal(undefined);
        });
    });

  });

  describe('pollEmailStatus', () => {

    let pollEmailStatusSpy;

    beforeEach(() => {
      pollEmailStatusSpy = sinon.spy(utils, 'pollEmailStatus');
    });

    afterEach(() => {
      pollEmailStatusSpy.restore();
    });

    it('should return true if email is found', () => {
      mockNotifyClient.getNotifications.resolves({ data: { notifications: ['testEmailData'] } });

      const promise = utils.pollEmailStatus('testRef', 0, 0);
      return promise.then((res) => {
        expect(res).to.equal(true);
      });
    });

    it('should recurse until email is found', () => {
      mockNotifyClient.getNotifications.onCall(0).resolves({ data: { notifications: [] } });
      mockNotifyClient.getNotifications.onCall(1).resolves({ data: { notifications: [] } });
      mockNotifyClient.getNotifications.onCall(2).resolves({ data: { notifications: ['testEmailData'] } });

      const promise = utils.pollEmailStatus('testRef', 0, 0);
      return promise.then((res) => {
        expect(pollEmailStatusSpy.getCalls().length).to.equal(3);
        expect(res).to.equal(true);
      });
    });

    it('should throw an error with explanatory message if tries exceeds the retry limit', () => {
      mockNotifyClient.getNotifications.resolves({ data: { notifications: [] } });

      return utils.pollEmailStatus('testRef', 0, 0)
        .catch(err => {
          expect(pollEmailStatusSpy.lastCall.args[1]).to.equal(config.notify.statusRetryLimit);
          expect(pollEmailStatusSpy.getCalls().length).to.equal(config.notify.statusRetryLimit + 1);
          expect(err.message).to.equal('Exceeded email status check retry limit');
        });
    });

  });

});

