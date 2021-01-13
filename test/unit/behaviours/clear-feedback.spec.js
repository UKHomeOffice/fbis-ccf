'use strict';

const proxyquire = require('proxyquire');

const mockConfig = {
  notify: {
    feedbackEmailReference: 'feedback-email-reference'
  }
};

const Behaviour = proxyquire('../../../apps/feedback/behaviours/clear-feedback', {'../../../config': mockConfig});


describe('Clear feedback behaviour', () => {

  let req;
  let res;
  let ClearFeedback;
  let testInstance;
  let nextStub;

  beforeEach(() => {
    req = {
      sessionModel: {
        get: sinon.stub(),
        set: sinon.stub(),
        unset: sinon.stub()
      },
      get: sinon.stub()
    };

    res = {
      redirect: sinon.stub()
    };
  });

  describe('getValues', () => {

    class Base {
      getValues() {}
    }

    beforeEach(() => {
      ClearFeedback = Behaviour(Base);
      testInstance = new ClearFeedback();
      nextStub = sinon.stub();
    });

    it('should unset feedback form fields and feedback email reference on the session', () => {
      testInstance.getValues(req, res, nextStub);
      expect(req.sessionModel.unset).to.have.been.calledOnceWith([
        'feedbackRating',
        'feedbackText',
        'feedbackEmail']);
    });

  });

  describe('successHandler', () => {

    class Base {
      sucessHandler() {}
    }

    beforeEach(() => {
      ClearFeedback = Behaviour(Base);
      testInstance = new ClearFeedback();
    });

    it('should default to the landing page if there is no link to redirect to on req', () => {
      req.sessionModel.get.withArgs('feedbackReturnTo').returns(undefined);
      req.get.withArgs('origin').returns('example-link.com');
      testInstance.successHandler(req, res);
      expect(res.redirect).to.be.calledOnceWith('example-link.com/question');
    });

    it('should unset the feedbackReturnTo link and feedbackEmailReference on the session', () => {
      testInstance.successHandler(req, res);
      expect(req.sessionModel.unset).to.be.calledOnceWith([
        'feedbackReturnTo',
        mockConfig.notify.feedbackEmailReference
      ]);
    });

    it('should redirect the user to the link they came from', () => {
      req.sessionModel.get.withArgs('feedbackReturnTo').returns('example-link.com/question');
      testInstance.successHandler(req, res);
      expect(res.redirect).to.be.calledOnceWith('example-link.com/question');
    });

  });

});
