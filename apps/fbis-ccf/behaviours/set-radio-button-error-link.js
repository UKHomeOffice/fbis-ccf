'use strict';

const fields = require('../fields/index');

module.exports = superclass => class SetRadioButtonErrorLink extends superclass {

  errorHandler(err, req, res, next) {
    const errFields = Object.keys(err);

    errFields.forEach(field => {
      if (fields[field] && fields[field].mixin === 'radio-group') {
        err[field].radioKey = `${err[field].key}-${fields[field].options[0]}`;
      }
    });
    return super.errorHandler(err, req, res, next);
  }

};
