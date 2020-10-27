'use strict';

module.exports = {
  identity: {
    mixin: 'radio-group',
    validate: ['required'],
    options: ['no', 'yes']
  },
  'representative-name': {
    validate: ['required']
  },
  'representative-phone': {},
  organisation: {},
  query: {
    mixin: 'textarea',
    validate: ['required', { type: 'maxlength', arguments: 500 }],
  },
  'applicant-name': {
    validate: ['required'],
  },
  email: {
    validate: ['required', 'email'],
  },
  'applicant-phone': {},
  'application-number': {
    validate: ['required'],
  },
  question: {
    mixin: 'radio-group',
    validate: ['required'],
    options: ['id-check', 'status', 'account'],
    legend: {
      className: 'visuallyhidden'
    }
  }
};
