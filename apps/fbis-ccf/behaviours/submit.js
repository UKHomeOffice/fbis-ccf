'use strict';

const notify = require('../../../config').notify;
const utils = require('../../../lib/utils');
const fields = require('../fields/index');
const uuidv4 = require('uuid').v4;

module.exports = superclass => class Submit extends superclass {

  saveValues(req, res, next) {
    let reference = req.sessionModel.get(notify.submitEmailSessionName);

    /*
      If there is already an email reference on the session (i.e. this is not the first submit attempt because
      the user has clicked submit multiple times), don't resend the email. Check its status and resolve accordingly.
    */
    if (reference) {
      return utils.pollEmailStatus(reference, 0, notify.statusRetryInterval)
        .then(() => Submit.handleSuccess(req, next, reference, false))
        .catch(err => Submit.handleError(req, next, reference, err));
    }

    /*
      If there is not an email reference on the session (i.e. this is the first time the user clicked submit)
      create a reference, add it to the session, and send the email with the same reference.
     */
    reference = uuidv4();
    req.sessionModel.set(notify.submitEmailSessionName, reference);
    req.session.save();

    let emailData = Object.keys(fields).reduce((data, field) => {
      data[field] = req.form.historicalValues[field] || 'n/a';
      return data;
    }, {});

    return utils.sendEmail(notify.templateQuery, notify.srcCaseworkEmail, reference, emailData)
      .then(() => Submit.handleSuccess(req, next, reference, true))
      .catch(err => Submit.handleError(req, next, reference, err));
  }

  static handleSuccess(req, next, reference, shouldLog) {
    if (shouldLog) {
      req.log('info', 'Email sent to SRC casework address', `reference=${reference}`);
    }
    return next();
  }

  static handleError(req, next, reference, err) {
    req.log('error', 'Error sending email to SRC casework address', `reference=${reference}`, err);
    return next(err);
  }

};