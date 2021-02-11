'use strict';

const addLocationToBacklink = require('./behaviours/add-location-to-backlink');
const addUANValidatorIfRequired = require('./behaviours/add-uan-validator-if-required');
const clearSession = require('./behaviours/clear-session');
const disableBacklinkOnEdit = require('./behaviours/disable-backlink-on-edit');
const handleIdentityChange = require('./behaviours/handle-identity-change');
const handleQuestionChange = require('./behaviours/handle-question-change');
const setLocationOnSession = require('./behaviours/set-location-on-session');
const setQuestionFlagsOnValues = require('./behaviours/set-question-flags-on-values');
const setRadioButtonErrorLink = require('./behaviours/set-radio-button-error-link');
const submit = require('./behaviours/submit');

module.exports = {
  name: 'fbis-ccf',
  steps: {
    '/start': {
      behaviours: [setLocationOnSession],
      next: '/question'
    },
    '/question': {
      behaviours: [addLocationToBacklink, setRadioButtonErrorLink, handleQuestionChange],
      fields: ['question'],
      next: '/identity'
    },
    '/identity': {
      behaviours: [setRadioButtonErrorLink, handleIdentityChange, setQuestionFlagsOnValues],
      fields: ['identity'],
      next: '/applicant-details'
    },
    '/applicant-details': {
      behaviours: [setQuestionFlagsOnValues, addUANValidatorIfRequired, disableBacklinkOnEdit],
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
      behaviours: [disableBacklinkOnEdit],
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
