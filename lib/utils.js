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

const getEmail = reference => {
  return notifyClient.getNotifications(undefined, undefined, reference)
    .then(res => res.data.notifications[0])
    .catch(() => undefined);
};

const sleep = ms => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

const pollEmailStatus = (reference, tries, ms) => {
  if (tries >= config.notify.statusRetryLimit) {
    return new Promise((resolve, reject) => {
      return reject(new Error('Exceeded email status check retry limit'));
    });
  }

  return sleep(ms)
    .then(() => getEmail(reference))
    .then(email => email ? true : module.exports.pollEmailStatus(reference, tries + 1));
};

module.exports = {
  getEmail,
  pollEmailStatus,
  sendEmail,
  sleep
};
