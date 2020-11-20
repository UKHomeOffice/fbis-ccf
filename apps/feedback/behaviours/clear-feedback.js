'use strict';

const notify = require('../../../config').notify;

module.exports = superclass => class ClearFeedback extends superclass {

  getValues(req, res, next) {
    req.sessionModel.unset([
      'feedbackRating',
      'feedbackText',
      'feedbackEmail',
      notify.feedbackEmailReference
    ]);

    return super.getValues(req, res, next);
  }

  successHandler(req, res) {
    const referer = req.sessionModel.get('feedbackReturnTo') || `${req.get('origin')}/landing`;
    req.sessionModel.unset('feedbackReturnTo');
    return res.redirect(referer);
  }

};
