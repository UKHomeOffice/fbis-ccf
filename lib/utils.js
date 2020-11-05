'use strict';

const config = require('../config');
const NotifyClient = require('notifications-node-client').NotifyClient;
const notifyClient = new NotifyClient(config.notify.apiKey);

const sendEmail = (templateId, emailAddress, reference, data) => {
  return notifyClient.sendEmail(templateId, emailAddress, {
    personalisation: data,
    reference
  });
};

module.exports = {
  sendEmail,
};
