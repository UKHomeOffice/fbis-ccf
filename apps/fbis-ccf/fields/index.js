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
    options: {
      status: {
        label: 'Viewing or proving your immigration status'
      },
      account: {
        label: 'Updating your immigration account details'
      },
      'id-check': {
        label: 'The \'ID check\' app'
      }
    },
    legend: {
      className: 'visuallyhidden'
    }
  },
};
