'use strict';

const notify = require('../../../config').notify;
const sendEmail = require('../../../lib/utils').sendEmail;
const uuidv4 = require('uuid').v4;

module.exports = superclass => class extends superclass {

  getValues(req, res, next) {

    const redirectFrom = req.headers.referer;
    const redirectFromFeedback = redirectFrom.endsWith('/feedback');

    if (redirectFrom && redirectFromFeedback !== true) {
      req.sessionModel.set('feedbackReturnTo', redirectFrom);
    }

    return super.getValues(req, res, next);
  }

  saveValues(req, res, next) {

    const reference = uuidv4();

    return sendEmail(notify.templateFeedback, notify.feedbackEmail, reference, {
      feedbackRating: req.form.values.feedbackRating,
      feedbackText: req.form.values.feedbackText,
      feedbackEmail: req.form.values.feedbackEmail
    })
      .then(() => {
        req.log('info', 'Feedback sent to feedback address', `reference=${reference}`);
        return super.saveValues(req, res, next);
      })
      .catch(err => {
        req.log('error', 'Error sending feedback email to feedback address', `reference=${reference}`, err);
        return next(err);
      });
  }

};
