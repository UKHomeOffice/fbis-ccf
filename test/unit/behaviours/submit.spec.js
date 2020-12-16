'use strict';

const proxyquire = require('proxyquire');

const mockUtils = {
  sendEmail: sinon.stub(),
  pollEmailStatus: sinon.stub()
};

const mockConfig = {
  notify: {
    templateQuery: 'templateQuery',
    srcCaseworkEmail: 'srcCaseworkEmail',
    submitEmailReference: 'submit-email-reference',
    statusRetryInterval: 1000
  }
};

const mockUUID = {
  v4: () => 'mockUUID'
};

const Behaviour = proxyquire('../../../apps/fbis-ccf/behaviours/submit', {
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
        historicalValues: {
          question: 'status'
        }
      },
      log: sinon.stub(),
      sessionModel: {
        get: sinon.stub(),
        set: sinon.stub(),
        unset: sinon.stub(),
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
        req.sessionModel.get.withArgs(mockConfig.notify.submitEmailReference).returns(undefined);
      });

      afterEach(() => {
        req.sessionModel.get.reset();
      });

      it('should call utils \'sendEmail\' with template query, SRC casework email, and a UUID', () => {
        return testInstance.saveValues(req, res, nextStub)
          .then(() => {
            expect(mockUtils.sendEmail).to.have.been.calledWith('templateQuery', 'srcCaseworkEmail', 'mockUUID');
          });
      });

      it('should call utils \'sendEmail\' with emailData containing only necessary fields from the form', () => {
        req.form.historicalValues = {
          'some-unwanted-field': 'unwanted value',
          'applicant-first-names': 'John',
          'applicant-last-names': 'Smith',
          'phone': '07000000000',
          'application-number': '3434-0000-0000-0001',
          email: 'john.smith@mail.com',
          identity: 'yes',
          'in-UK': true,
          organisation: 'Charity',
          query: 'I am having an issue',
          question: 'account',
          'representative-first-names': 'Mary',
          'representative-last-names': 'Sue',
        };

        const expected = {
          'applicant-first-names': 'First names: John',
          'applicant-last-names': 'Last names: Smith',
          'phone': 'Phone number: 07000000000',
          'application-number': 'Unique application number (UAN): 3434-0000-0000-0001',
          email: 'Email address: john.smith@mail.com',
          identity: 'yes',
          location: 'Inside UK',
          organisation: 'Organisation: Charity',
          query: 'I am having an issue',
          question: 'Updating your immigration account details',
          'representative-first-names': 'First names: Mary',
          'representative-last-names': 'Last names: Sue',
        };

        return testInstance.saveValues(req, res, nextStub)
          .then(() => {
            expect(mockUtils.sendEmail).to.have.been
              .calledWith('templateQuery', 'srcCaseworkEmail', 'mockUUID', expected);
          });
      });

      it('should replace falsy optional fields with empty strings', () => {
        req.form.historicalValues = {
          'applicant-first-names': 'John',
          'applicant-last-names': 'Smith',
          'phone': '07000000000',
          'application-number': null,
          email: 'john.smith@mail.com',
          identity: 'no',
          'in-UK': true,
          organisation: undefined,
          query: 'I am having an issue',
          question: 'id-check',
          'representative-first-names': false,
          'representative-last-names': '',
        };

        const expected = {
          'applicant-first-names': 'First names: John',
          'applicant-last-names': 'Last names: Smith',
          'phone': 'Phone number: 07000000000',
          'application-number': '',
          email: 'Email address: john.smith@mail.com',
          identity: 'no',
          location: 'Inside UK',
          organisation: '',
          query: 'I am having an issue',
          question: 'The \'ID check\' app',
          'representative-first-names': '',
          'representative-last-names': '',
        };

        return testInstance.saveValues(req, res, nextStub)
          .then(() => {
            expect(mockUtils.sendEmail).to.have.been
              .calledWith('templateQuery', 'srcCaseworkEmail', 'mockUUID', expected);
          });
      });

      it('should format name fields as \'Given names\' and \'Family names\' if session is outside UK', () => {
        req.form.historicalValues = {
          'some-unwanted-field': 'unwanted value',
          'applicant-first-names': 'John',
          'applicant-last-names': 'Smith',
          'phone': '07000000000',
          'application-number': '3434-0000-0000-0001',
          email: 'john.smith@mail.com',
          identity: 'yes',
          'in-UK': false,
          organisation: 'Charity',
          query: 'I am having an issue',
          question: 'account',
          'representative-first-names': 'Mary',
          'representative-last-names': 'Sue',
        };

        const expected = {
          'applicant-first-names': 'Given names: John',
          'applicant-last-names': 'Family names: Smith',
          'phone': 'Phone number: 07000000000',
          'application-number': 'Unique application number (UAN): 3434-0000-0000-0001',
          email: 'Email address: john.smith@mail.com',
          identity: 'yes',
          location: 'Outside UK',
          organisation: 'Organisation: Charity',
          query: 'I am having an issue',
          question: 'Updating your immigration account details',
          'representative-first-names': 'Given names: Mary',
          'representative-last-names': 'Family names: Sue',
        };

        return testInstance.saveValues(req, res, nextStub)
          .then(() => {
            expect(mockUtils.sendEmail).to.have.been
              .calledWith('templateQuery', 'srcCaseworkEmail', 'mockUUID', expected);
          });
      });

      it('should log a success message and the email reference if the email message reaches Notify', () => {
        return testInstance.saveValues(req, res, nextStub)
          .then(() => {
            expect(req.log).to.have.been.calledOnceWith(
              'info',
              'Email sent to SRC casework address',
              'reference=mockUUID'
            );
          });
      });

      it('should call the next middleware step if the email message reaches Notify', () => {
        return testInstance.saveValues(req, res, nextStub)
          .then(() => {
            expect(nextStub.calledOnce).to.equal(true);
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

      it('should add formNotSubmitted flag to the error', () => {
        const testError = new Error('testError');
        mockUtils.sendEmail.rejects(testError);

        return testInstance.saveValues(req, res, nextStub)
          .then(() => {
            expect(testError.formNotSubmitted).to.equal(true);
          });
      });

      it('should unset the feedback email reference on the session if there is an error', () => {
        const testError = new Error('testError');
        mockUtils.sendEmail.rejects(testError);

        return testInstance.saveValues(req, res, nextStub)
          .then(() => {
            expect(req.sessionModel.unset).to.have.been.calledOnceWith('submit-email-reference');
          });
      });

    });

    describe('on duplicate submit', () => {

      beforeEach(() => {
        req.sessionModel.get.withArgs(mockConfig.notify.submitEmailReference).returns('mockUUID');
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

      it('should not log the error as this would duplicate the original submit log', () => {
        const testError = new Error('testError');
        mockUtils.pollEmailStatus.rejects(testError);

        return testInstance.saveValues(req, res, nextStub)
          .then(() => {
            expect(req.log.notCalled).to.equal(true);
          });
      });

      it('should add formNotSubmitted flag to the error', () => {
        const testError = new Error('testError');
        mockUtils.pollEmailStatus.rejects(testError);

        return testInstance.saveValues(req, res, nextStub)
          .then(() => {
            expect(testError.formNotSubmitted).to.equal(true);
          });
      });

      it('should unset the feedback email reference on the session if there is an error', () => {
        const testError = new Error('testError');
        mockUtils.pollEmailStatus.rejects(testError);

        return testInstance.saveValues(req, res, nextStub)
          .then(() => {
            expect(req.sessionModel.unset).to.have.been.calledOnceWith('submit-email-reference');
          });
      });

    });

  });

});
