'use strict';

module.exports = superclass => class ClearSession extends superclass {
  getValues(req, res, next) {
    req.sessionModel.reset();
    return super.getValues(req, res, next);
  }
};
