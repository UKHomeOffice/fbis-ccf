'use strict';

module.exports = {
  'query': {
    mixin: 'textarea',
    validate: ['required'],
  },
  'name': {
    validate: ['required'],
  },
  'application-number': {
    validate: ['required'],
  },
  'name': {
    validate: ['required'],
  },
  'email': {
    validate: ['required', 'email'],
  }
};
