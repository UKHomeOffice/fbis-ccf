'use strict';


module.exports = superclass => class SetLocationOnSession extends superclass {

  getValues(req, res, next) {
    req.sessionModel.set('in-UK', req.query['outside-UK'] === undefined);
    return super.getValues(req, res, next);
  }

};
