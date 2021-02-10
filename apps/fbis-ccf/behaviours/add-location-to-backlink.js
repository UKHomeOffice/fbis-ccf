'use strict';

module.exports = superclass => class AddLocationToBacklink extends superclass {

  locals(req, res) {
    let locals = super.locals(req, res);

    if (req.sessionModel.get('in-UK') === false) {
      locals.backLink += '?outside-UK';
    }

    return locals;
  }

};
