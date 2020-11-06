'use strict';

const config = require('../../../config');
const sendEmail = require('../../../lib/utils').sendEmail;
const fields = require('../fields/index');
const uuidv4 = require('uuid').v4;

module.exports = superclass => class Submit extends superclass {

  saveValues(req, res, next) {
    let emailData = Object.keys(fields).reduce((data, field) => {
      data[field] = req.form.historicalValues[field] || 'n/a';
      return data;
    }, {});

    return sendEmail(config.notify.templateQuery, config.notify.srcCaseworkEmail, uuidv4(), emailData)
      .then(() => super.saveValues(req, res, next))
      .catch(error => next(error));
  }

};
