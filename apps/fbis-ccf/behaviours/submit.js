'use strict';

const notify = require('../../../config').notify;
const utils = require('../../../lib/utils');
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

    const emailData = Submit.formatEmailData(req.form.historicalValues);

    return utils.sendEmail(notify.templateQuery, notify.srcCaseworkEmail, reference, emailData)
      .then(() => Submit.handleSuccess(req, next, reference, true))
      .catch(err => Submit.handleError(req, next, reference, err, true));
  }

  static formatEmailData(values) {
    const firstNames = values['in-UK'] ? 'First names: ' : 'Given names: ';
    const lastNames = values['in-UK'] ? 'Last names: ' : 'Family names: ';

    return {
      'applicant-first-names': `${firstNames}${values['applicant-first-names']}`,
      'applicant-last-names': `${lastNames}${values['applicant-last-names']}`,
      email: `Email address: ${values.email}`,
      identity: values.identity,
      location: values['in-UK'] ? 'Inside UK' : 'Outside UK',
      query: values.query,
      question: Submit.getDescriptiveQuestionString(values.question, true),
      'phone': values.phone
        ? `Phone number: ${values.phone}`
        : '',
      'application-number': values['application-number']
        ? `Unique application number (UAN): ${values['application-number']}`
        : '',
      organisation: values.organisation
        ? `Organisation: ${values.organisation}`
        : '',
      'representative-first-names': values['representative-first-names']
        ? `${firstNames}${values['representative-first-names']}`
        : '',
      'representative-last-names': values['representative-last-names']
        ? `${lastNames}${values['representative-last-names']}`
        : ''
    };
  }

  static getDescriptiveQuestionString(question, capitalised) {
    const descriptiveQuestion = questionOptions[question].label;
    return capitalised
      ? descriptiveQuestion
      : descriptiveQuestion[0].toLowerCase() + descriptiveQuestion.slice(1);
  }

  static handleSuccess(req, next, reference, shouldLog) {
    if (shouldLog) {
      req.log('info', 'Email sent to SRC casework address', `reference=${reference}`);

      const firstNames = req.form.historicalValues['applicant-first-names'];
      const lastNames = req.form.historicalValues['applicant-last-names'];

      utils.sendEmail(notify.templateConfirmation, req.form.historicalValues.email, uuidv4(), {
        'applicant-name': `${firstNames} ${lastNames}`,
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
