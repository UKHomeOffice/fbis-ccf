'use strict';

module.exports = {
  question: {
    mixin: 'radio-group',
    validate: ['required'],
    options: ['id-check', 'status', 'account'],
    legend: {
      className: 'visuallyhidden'
    }
  },
  identity: {
    mixin: 'radio-group',
    validate: ['required'],
    options: ['Yes', 'No']
  },
  'applicant-first-names': {
    validate: ['required', 'notUrl']
  },
  'applicant-last-names': {
    validate: ['required', 'notUrl']
  },
  'application-number': {},
  'representative-first-names': {
    validate: ['required', 'notUrl']
  },
  'representative-last-names': {
    validate: ['required', 'notUrl']
  },
  organisation: {},
  email: {
    validate: ['required', 'email'],
  },
  'phone': {
    validate: ['numeric']
  },
  query: {
    mixin: 'textarea',
    validate: ['required', { type: 'maxlength', arguments: 2000 }],
  }
};
