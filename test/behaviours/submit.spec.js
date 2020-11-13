'use strict';

/* eslint max-nested-callbacks: 0 */

const proxyquire = require('proxyquire');

const mockUtils = {
  sendEmail: sinon.stub(),
  pollEmailStatus: sinon.stub()
};

const mockConfig = {
  notify: {
    templateQuery: 'templateQuery',
    srcCaseworkEmail: 'srcCaseworkEmail',
    submitEmailSessionName: 'submit-email',
    statusRetryInterval: 1000
  }
};

const mockUUID = {
  v4: () => 'mockUUID'
};

const Behaviour = proxyquire('../../apps/fbis-ccf/behaviours/submit', {
  '../../../lib/utils': mockUtils,
  '../../../config': mockConfig,
  'uuid': mockUUID
});


describe('Submit behaviour', () => {

  let req;
  let res;
  let Submit;
  let testInstance;
  let nextStub;

  beforeEach(() => {
    req = {
      form: {
        historicalValues: {}
      },
      log: sinon.stub(),
      sessionModel: {
        get: sinon.stub(),
        set: sinon.stub()
      },
      session: {
        save: sinon.stub()
      }
    };

    res = {};
  });

  describe('saveValues', () => {

    class Base {
      saveValues() {}
    }

    beforeEach(() => {
      Submit = Behaviour(Base);
      testInstance = new Submit();

      mockUtils.sendEmail.resolves();
      nextStub = sinon.stub();
    });

    afterEach(() => {
      mockUtils.sendEmail.reset();
      req.log.reset();
    });

    describe('on first submit', () => {

      beforeEach(() => {
        req.sessionModel.get.withArgs(mockConfig.notify.submitEmailSessionName).returns(undefined);
      });

      afterEach(() => {
        req.sessionModel.get.reset();
      });

      it('should call utils \'sendEmail\' with template query, SRC casework email, and a UUID', () => {
        return testInstance.saveValues(req, res, nextStub)
          .then(() => {
            expect(mockUtils.sendEmail).to.have.been.calledOnceWith('templateQuery', 'srcCaseworkEmail', 'mockUUID');
          });
      });

      it('should call utils \'sendEmail\' with emailData containing only necessary fields from the form', () => {
        req.form.historicalValues = {
          'some-unwanted-field': 'unwanted value',
          'applicant-name': 'John Smith',
          'applicant-phone': '07000000000',
          'application-number': '3434-0000-0000-0001',
          email: 'john.smith@mail.com',
          identity: 'yes',
          organisation: 'Charity',
          query: 'I am having an issue',
          question: 'account',
          'representative-name': 'Mary Sue',
          'representative-phone': '07111111111'
        };

        const expected = {
          'applicant-name': 'John Smith',
          'applicant-phone': '07000000000',
          'application-number': '3434-0000-0000-0001',
          email: 'john.smith@mail.com',
          identity: 'yes',
          organisation: 'Charity',
          query: 'I am having an issue',
          question: 'account',
          'representative-name': 'Mary Sue',
          'representative-phone': '07111111111'
        };

        return testInstance.saveValues(req, res, nextStub)
          .then(() => {
            expect(mockUtils.sendEmail).to.have.been
              .calledOnceWith('templateQuery', 'srcCaseworkEmail', 'mockUUID', expected);
          });
      });

      it('should call substitute falsy form fields with \'n/a\'', () => {
        req.form.historicalValues = {
          'applicant-name': 'John Smith',
          'applicant-phone': '',
          'application-number': null,
          email: 'john.smith@mail.com',
          identity: 'no',
          organisation: undefined,
          query: 'I am having an issue',
          question: 'account',
          'representative-name': false,
          'representative-phone': false
        };

        const expected = {
          'applicant-name': 'John Smith',
          'applicant-phone': 'n/a',
          'application-number': 'n/a',
          email: 'john.smith@mail.com',
          identity: 'no',
          organisation: 'n/a',
          query: 'I am having an issue',
          question: 'account',
          'representative-name': 'n/a',
          'representative-phone': 'n/a'
        };

        return testInstance.saveValues(req, res, nextStub)
          .then(() => {
            expect(mockUtils.sendEmail).to.have.been
              .calledOnceWith('templateQuery', 'srcCaseworkEmail', 'mockUUID', expected);
          });
      });

      it('should call the next middleware step if the email sends successfully', () => {
        return testInstance.saveValues(req, res, nextStub)
          .then(() => {
            expect(nextStub.calledOnce).to.equal(true);
          });
      });

      it('should log a success message and the email reference if the email sends successfully', () => {
        return testInstance.saveValues(req, res, nextStub)
          .then(() => {
            expect(req.log).to.have.been.calledOnceWith(
              'info',
              'Email sent to SRC casework address',
              'reference=mockUUID'
            );
          });
      });

      it('should pass the error to the next middleware step if there is an error sending the email', () => {
        const testError = new Error('testError');
        mockUtils.sendEmail.rejects(testError);

        return testInstance.saveValues(req, res, nextStub)
          .then(() => {
            expect(nextStub).to.have.been.calledOnceWith(testError);
          });
      });

      it('should log the error and email reference if there is an error sending the email', () => {
        const testError = new Error('testError');
        mockUtils.sendEmail.rejects(testError);

        return testInstance.saveValues(req, res, nextStub)
          .then(() => {
            expect(req.log).to.have.been.calledOnceWith(
              'error',
              'Error sending email to SRC casework address',
              'reference=mockUUID',
              testError
            );
          });
      });

    });

    describe('on duplicate submit', () => {

      beforeEach(() => {
        req.sessionModel.get.withArgs(mockConfig.notify.submitEmailSessionName).returns('mockUUID');
      });

      afterEach(() => {
        req.sessionModel.get.reset();
        mockUtils.pollEmailStatus.reset();
      });

      it('should call the next middleware step if polling is successful', () => {
        mockUtils.pollEmailStatus.resolves();

        return testInstance.saveValues(req, res, nextStub)
          .then(() => {
            expect(nextStub.calledOnce).to.equal(true);
          });
      });

      it('should not log the success as this would duplicate the original submit log', () => {
        mockUtils.pollEmailStatus.resolves();

        return testInstance.saveValues(req, res, nextStub)
          .then(() => {
            expect(req.log.notCalled).to.equal(true);
          });
      });

      it('should pass the error to the next middleware step if there is an error when polling', () => {
        const testError = new Error('testError');
        mockUtils.pollEmailStatus.rejects(testError);

        return testInstance.saveValues(req, res, nextStub)
          .then(() => {
            expect(nextStub).to.have.been.calledOnceWith(testError);
          });
      });

      it('should log the error and email reference if there is an error sending the email', () => {
        const testError = new Error('testError');
        mockUtils.pollEmailStatus.rejects(testError);

        return testInstance.saveValues(req, res, nextStub)
          .then(() => {
            expect(req.log).to.have.been.calledOnceWith(
              'error',
              'Error sending email to SRC casework address',
              'reference=mockUUID',
              testError
            );
          });
      });

    });

  });

});
