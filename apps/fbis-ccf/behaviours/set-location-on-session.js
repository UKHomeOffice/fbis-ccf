'use strict';

module.exports = superclass => class SetLocationOnSession extends superclass {
  getValues(req, res, next) {
    const inUK = req.query['outside-UK'] === undefined;
    req.sessionModel.set('in-UK', inUK);

    return super.getValues(req, res, (err, values) => {
      if (err) {
        return next(err);
      }

      values['in-UK'] = inUK;

      return next(null, values);
    });
  }
};
