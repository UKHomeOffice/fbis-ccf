'use strict';

const Behaviour = require('../apps/fbis-ccf/behaviours/set-question');

describe('Set question behaviour', () => {

  let SetQuestion;
  let testInstance;
  let superErr;
  let superValues;
  let nextStub;

  describe('getValues', () => {

    class Base {
      getValues(req, res, callback) {
        callback(superErr, superValues);
      }
    }

    beforeEach(() => {
      SetQuestion = Behaviour(Base);
      testInstance = new SetQuestion();

      nextStub = sinon.stub();
    });

    it('should set `is-account` flag true if user is having an issue updating immigration account', () => {
      superErr = null;
      superValues = { question: 'account' };

      const expected = {
        'is-account': true,
        'is-id-check': false,
        'is-status': false,
        question: 'account'
      };

      testInstance.getValues({}, {}, nextStub);
      expect(nextStub).to.have.been.calledOnceWith(null, expected);
    });

    it('should set `is-is-check` flag true if user is having an issue with ID check app', () => {
      superErr = null;
      superValues = { question: 'id-check' };

      const expected = {
        'is-account': false,
        'is-id-check': true,
        'is-status': false,
        question: 'id-check'
      };

      testInstance.getValues({}, {}, nextStub);
      expect(nextStub).to.have.been.calledOnceWith(null, expected);
    });

    it('should set `status` flag true if user is having an issue viewing or proving immigration status', () => {
      superErr = null;
      superValues = { question: 'status' };

      const expected = {
        'is-account': false,
        'is-id-check': false,
        'is-status': true,
        question: 'status'
      };

      testInstance.getValues({}, {}, nextStub);
      expect(nextStub).to.have.been.calledOnceWith(null, expected);
    });

    it('should pass the error to the next middleware if super.getValues returns an error', () => {
      superErr = 'error';
      testInstance.getValues({}, {}, nextStub);
      expect(nextStub).to.have.been.calledOnceWith('error');
    });

  });

});
