'use strict';

/* eslint max-len: off */

const Behaviour = require('../../../apps/fbis-ccf/behaviours/handle-identity-change');

describe('Handle identity change behaviour', () => {
  let req;
  let res;
  let HandleIdentityChange;
  let testInstance;

  beforeEach(() => {
    req = {
      get: sinon.stub(),
      sessionModel: {
        get: sinon.stub(),
        set: sinon.stub()
      },
      form: {
        values: {}
      }
    };

    res = {
      redirect: sinon.stub()
    };
  });

  describe('saveValues', () => {
    class Base {
      saveValues() {}
    }

    beforeEach(() => {
      HandleIdentityChange = Behaviour(Base);
      testInstance = new HandleIdentityChange();
    });

    describe('when user submits using the normal link, not the change link', () => {
      it('should not set any values on the session model or redirect the response', () => {
        req.url = '/identity';
        testInstance.saveValues(req, res, () => {});
        expect(req.sessionModel.set.notCalled).to.equal(true);
        expect(res.redirect.notCalled).to.equal(true);
      });
    });

    describe('when user submits using the change link, new identity is Yes, and previous identity is Yes', () => {
      it('should not set any values on the session model or redirect the response if the representative details exist', () => {
        req.url = '/identity/edit';
        req.form.values.identity = 'Yes';
        req.sessionModel.get.withArgs('representative-first-names').returns('Example');
        req.sessionModel.get.withArgs('identity').returns('Yes');

        testInstance.saveValues(req, res, () => {});

        expect(req.sessionModel.set.notCalled).to.equal(true);
        expect(res.redirect.notCalled).to.equal(true);
      });
    });

    describe('when user submits using the change link, new identity is No, and previous identity is No', () => {
      it('should not set any values on the session model or redirect the response', () => {
        req.url = '/identity/edit';
        req.form.values.identity = 'No';
        req.sessionModel.get.withArgs('identity').returns('No');

        testInstance.saveValues(req, res, () => {});

        expect(req.sessionModel.set.notCalled).to.equal(true);
        expect(res.redirect.notCalled).to.equal(true);
      });
    });

    describe('when user submits using the change link, new identity is No, and previous identity is Yes', () => {
      it('should clear the representative names and organisation on the session model, but not redirect', () => {
        req.url = '/identity/edit';
        req.form.values.identity = 'No';
        req.sessionModel.get.withArgs('identity').returns('Yes');

        testInstance.saveValues(req, res, () => {});

        expect(req.sessionModel.set.callCount).to.equal(3);
        expect(req.sessionModel.set.firstCall.args).to.deep.equal(['representative-first-names', '']);
        expect(req.sessionModel.set.secondCall.args).to.deep.equal(['representative-last-names', '']);
        expect(req.sessionModel.set.thirdCall.args).to.deep.equal(['organisation', '']);
        expect(res.redirect.notCalled).to.equal(true);
      });
    });

    describe('when user submits using the change link, new identity is Yes, and previous identity is No', () => {
      it('should set the new identity on the session and redirect to the representative details page', () => {
        req.url = '/identity/edit';
        req.form.values.identity = 'Yes';
        req.sessionModel.get.withArgs('identity').returns('No');
        req.get.withArgs('origin').returns('www.baseUrl.co.uk');

        testInstance.saveValues(req, res, () => {});

        expect(req.sessionModel.set.callCount).to.equal(1);
        expect(req.sessionModel.set.firstCall.args).to.deep.equal(['identity', 'Yes']);
        expect(res.redirect).to.have.been.calledOnceWith('/representative-details/edit');
      });
    });
  });
});
