'use strict';

const proxyquire = require('proxyquire');

const mockConfig = {
  notify: {
    feedbackEmailSessionName: 'feedback-email'
  }
};

const Behaviour = proxyquire('../../apps/feedback/behaviours/clear-feedback', {'../../../config': mockConfig});


describe.only('Clear feedback behaviour', () => {

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

    it('should call un set all of the feedback variables on req after submission', () => {
      testInstance.getValues(req, res, nextStub);
      expect(req.sessionModel.unset).to.have.been.calledOnceWith([
        'feedbackRating',
        'feedbackText',
        'feedbackEmail',
        mockConfig.notify.feedbackEmailSessionName]);
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

    it('should get the link to redirect the user to if it exists on req', () => {
      testInstance.successHandler(req, res);
      expect(req.sessionModel.get).to.be.calledOnceWith('feedbackReturnTo');
    });

    it('should default to the landing page if there is no link to redirect to on req', () => {
      req.sessionModel.get.withArgs('feedbackReturnTo').returns(undefined);
      req.get.withArgs('origin').returns('example-link.com');
      testInstance.successHandler(req, res);
      expect(res.redirect).to.be.calledOnceWith('example-link.com/landing');
    });

    it('should unset the feedbackReturnTo link if it exists', () => {
      testInstance.successHandler(req, res);
      expect(req.sessionModel.unset).to.be.calledOnceWith('feedbackReturnTo');
    });

    it('should redirect the user to the link they came from', () => {
      req.sessionModel.get.withArgs('feedbackReturnTo').returns({});
      testInstance.successHandler(req, res);
      expect(res.redirect).to.be.calledOnceWith({});
    });

  });

});
