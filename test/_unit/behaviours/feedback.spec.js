'use strict';

const proxyquire = require('proxyquire');

const mockUtils = {
  sendEmail: sinon.stub(),
  pollEmailStatus: sinon.stub()
};

const mockConfig = {
  notify: {
    templateFeedback: 'templateFeedback',
    feedbackEmail: 'feedbackEmail',
    feedbackEmailReference: 'feedback-email-reference',
    statusRetryInterval: 1000
  }
};

const mockUUID = {
  v4: () => 'mockUUID'
};

const Behaviour = proxyquire('../../../apps/feedback/behaviours/feedback', {
  '../../../lib/utils': mockUtils,
  '../../../config': mockConfig,
  uuid: mockUUID
});

describe('Feedback behaviour', () => {
  let req;
  let res;
  let Feedback;
  let testInstance;
  let nextStub;

  beforeEach(() => {
    req = {
      form: {
        values: {}
      },
      log: sinon.stub(),
      sessionModel: {
        get: sinon.stub(),
        set: sinon.stub(),
        unset: sinon.stub()
      },
      session: {
        save: sinon.stub()
      },
      headers: {
        referer: ''
      }
    };

    res = {};
  });

  describe('getValues', () => {
    class Base {
      getValues() {}
    }

    beforeEach(() => {
      Feedback = Behaviour(Base);
      testInstance = new Feedback();
      nextStub = sinon.stub();
    });

    describe('on redirect to feedback page', () => {
      it('should set feedbackReturnTo to the user\'s previous location', () => {
        const referredFrom = 'referred-from-link.com';
        req.headers.referer = referredFrom;

        testInstance.getValues(req, res, nextStub);
        expect(req.sessionModel.set).to.have.been.calledOnceWith('feedbackReturnTo', referredFrom);
      });

      it('should not set feedbackReturnTo if the user redirected from the feedback page', () => {
        req.headers.referer = 'referred-from-link.com/feedback';

        testInstance.getValues(req, res, nextStub);
        expect(req.sessionModel.set.notCalled).to.equal(true);
      });
    });
  });

  describe('saveValues', () => {
    class Base {
      saveValues() {}
    }

    beforeEach(() => {
      Feedback = Behaviour(Base);
      testInstance = new Feedback();

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

      it('should call utils \'sendEmail\' with feedback template, feedback email and UUID', () => {
        return testInstance.saveValues(req, res, nextStub)
          .then(() => {
            expect(mockUtils.sendEmail).to.have.been.calledOnceWith('templateFeedback', 'feedbackEmail', 'mockUUID');
          });
      });

      it('should call utils \'sendEmail\' with emailData containing only necessary fields from the form', () => {
        req.form.values = {
          'unwanted-field': 'unwanted value',
          feedbackRating: 'satisfied',
          feedbackText: 'Satisfied with the service',
          feedbackEmail: 'email@address.com'
        };

        const expected = {
          feedbackRating: 'satisfied',
          feedbackText: 'Satisfied with the service',
          feedbackEmail: 'email@address.com'
        };

        return testInstance.saveValues(req, res, nextStub)
          .then(() => {
            expect(mockUtils.sendEmail).to.have.been
              .calledOnceWith('templateFeedback', 'feedbackEmail', 'mockUUID', expected);
          });
      });

      it('should replace feedbackEmail with \'n/a\' if not provided', () => {
        req.form.values = {
          feedbackRating: 'satisfied',
          feedbackText: 'Satisfied with the service',
          feedbackEmail: undefined
        };

        const expected = {
          feedbackRating: 'satisfied',
          feedbackText: 'Satisfied with the service',
          feedbackEmail: 'n/a'
        };

        return testInstance.saveValues(req, res, nextStub)
          .then(() => {
            expect(mockUtils.sendEmail).to.have.been
              .calledOnceWith('templateFeedback', 'feedbackEmail', 'mockUUID', expected);
          });
      });

      it('should call the next middleware step if the email message reaches Notify', () => {
        return testInstance.saveValues(req, res, nextStub)
          .then(() => {
            expect(nextStub.calledOnce).to.equal(true);
          });
      });

      it('should log a success message and the email reference if the email message reaches Notify', () => {
        return testInstance.saveValues(req, res, nextStub)
          .then(() => {
            expect(req.log).to.have.been.calledOnceWith(
              'info',
              'Feedback sent to feedback address',
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
              'Error sending feedback email to feedback address',
              'reference=mockUUID'
            );
          });
      });

      it('should unset the feedback email reference on the session if there is an error', () => {
        const testError = new Error('testError');
        mockUtils.sendEmail.rejects(testError);

        return testInstance.saveValues(req, res, nextStub)
          .then(() => {
            expect(req.sessionModel.unset).to.have.been.calledOnceWith('feedback-email-reference');
          });
      });
    });

    describe('on duplicate submit', () => {
      beforeEach(() => {
        req.sessionModel.get.withArgs(mockConfig.notify.feedbackEmailReference).returns('mockUUID');
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

      it('should not log success on duplicate submission', () => {
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

      it('should unset the feedback email reference on the session if there is an error', () => {
        const testError = new Error('testError');
        mockUtils.pollEmailStatus.rejects(testError);

        return testInstance.saveValues(req, res, nextStub)
          .then(() => {
            expect(req.sessionModel.unset).to.have.been.calledOnceWith('feedback-email-reference');
          });
      });
    });
  });
});
