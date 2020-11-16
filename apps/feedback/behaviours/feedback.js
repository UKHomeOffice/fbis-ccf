'use strict';

const notify = require('../../../config').notify;
const utils = require('../../../lib/utils');
const uuidv4 = require('uuid').v4;

module.exports = superclass => class Feedback extends superclass {

  getValues(req, res, next) {

    const redirectFrom = req.headers.referer;
    const redirectFromFeedback = redirectFrom.endsWith('/feedback');

    if (redirectFrom && redirectFromFeedback !== true) {
      req.sessionModel.set('feedbackReturnTo', redirectFrom);
    }

    return super.getValues(req, res, next);
  }

  saveValues(req, res, next) {
    let reference = req.sessionModel.get(notify.submitEmailSessionName);

    if (reference) {
      return utils.pollEmailStatus(reference, 0, notify.statusRetryInterval)
        .then(() => Feedback.handleSuccess(req, next, reference, false))
        .catch(err => Feedback.handleError(req, next, reference, err));
    }

    reference = uuidv4();
    req.sessionModel.set(notify.submitEmailSessionName, reference);
    req.session.save();

    return utils.sendEmail(notify.templateFeedback, notify.feedbackEmail, reference, {
      feedbackRating: req.form.values.feedbackRating,
      feedbackText: req.form.values.feedbackText,
      feedbackEmail: req.form.values.feedbackEmail
    })
      .then(() => Feedback.handleSuccess(req, next, reference, true))
      .catch(err => Feedback.handleError(req, next, reference, err));
  }

  static handleSuccess(req, next, reference, shouldLog) {
    if (shouldLog) {
      req.log('info', 'Feedback sent to feedback address', `reference=${reference}`);
    }
    return next();
  }

  static handleError(req, next, reference, err) {
    req.log('error', 'Error sending feedback email to feedback address', `reference=${reference}`, err);
    return next(err);
  }

};
