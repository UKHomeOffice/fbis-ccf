'use strict';

const customValidators = require('../validators/index');

module.exports = superclass => class AddUANValidatorIfRequired extends superclass {

  process(req, res, next) {
    const isUANRequired = req.sessionModel.get('question') !== 'id-check';

    if (isUANRequired) {
      req.form.options.fields['application-number'].validate = [customValidators.uan, 'required'];
    }

    return super.process(req, res, next);
  }

};
