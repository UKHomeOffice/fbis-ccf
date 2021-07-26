'use strict';
const notify = require('../../../config').notify;

module.exports = superclass => class ClearFeedback extends superclass {
  getValues(req, res, next) {
    req.sessionModel.unset([
      'feedbackRating',
      'feedbackText',
      'feedbackEmail'
    ]);

    return super.getValues(req, res, next);
  }

  successHandler(req, res) {
    const referer = req.sessionModel.get('feedbackReturnTo') || `${req.get('origin')}/start`;
    req.sessionModel.unset(['feedbackReturnTo', notify.feedbackEmailReference]);
    return res.redirect(referer);
  }
};
