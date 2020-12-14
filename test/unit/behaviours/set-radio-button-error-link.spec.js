'use strict';

const Behaviour = require('../../../apps/fbis-ccf/behaviours/set-radio-button-error-link');

describe('Set radio button error link behaviour', () => {

  let SetRadioButtonErrorLink;
  let testInstance;
  let nextStub;
  const req = {};
  const res = {};

  describe('getValues', () => {

    class Base {
      errorHandler() {}
    }

    beforeEach(() => {
      SetRadioButtonErrorLink = Behaviour(Base);
      testInstance = new SetRadioButtonErrorLink();

      nextStub = sinon.stub();
    });

    it('should set the error radioKey to \'question-id-check\' if the error field is question', () => {
      const err = {
        question: {
          key: 'question'
        }
      };

      const expected = {
        question: {
          key: 'question',
          radioKey: 'question-id-check'
        }
      };

      testInstance.errorHandler(err, req, res, nextStub);
      expect(err).to.deep.equal(expected);
    });

    it('should set the error radioKey to \'identity-Yes\' if the error field is identity', () => {
      const err = {
        identity: {
          key: 'identity'
        }
      };

      const expected = {
        identity: {
          key: 'identity',
          radioKey: 'identity-Yes'
        }
      };

      testInstance.errorHandler(err, req, res, nextStub);
      expect(err).to.deep.equal(expected);
    });

    it('should not set the radioKey if the error field is not a radio button', () => {
      const err = {
        query: {
          key: 'query'
        }
      };

      const expected = {
        query: {
          key: 'query',
        }
      };

      testInstance.errorHandler(err, req, res, nextStub);
      expect(err).to.deep.equal(expected);
    });

  });

});
