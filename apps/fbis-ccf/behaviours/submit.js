'use strict';

const notify = require('../../../config').notify;
const utils = require('../../../lib/utils');
const fields = require('../fields/index');
const questionOptions = require('../translations/src/en/fields').question.options;
const uuidv4 = require('uuid').v4;

module.exports = superclass => class Submit extends superclass {

  saveValues(req, res, next) {
    let reference = req.sessionModel.get(notify.submitEmailReference);

    /*
      If there is already an email reference on the session (i.e. this is not the first submit attempt because
      the user has clicked submit multiple times), don't resend the email. Check its status and resolve accordingly.
    */
    if (reference) {
      return utils.pollEmailStatus(reference, 0, notify.statusRetryInterval)
        .then(() => Submit.handleSuccess(req, next, reference, false))
        .catch(err => Submit.handleError(req, next, reference, err, false));
    }

    /*
      If there is not an email reference on the session (i.e. this is the first time the user clicked submit)
      create a reference, add it to the session, and send the email with the same reference.
     */
    reference = uuidv4();
    req.sessionModel.set(notify.submitEmailReference, reference);
    req.session.save();

    let emailData = Object.keys(fields).reduce((data, field) => {
      if (field === 'question') {
        const question = req.form.historicalValues.question;
        data.question = Submit.getDescriptiveQuestionString(question);
        return data;
      }

      data[field] = req.form.historicalValues[field] || 'n/a';
      return data;
    }, {});

    emailData.location = ((req.form.historicalValues['in-UK'] === true) ? 'Inside UK' : 'Outside UK');

    return utils.sendEmail(notify.templateQuery, notify.srcCaseworkEmail, reference, emailData)
      .then(() => Submit.handleSuccess(req, next, reference, true))
      .catch(err => Submit.handleError(req, next, reference, err, true));
  }

  static getDescriptiveQuestionString(question) {
    const descriptiveQuestion = questionOptions[question].label;
    return descriptiveQuestion[0].toLowerCase() + descriptiveQuestion.slice(1);
  }

  static handleSuccess(req, next, reference, shouldLog) {
    if (shouldLog) {
      req.log('info', 'Email sent to SRC casework address', `reference=${reference}`);

      utils.sendEmail(notify.templateConfirmation, req.form.historicalValues.email, uuidv4(), {
        'applicant-name': req.form.historicalValues['applicant-name'],
        question: this.getDescriptiveQuestionString(req.form.historicalValues.question)
      });
    }
    return next();
  }

  static handleError(req, next, reference, err, shouldLog) {
    if (shouldLog) {
      req.log('error', 'Error sending email to SRC casework address', `reference=${reference}`, err);
    }
    req.sessionModel.unset(notify.submitEmailReference);
    return next(err);
  }

};
