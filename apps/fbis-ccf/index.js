'use strict';

const addLocationToBacklink = require('./behaviours/add-location-to-backlink');
const setLocation = require('./behaviours/set-location');
const setQuestion = require('./behaviours/set-question');
const summaryPage = require('hof-behaviour-summary-page');

module.exports = {
  name: 'fbis-ccf',
  baseUrl: '',
  steps: {
    '/landing': {
      behaviours: [setLocation],
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
          value: 'yes'
        }
      }],
    },
    '/details': {
      fields: ['representative-name', 'representative-phone', 'organisation'],
      next: '/query'
    },
    '/query': {
      behaviours: [setQuestion],
      fields: ['query', 'applicant-name', 'email', 'applicant-phone', 'application-number'],
      next: '/confirm'
    },
    '/confirm': {
      behaviours: ['complete', summaryPage],
      next: '/complete'
    },
    '/complete': {
      template: 'confirmation'
    }
  }
};
