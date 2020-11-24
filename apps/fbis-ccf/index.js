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
    '/landing': {
      behaviours: [setLocationOnSession],
      next: '/question'
    },
    '/question': {
      behaviours: [addLocationToBacklink],
      fields: ['question'],
      next: '/identity'
    },
    '/identity': {
      fields: ['identity'],
      next: '/query',
      forks: [{
        target: '/details',
        condition: {
          field: 'identity',
          value: 'Yes'
        }
      }],
    },
    '/details': {
      fields: ['representative-name', 'representative-phone', 'organisation'],
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
