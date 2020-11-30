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
    validate: ['required']
  },
  'applicant-last-names': {
    validate: ['required']
  },
  'application-number': {},
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
  'applicant-phone': {}
};
