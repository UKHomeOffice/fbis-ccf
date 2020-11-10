'use strict';

const notify = require('../../../config').notify;
const sendEmail = require('../../../lib/utils').sendEmail;
const fields = require('../fields/index');
const uuidv4 = require('uuid').v4;

module.exports = superclass => class Submit extends superclass {

  saveValues(req, res, next) {
    let emailData = Object.keys(fields).reduce((data, field) => {
      data[field] = req.form.historicalValues[field] || 'n/a';
      return data;
    }, {});

    const reference = uuidv4();

    return sendEmail(notify.templateQuery, notify.srcCaseworkEmail, reference, emailData)
      .then(() => {
        req.log('info', 'Email sent to SRC casework address', `reference=${reference}`);
        return super.saveValues(req, res, next);
      })
      .catch(error => {
        req.log('error', 'Error sending email to SRC casework address', `reference=${reference}`, error);
        return next(error);
      });
  }

};
