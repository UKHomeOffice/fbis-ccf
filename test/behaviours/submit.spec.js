'use strict';

const proxyquire = require('proxyquire');

const mockUtils = {
  sendEmail: sinon.stub()
};

const mockConfig = {
  notify: {
    templateQuery: 'templateQuery',
    srcCaseworkEmail: 'srcCaseworkEmail'
  }
};

const mockUUID = {
  v4: () => 'mockUUID'
};

const Behaviour = proxyquire('../../apps/fbis-ccf/behaviours/submit', {
  '../../../lib/utils': mockUtils,
  '../../../config': mockConfig,
  'uuid': mockUUID
});


describe('Submit behaviour', () => {

  let req;
  let res;
  let Submit;
  let testInstance;
  let nextStub;

  beforeEach(() => {
    req = {
      form: {
        historicalValues: {}
      }
    };

    res = {};
  });

  describe('saveValues', () => {

    class Base {
      saveValues() {}
    }

    beforeEach(() => {
      Submit = Behaviour(Base);
      testInstance = new Submit();

      mockUtils.sendEmail.resolves();
      nextStub = sinon.stub();
    });

    afterEach(() => {
      mockUtils.sendEmail.resetHistory();
    });

    it('should call utils \'sendEmail\' with template query, SRC casework email, and a UUID', () => {
      testInstance.saveValues(req, res, nextStub)
        .then(() => {
          expect(mockUtils.sendEmail).to.have.been.calledOnceWith('templateQuery', 'srcCaseworkEmail', 'mockUUID');
        });
    });

    it('should call utils \'sendEmail\' with emailData containing only necessary fields from the form', () => {
      req.form.historicalValues = {
        'some-unwanted-field': 'unwanted value',
        'applicant-name': 'test name',
        'applicant-phone': 'test phone',
        'application-number': 'test number',
        email: 'test mail',
        identity: 'yes',
        organisation: 'test org',
        query: 'test query',
        question: 'account',
        'representative-name': 'test name',
        'representative-phone': 'test phone'
      };

      const expected = {
        'applicant-name': 'test name',
        'applicant-phone': 'test phone',
        'application-number': 'test number',
        email: 'test mail',
        identity: 'yes',
        organisation: 'test org',
        query: 'test query',
        question: 'account',
        'representative-name': 'test name',
        'representative-phone': 'test phone'
      };

      testInstance.saveValues(req, res, nextStub)
        .then(() => {
          expect(mockUtils.sendEmail).to.have.been
            .calledOnceWith('templateQuery', 'srcCaseworkEmail', 'mockUUID', expected);
        });
    });

    it('should call substitute falsy form fields with \'n/a\'', () => {
      req.form.historicalValues = {
        'applicant-name': 'test name',
        'applicant-phone': '',
        'application-number': null,
        email: 'test mail',
        identity: 'no',
        organisation: undefined,
        query: 'test query',
        question: 'account',
        'representative-name': false,
        'representative-phone': false
      };

      const expected = {
        'applicant-name': 'test name',
        'applicant-phone': 'n/a',
        'application-number': 'n/a',
        email: 'test mail',
        identity: 'no',
        organisation: 'n/a',
        query: 'test query',
        question: 'account',
        'representative-name': 'n/a',
        'representative-phone': 'n/a'
      };

      testInstance.saveValues(req, res, nextStub)
        .then(() => {
          expect(mockUtils.sendEmail).to.have.been
            .calledOnceWith('templateQuery', 'srcCaseworkEmail', 'mockUUID', expected);
        });
    });

    it('should pass the error to the next middleware step if there is an error sending the email', () => {
      mockUtils.sendEmail.rejects('testError');
      testInstance.saveValues(req, res, nextStub)
        .catch(() => {
          expect(nextStub).to.have.been.calledOnceWith('testError');
        });
    });

  });

});
