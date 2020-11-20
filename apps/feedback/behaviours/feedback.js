'use strict';

const notify = require('../../../config').notify;
const utils = require('../../../lib/utils');
const uuidv4 = require('uuid').v4;

module.exports = superclass => class Feedback extends superclass {

  getValues(req, res, next) {

    const redirectFrom = req.headers.referer;
    const isRedirectFromFeedback = redirectFrom.endsWith('/feedback');

    if (redirectFrom && !isRedirectFromFeedback) {
      req.sessionModel.set('feedbackReturnTo', redirectFrom);
    }

    return super.getValues(req, res, next);
  }

  saveValues(req, res, next) {
    let reference = req.sessionModel.get(notify.feedbackEmailReference);

    if (reference) {
      return utils.pollEmailStatus(reference, 0, notify.statusRetryInterval)
        .then(() => Feedback.handleSuccess(req, next, reference, false))
        .catch(err => Feedback.handleError(req, next, reference, err, false));
    }

    reference = uuidv4();
    req.sessionModel.set(notify.feedbackEmailReference, reference);
    req.session.save();

    const emailData = {
      feedbackRating: req.form.values.feedbackRating,
      feedbackText: req.form.values.feedbackText,
      feedbackEmail: req.form.values.feedbackEmail || 'n/a'
    };

    return utils.sendEmail(notify.templateFeedback, notify.feedbackEmail, reference, emailData)
      .then(() => Feedback.handleSuccess(req, next, reference, true))
      .catch(err => Feedback.handleError(req, next, reference, err, true));
  }

  static handleSuccess(req, next, reference, shouldLog) {
    if (shouldLog) {
      req.log('info', 'Feedback sent to feedback address', `reference=${reference}`);
    }
    return next();
  }

  static handleError(req, next, reference, err, shouldLog) {
    if (shouldLog) {
      req.log('error', 'Error sending feedback email to feedback address', `reference=${reference}`, err);
    }
    req.sessionModel.unset(notify.feedbackEmailReference);
    return next(err);
  }

};
