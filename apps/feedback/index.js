'use strict';

const submitFeedback = require('./behaviours/feedback');
const clearFeedback = require('./behaviours/clear-feedback');

module.exports = {
  name: 'feedback',
  steps: {
    '/feedback': {
      fields: ['feedbackRating', 'feedbackText', 'feedbackEmail'],
      behaviours: [submitFeedback],
      next: '/feedback-submitted'
    },
    '/feedback-submitted': {
      behaviours: [clearFeedback],
      backLink: false
    }
  }
};
