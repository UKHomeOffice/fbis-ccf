'use strict';

const setLocation = require('./behaviours/set-location');
const addLocationToBacklink = require('./behaviours/add-location-to-backlink');
const summaryPage = require('hof-behaviour-summary-page');

module.exports = {
  name: 'fbis-ccf',
  baseUrl: '',
  steps: {
    '/landing': {
      behaviours: [setLocation],
      template: 'landing',
      next: '/question'
    },
    '/question': {
      behaviours: [addLocationToBacklink],
      next: '/query'
    },
    '/query': {
      fields: ['application-number', 'query', 'name', 'email', 'phone'],
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
