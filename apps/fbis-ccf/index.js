'use strict';

const addLocationToBacklink = require('./behaviours/add-location-to-backlink');
const addUANValidatorIfRequired = require('./behaviours/add-uan-validator-if-required');
const clearSession = require('./behaviours/clear-session');
const handleIdentityChange = require('./behaviours/handle-identity-change');
const handleQuestionChange = require('./behaviours/handle-question-change');
const setLocationOnSession = require('./behaviours/set-location-on-session');
const setQuestionFlagsOnValues = require('./behaviours/set-question-flags-on-values');
const submit = require('./behaviours/submit');

module.exports = {
  name: 'fbis-ccf',
  steps: {
    '/question': {
      behaviours: [setLocationOnSession, handleQuestionChange],
      fields: ['question'],
      next: '/context'
    },
    '/context': {
      behaviours: [addLocationToBacklink, setQuestionFlagsOnValues],
      next: '/identity',
    },
    '/identity': {
      behaviours: [handleIdentityChange],
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
      fields: ['representative-first-names', 'representative-last-names', 'organisation'],
      next: '/contact-details'
    },
    '/contact-details': {
      fields: ['email', 'phone'],
      next: '/query'
    },
    '/query': {
      fields: ['query'],
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
