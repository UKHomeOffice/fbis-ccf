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
      next: '/query'
    },
    '/query': {
      behaviours: [setQuestion],
      fields: ['query', 'name', 'email', 'phone', 'application-number'],
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
