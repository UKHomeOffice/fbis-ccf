'use strict';

const Behaviour = require('../../../apps/fbis-ccf/behaviours/set-location-on-session');

describe('Set location behaviour', () => {

  let req;
  let res;
  let SetLocationOnSession;
  let testInstance;

  beforeEach(() => {
    req = {
      sessionModel: {
        set: sinon.stub().returns(undefined)
      },
      query: {}
    };

    res = {};
  });

  describe('getValues', () => {

    class Base {
      getValues() {}
    }

    beforeEach(() => {
      SetLocationOnSession = Behaviour(Base);
      testInstance = new SetLocationOnSession();
    });

    it('should set `in-UK` flag true if using base route (fbis.gov.uk/landing)', () => {
      testInstance.getValues(req, res, {});
      expect(req.sessionModel.set).to.have.been.calledOnceWith('in-UK', true);
    });

    it('should set `in-UK` flag false if query contains outside-UK (fbis.gov.uk/landing?outside-UK)', () => {
      req.query['outside-UK'] = '';
      testInstance.getValues(req, res, {});
      expect(req.sessionModel.set).to.have.been.calledOnceWith('in-UK', false);
    });

  });

});
