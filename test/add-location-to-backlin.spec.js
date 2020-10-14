'use strict';

const Behaviour = require('../apps/fbis-ccf/behaviours/add-location-to-backlink');

describe('Add location to backlink behaviour', () => {

  let req;
  let res;
  let AddLocationToBacklink;
  let testInstance;

  beforeEach(() => {
    req = {
      sessionModel: {
        get: sinon.stub().returns(undefined)
      },
    };

    res = {};
  });

  describe('getValues', () => {

    class Base {
      locals() {
        return {
          backLink: 'landing'
        };
      }
    }

    beforeEach(() => {
      AddLocationToBacklink = Behaviour(Base);
      testInstance = new AddLocationToBacklink();
    });

    it('should add `?outside-UK` to backlink if session is not in UK', () => {
      req.sessionModel.get.returns(false);
      const locals = testInstance.locals(req, res);
      expect(locals.backLink).to.equal('landing?outside-UK');
    });

    it('should not alter backlink if session is in UK', () => {
      req.sessionModel.get.returns(true);
      const locals = testInstance.locals(req, res);
      expect(locals.backLink).to.equal('landing');
    });

    it('should not alter backlink if location is not defined in session', () => {
      req.sessionModel.get.returns(undefined);
      const locals = testInstance.locals(req, res);
      expect(locals.backLink).to.equal('landing');
    });

  });

});
