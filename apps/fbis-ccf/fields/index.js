'use strict';

module.exports = {
  'query': {
    mixin: 'textarea',
    validate: ['required', { type: 'maxlength', arguments: 500 }],
  },
  'name': {
    validate: ['required'],
  },
  'email': {
    validate: ['required', 'email'],
  },
  'phone': {
    validate: ['required'],
  },
  'application-number': {
    validate: ['required'],
  }
};
