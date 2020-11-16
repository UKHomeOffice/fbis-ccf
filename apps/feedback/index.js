'use strict';

const submitFeedback = require('./behaviours/feedback');
const feedbackSubmitted = require('./behaviours/feedback-submitted');

module.exports = {
  name: 'feedback',
  steps: {
    '/feedback': {
      fields: ['feedbackRating', 'feedbackText', 'feedbackEmail'],
      behaviours: [submitFeedback],
      next: '/feedback-submitted'
    },
    '/feedback-submitted': {
      behaviours: [feedbackSubmitted],
      backLink: false
    }
  }
};
