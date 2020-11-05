'use strict';

const Behaviour = require('../../apps/fbis-ccf/behaviours/format-summary-locals');
const fields = require('../../apps/fbis-ccf/translations/src/en/fields');
const pages = require('../../apps/fbis-ccf/translations/src/en/pages');
const translations = { fields, pages};

describe('Format summary locals behaviour', () => {

  let req;
  let res;
  let rows;
  let FormatSummaryLocals;
  let testInstance;

  beforeEach(() => {
    req = {
      translate: (JSONPath) => {
        return JSONPath.split('.').reduce((object, key) => {
          return object && object[key];
        }, translations);
      },
      form: {
        values: {}
      }
    };

    res = {};

  });

  describe('locals', () => {

    class Base {
      locals() {
        return { rows };
      }
    }

    beforeEach(() => {
      FormatSummaryLocals = Behaviour(Base);
      testInstance = new FormatSummaryLocals();
    });


    it('should add descriptive text for id-check if question is id-check', () => {
      rows = [
        { fields: [{}], section: null },
        { fields: [{}], section: null }
      ];

      req.form.values.question = 'id-check';

      const expected = {
        rows: [{
          fields: [{ value: 'The \'ID check\' app' }],
          section: null
        }, {
          fields: [{ label: undefined }],
          section: 'Tell us about a problem with the \'ID check\' app'
        }],
      };

      expect(testInstance.locals(req, res)).to.deep.equal(expected);
    });

    it('should add descriptive text for status if question is status', () => {
      rows = [
        { fields: [{}], section: null },
        { fields: [{}], section: null }
      ];

      req.form.values.question = 'status';

      const expected = {
        rows: [{
          fields: [{ value: 'Viewing or proving your immigration status' }],
          section: null
        }, {
          fields: [{ label: undefined }],
          section: 'Tell us about a problem viewing or proving your immigration status'
        }],
      };

      expect(testInstance.locals(req, res)).to.deep.equal(expected);
    });

    it('should add descriptive text for status if question is account', () => {
      rows = [
        { fields: [{}], section: null },
        { fields: [{}], section: null }
      ];

      req.form.values.question = 'account';

      const expected = {
        rows: [{
          fields: [{ value: 'Updating your immigration account details' }],
          section: null
        }, {
          fields: [{ label: undefined }],
          section: 'Tell us about a problem updating your immigration account details'
        }],
      };

      expect(testInstance.locals(req, res)).to.deep.equal(expected);
    });

    it('should add applicant prefix to field labels if user is a representative', () => {
      rows = [
        {
          fields: [{}],
          section: null
        }, {
          fields: [{
            field: 'applicant-name'
          }, {
            field: 'applicant-phone'
          }, {
            field: 'email'
          }, {
            field: 'application-number'
          }],
          section: null
        }
      ];

      req.form.values.identity = 'Yes';

      const expected = {
        rows: [
          {
            fields: [{ value: undefined }],
            section: null
          }, {
            fields: [{
              field: 'applicant-name',
              label: 'Applicant\'s full name'
            }, {
              field: 'applicant-phone',
              label: 'Applicant\'s phone number (optional)'
            }, {
              field: 'email',
              label: 'Applicant\'s email address'
            }, {
              field: 'application-number',
              label: 'Applicant\'s unique application number (UAN)'
            }],
            section: undefined
          }
        ]
      };

      expect(testInstance.locals(req, rows)).to.deep.equal(expected);
    });

    it('should not add applicant prefix to field labels if user is the applicant', () => {
      rows = [
        {
          fields: [{}],
          section: null
        }, {
          fields: [{
            field: 'applicant-name'
          }, {
            field: 'applicant-phone'
          }, {
            field: 'email'
          }, {
            field: 'application-number'
          }],
          section: null
        }
      ];

      req.form.values.identity = 'No';

      const expected = {
        rows: [
          {
            fields: [{ value: undefined }],
            section: null
          }, {
            fields: [{
              field: 'applicant-name',
              label: 'Full name'
            }, {
              field: 'applicant-phone',
              label: 'Phone number (optional)'
            }, {
              field: 'email',
              label: 'Email address'
            }, {
              field: 'application-number',
              label: 'Unique application number (UAN)'
            }],
            section: undefined
          }
        ]
      };

      expect(testInstance.locals(req, rows)).to.deep.equal(expected);
    });

  });

});
