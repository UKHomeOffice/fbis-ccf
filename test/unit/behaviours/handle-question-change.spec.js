'use strict';

/* eslint max-len: off */

const Behaviour = require('../../../apps/fbis-ccf/behaviours/handle-question-change');

describe('Handle question change behaviour', () => {

  let req;
  let res;
  let HandleQuestionChange;
  let testInstance;

  beforeEach(() => {
    req = {
      sessionModel: {
        get: sinon.stub(),
        set: sinon.stub()
      },
      form: {
        values: {}
      }
    };
  });

  describe('saveValues', () => {

    class Base {
      saveValues() {}
    }

    beforeEach(() => {
      HandleQuestionChange = Behaviour(Base);
      testInstance = new HandleQuestionChange();
    });

    describe('when user submits using the normal link, not the change link', () => {

      it('should not change the application number on the session model', () => {
        req.url = '/question';
        testInstance.saveValues(req, res, () => {});
        expect(req.sessionModel.set.notCalled).to.equal(true);
      });

    });

    describe('when user submits using the change link and the new question is status', () => {

      it('should not change the application number on the session model', () => {
        req.url = '/question/edit';
        req.form.values.question = 'status';

        testInstance.saveValues(req, res, () => {});

        expect(req.sessionModel.set.notCalled).to.equal(true);
      });

    });

    describe('when user submits using the change link and the new question is account', () => {

      it('should not change the application number on the session model', () => {
        req.url = '/question/edit';
        req.form.values.question = 'account';

        testInstance.saveValues(req, res, () => {});

        expect(req.sessionModel.set.notCalled).to.equal(true);
      });

    });

    describe('when user submits using the change link and new question is id-check', () => {

      describe('when the old question was status', () => {

        it('should clear the application number on the session', () => {
          req.url = '/question/edit';
          req.form.values.question = 'id-check';
          req.sessionModel.get.withArgs('question').returns('status');

          testInstance.saveValues(req, res, () => {});

          expect(req.sessionModel.set).to.have.been.calledOnceWith('application-number', '');
        });

      });

      describe('when the old question was account', () => {

        it('should clear the application number on the session', () => {
          req.url = '/question/edit';
          req.form.values.question = 'id-check';
          req.sessionModel.get.withArgs('question').returns('account');

          testInstance.saveValues(req, res, () => {});

          expect(req.sessionModel.set).to.have.been.calledOnceWith('application-number', '');
        });

      });

      describe('when the old question was id-check', () => {

        it('should not change the application number on the session model', () => {
          req.url = '/question/edit';
          req.form.values.question = 'id-check';
          req.sessionModel.get.withArgs('question').returns('id-check');

          testInstance.saveValues(req, res, () => {});

          expect(req.sessionModel.set.notCalled).to.equal(true);
        });

      });

    });

  });

});
