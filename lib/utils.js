'use strict';

const config = require('../config');
const useMock = process.argv.some(arg => arg === 'mock-notify');
const NotifyClient = require('notifications-node-client').NotifyClient;
const notifyClient = new NotifyClient(useMock ? config.notify.mockApiKey : config.notify.apiKey);

const getEmailAddress = (emailAddress, data, useMockEmail) => {
  if (!useMockEmail) {
    return emailAddress;
  }

  return data.email || data.feedbackEmail || require('../test/ui/ui-test-config').notifySuccessEmail;
};

const getEmail = reference => {
  return notifyClient.getNotifications(undefined, undefined, reference)
    .then(res => res.data.notifications[0]);
};

const sleep = ms => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

const pollEmailStatus = (reference, tries, ms) => {
  if (tries >= config.notify.statusRetryLimit) {
    return Promise.reject(new Error('Exceeded email status check retry limit'));
  }

  return sleep(ms)
    .then(() => getEmail(reference))
    .then(res => {
      if (!res || res.status === 'created' || res.status === 'sending') {
        return module.exports.pollEmailStatus(reference, tries + 1, config.notify.statusRetryInterval);
      }

      if (res.status === 'delivered') {
        return true;
      }

      return Promise.reject(new Error('Failure between Notify and their email provider'));
    });
};

const sendEmail = (templateId, emailAddress, reference, data) => {
  return notifyClient.sendEmail(templateId, getEmailAddress(emailAddress, data, useMock), {
    personalisation: data,
    reference
  })
    .then(() => pollEmailStatus(reference, 0, config.notify.statusRetryInterval));
};

module.exports = {
  getEmail,
  getEmailAddress,
  pollEmailStatus,
  sendEmail,
};
