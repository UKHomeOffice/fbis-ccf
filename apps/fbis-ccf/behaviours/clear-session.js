'use strict';

module.exports = superclass => class ClearSession extends superclass {

  getValues(req, res, next) {
    const email = req.sessionModel.get('email');
    req.sessionModel.reset();
    req.sessionModel.set('previousEmail', email);
    return super.getValues(req, res, next);
  }

};
