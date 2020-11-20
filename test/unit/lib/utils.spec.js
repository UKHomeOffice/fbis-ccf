'use strict';

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

// remove time delay between notify email status checks for test purposes
config.notify.statusRetryInterval = 0;

afterEach(() => {
  mockNotifyClient.sendEmail.reset();
  mockNotifyClient.getNotifications.reset();
});

describe('Utils', () => {

  describe('sendEmail', () => {

    beforeEach(() => {
      mockNotifyClient.sendEmail.resolves(true);
    });

    it('should call notify client \'send email\' with template id, test address, and formatted options', () => {
      mockNotifyClient.getNotifications.resolves({ data: { notifications: [{ status: 'delivered' }] } });

      const expected = {
       personalisation: 'testData', reference: 'testReference'
      };

      return utils.sendEmail('testTemplate', 'testAddress', 'testReference', 'testData')
        .then(() => {
          expect(mockNotifyClient.sendEmail).to.have.been.calledOnceWith('testTemplate', 'testAddress', expected);
        });
    });

    it('throw an error if polling returns failure status', () => {
      const testError = new Error('testError');
      mockNotifyClient.getNotifications.rejects(testError);

      return utils.sendEmail('testTemplate', 'testAddress', 'testReference', 'testData')
        .catch(err => {
          expect(err).to.equal(testError);
        });
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

    it('throw an error if there is an error', () => {
      const testError = new Error('testError');
      mockNotifyClient.getNotifications.rejects(testError);

      return utils.getEmail('testRef')
        .catch(err=> {
          expect(err).to.equal(testError);
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

    it('should return true if email is delivered', () => {
      mockNotifyClient.getNotifications.resolves({ data: { notifications: [{ status: 'delivered' }] } });

      const promise = utils.pollEmailStatus('testRef', 0, 0);
      return promise.then((res) => {
        expect(res).to.equal(true);
      });
    });

    it('should throw an error with explanatory message if the email has \'permanent-failure\' status', () => {
      mockNotifyClient.getNotifications.resolves({ data: { notifications: [{ status: 'permanent-failure' }] } });

      return utils.pollEmailStatus('testRef', 0, 0)
        .catch(err => {
          expect(err.message).to.equal('Failure between Notify and their email provider');
        });
    });

    it('should throw an error with explanatory message if the email has \'temporary-failure\' status', () => {
      mockNotifyClient.getNotifications.resolves({ data: { notifications: [{ status: 'temporary-failure' }] } });

      return utils.pollEmailStatus('testRef', 0, 0)
        .catch(err => {
          expect(err.message).to.equal('Failure between Notify and their email provider');
        });
    });

    it('should throw an error with explanatory message if the email has \'permanent-failure\' status', () => {
      mockNotifyClient.getNotifications.resolves({ data: { notifications: [{ status: 'technical-failure' }] } });

      return utils.pollEmailStatus('testRef', 0, 0)
        .catch(err => {
          expect(err.message).to.equal('Failure between Notify and their email provider');
        });
    });

    it('should recurse if email is undefined, \'created\', or \'sending\'', () => {
      mockNotifyClient.getNotifications.onCall(0).resolves({ data: { notifications: [] } });
      mockNotifyClient.getNotifications.onCall(1).resolves({ data: { notifications: [{ status: 'created' }] } });
      mockNotifyClient.getNotifications.onCall(2).resolves({ data: { notifications: [{ status: 'sending' }] } });
      mockNotifyClient.getNotifications.onCall(3).resolves({ data: { notifications: [{ status: 'delivered' }] } });

      const promise = utils.pollEmailStatus('testRef', 0, 0);
      return promise.then((res) => {
        expect(pollEmailStatusSpy.getCalls().length).to.equal(4);
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

