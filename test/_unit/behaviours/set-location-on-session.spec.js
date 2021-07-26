'use strict';

const Behaviour = require('../../../apps/fbis-ccf/behaviours/set-location-on-session');

describe('Set location behaviour', () => {
  let req;
  let res;
  let SetLocationOnSession;
  let testInstance;
  let superErr;
  let superValues;
  let nextStub;

  beforeEach(() => {
    req = {
      sessionModel: {
        set: sinon.stub().returns(undefined)
      },
      query: {}
    };

    res = {};

    nextStub = sinon.stub();
  });

  describe('getValues', () => {
    class Base {
      getValues(request, response, callback) {
        callback(superErr, superValues);
      }
    }

    beforeEach(() => {
      SetLocationOnSession = Behaviour(Base);
      testInstance = new SetLocationOnSession();
    });

    it('should set `in-UK` flag true if using base route (fbis.gov.uk/question)', () => {
      superValues = {};
      superErr = null;

      testInstance.getValues(req, res, nextStub);
      expect(req.sessionModel.set).to.have.been.calledOnceWith('in-UK', true);
      expect(nextStub).to.have.been.calledOnceWith(null, { 'in-UK': true });
    });

    it('should set `in-UK` flag false if query contains outside-UK (fbis.gov.uk/question?outside-UK)', () => {
      superValues = {};
      superErr = null;

      req.query['outside-UK'] = '';
      testInstance.getValues(req, res, nextStub);
      expect(req.sessionModel.set).to.have.been.calledOnceWith('in-UK', false);
      expect(nextStub).to.have.been.calledOnceWith(null, { 'in-UK': false });
    });
  });
});
