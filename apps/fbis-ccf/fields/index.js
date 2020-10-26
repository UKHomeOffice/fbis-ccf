'use strict';

module.exports = {
  query: {
    mixin: 'textarea',
    validate: ['required', { type: 'maxlength', arguments: 500 }],
  },
  name: {
    validate: ['required'],
  },
  email: {
    validate: ['required', 'email'],
  },
  phone: {},
  'application-number': {
    validate: ['required'],
  },
  question: {
    mixin: 'radio-group',
    validate: ['required'],
    options: ['status', 'account', 'id-check'],
    legend: {
      className: 'visuallyhidden'
    }
  },
};
