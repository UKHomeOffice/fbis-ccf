'use strict';

const Behaviour = require('../../../apps/fbis-ccf/behaviours/clear-session');

describe('Clear session behaviour', () => {
  let req;
  let res;
  let ClearSession;
  let testInstance;
  let nextStub;

  beforeEach(() => {
    req = {
      sessionModel: {
        get: sinon.stub().withArgs('email').returns('test@mail.com'),
        set: sinon.stub(),
        reset: sinon.stub()
      }
    };
    res = {};
  });

  describe('getValues', () => {
    class Base {
      getValues() {}
    }

    beforeEach(() => {
      ClearSession = Behaviour(Base);
      testInstance = new ClearSession();
      nextStub = sinon.stub();
    });

    it('should reset the sessionModel', () => {
      testInstance.getValues(req, res, nextStub);
      expect(req.sessionModel.reset.calledOnce).to.equal(true);
    });
  });
});
