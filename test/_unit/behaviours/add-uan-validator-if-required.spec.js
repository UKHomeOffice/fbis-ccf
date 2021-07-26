'use strict';

const Behaviour = require('../../../apps/fbis-ccf/behaviours/add-uan-validator-if-required');
const uanValidator = require('../../../apps/fbis-ccf/validators').uan;

describe('Add UAN validator if required behaviour', () => {
  let req;
  let res;
  let AddUANValidatorIfRequired;
  let testInstance;

  beforeEach(() => {
    req = {
      sessionModel: {
        get: sinon.stub().returns(undefined)
      },
      form: {
        options: {
          fields: {
            'application-number': {}
          }
        }
      }
    };

    res = {};
  });

  describe('process', () => {
    class Base {
      process() {}
    }

    beforeEach(() => {
      AddUANValidatorIfRequired = Behaviour(Base);
      testInstance = new AddUANValidatorIfRequired();
    });

    it('should add the uan and required validators to application number if question is status', () => {
      req.sessionModel.get.returns('status');
      testInstance.process(req, res, () => {});
      expect(req.form.options.fields['application-number'].validate).to.deep.equal([uanValidator, 'required']);
    });

    it('should add the uan validator to application number if question is account', () => {
      req.sessionModel.get.returns('account');
      testInstance.process(req, res, () => {});
      expect(req.form.options.fields['application-number'].validate).to.deep.equal([uanValidator, 'required']);
    });

    it('should not add the uan validator to application number if question is id-check', () => {
      req.sessionModel.get.returns('id-check');
      testInstance.process(req, res, () => {});
      expect(req.form.options.fields['application-number'].validate).to.deep.equal(undefined);
    });
  });
});
