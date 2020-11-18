'use strict';

module.exports = {
  identity: {
    mixin: 'radio-group',
    validate: ['required'],
    options: ['No', 'Yes']
  },
  'representative-name': {
    validate: ['required']
  },
  'representative-phone': {},
  organisation: {},
  query: {
    mixin: 'textarea',
    validate: ['required', { type: 'maxlength', arguments: 2000 }],
  },
  'applicant-name': {
    validate: ['required'],
  },
  email: {
    validate: ['required', 'email'],
  },
  'applicant-phone': {},
  'application-number': {},
  question: {
    mixin: 'radio-group',
    validate: ['required'],
    options: ['id-check', 'status', 'account'],
    legend: {
      className: 'visuallyhidden'
    }
  }
};
