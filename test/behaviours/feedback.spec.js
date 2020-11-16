'use strict';

/* eslint max-nested-callbacks: 0 */

const proxyquire = require('proxyquire');

const mockUtils = {
  sendEmail: sinon.stub(),
  pollEmailStatus: sinon.stub()
};

const mockConfig = {
  notify: {
    templateFeedback: 'templateFeedback',
    feedbackEmail: 'srcFeedbackEmail',
    feedbackEmailSessionName: 'feedback-email',
    statusRetryInterval: 1000
  }
};

const mockUUID = {
  v4: () => 'mockUUID'
};

const Behaviour = proxyquire('../../apps/feedback/behaviours/feedback', {
  '../../../lib/utils': mockUtils,
  '../../../config': mockConfig,
  'uuid': mockUUID
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
        set: sinon.stub()
      },
      session: {
        save: sinon.stub()
      }
    };

    res = {};
  });

  describe('getValues', () => {

    it('should set feedbackReturnTo to the location where the user directed to the feedback page from', () => {

    });

  });

  describe.only('saveValues', () => {

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
        req.sessionModel.get.withArgs(mockConfig.notify.submitEmailSessionName).returns(undefined);
      });

      afterEach(() => {
        req.sessionModel.get.reset();
      });

      it('should call utils \'sendEmail\' with feedback template, SRC feedback email and UUID', () => {
        return testInstance.saveValues(req, res, nextStub)
          .then(() => {
            expect(mockUtils.sendEmail).to.have.been.calledOnceWith('templateFeedback', 'srcFeedbackEmail', 'mockUUID');
          });
      });

      it('');

    });

  });

});
