'use strict';

const options = require('../fields/index').question.options;

module.exports = superclass => class SetQuestionFlagsOnValues extends superclass {
  getValues(req, res, next) {
    return super.getValues(req, res, (err, values) => {
      if (err) {
        return next(err);
      }

      options.forEach(option => {
        values[`is-${option}`] = values.question === option;
      });

      return next(null, values);
    });
  }
};
