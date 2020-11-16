'use strict';

module.exports = {
  'feedbackRating': {
    mixin: 'radio-group',
    validate: ['required'],
    options: ['very-satisfied', 'satisfied', 'neutral', 'dissatisfied', 'very-dissatisfied']
  },
  'feedbackText': {
    mixin: 'textarea',
    validate: ['required']
  },
  'feedbackEmail': {
    validate: ['email']
  }
};
