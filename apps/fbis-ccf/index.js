'use strict';

const addLocationToBacklink = require('./behaviours/add-location-to-backlink');
const addUANValidatorIfRequired = require('./behaviours/add-uan-validator-if-required');
const clearSession = require('./behaviours/clear-session');
const setLocationOnSession = require('./behaviours/set-location-on-session');
const setQuestionFlagsOnValues = require('./behaviours/set-question-flags-on-values');
const submit = require('./behaviours/submit');

module.exports = {
  name: 'fbis-ccf',
  steps: {
    '/question': {
      behaviours: [setLocationOnSession],
      fields: ['question'],
      next: '/context'
    },
    '/context': {
      behaviours: [addLocationToBacklink],
      next: '/identity',
    },
    '/identity': {
      fields: ['identity'],
      next: '/applicant-details'
    },
    '/applicant-details': {
      behaviours: [setQuestionFlagsOnValues, addUANValidatorIfRequired],
      fields: ['applicant-first-names', 'applicant-last-names', 'application-number'],
      next: '/contact-details',
      forks: [{
        target: '/representative-details',
        condition: {
          field: 'identity',
          value: 'Yes'
        }
      }],
    },
    '/representative-details': {
      fields: ['representative-name', 'representative-phone', 'organisation'],
      next: '/contact-details'
    },
    '/contact-details': {
      next: '/query'
    },
    '/query': {
      behaviours: [setQuestionFlagsOnValues, addUANValidatorIfRequired],
      fields: ['query', 'applicant-name', 'email', 'applicant-phone', 'application-number'],
      next: '/confirm'
    },
    '/confirm': {
      behaviours: [submit],
      next: '/complete'
    },
    '/complete': {
      behaviours: [clearSession]
    }
  }
};
