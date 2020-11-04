'use strict';

const addLocationToBacklink = require('./behaviours/add-location-to-backlink');
const addUANValidatorIfRequired = require('./behaviours/add-uan-validator-if-required');
const setLocationOnSession = require('./behaviours/set-location-on-session');
const setQuestionFlagsOnValues = require('./behaviours/set-question-flags-on-values');
const summaryPage = require('hof-behaviour-summary-page');
const formatSummaryLocals = require('./behaviours/format-summary-locals');

module.exports = {
  name: 'fbis-ccf',
  baseUrl: '',
  steps: {
    '/landing': {
      behaviours: [setLocationOnSession],
      next: '/question'
    },
    '/question': {
      behaviours: [addLocationToBacklink],
      fields: ['question'],
      template: 'save-and-continue',
      next: '/identity'
    },
    '/identity': {
      fields: ['identity'],
      template: 'save-and-continue',
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
      behaviours: ['complete', summaryPage, formatSummaryLocals],
      next: '/complete'
    },
    '/complete': {
      template: 'confirmation'
    }
  }
};
