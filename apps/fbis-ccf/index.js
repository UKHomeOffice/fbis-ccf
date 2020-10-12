'use strict';

module.exports = {
  name: 'fbis-ccf',
  baseUrl: '',
  steps: {
    '/name': {
      fields: ['name'],
      next: '/confirm'
    },
    '/confirm': {
      behaviours: ['complete', require('hof-behaviour-summary-page')],
      next: '/complete'
    },
    '/complete': {
      template: 'confirmation'
    }
  }
};
