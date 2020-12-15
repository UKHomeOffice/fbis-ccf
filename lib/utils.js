'use strict';

const config = require('../config');
const apiKey = config.notify.apiKey;
const NotifyClient = apiKey === 'UI_MOCK'
  ? require('../test/ui/mock-notify-client')
  : require('notifications-node-client').NotifyClient;
const notifyClient = new NotifyClient(config.notify.apiKey);

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
      const emailCreated = !!res;
      const emailFailed = res && res.status.indexOf('failure') !== -1;

      if (emailCreated && !emailFailed) {
        return true;
      }

      if (!emailCreated) {
        return module.exports.pollEmailStatus(reference, tries + 1, config.notify.statusRetryInterval);
      }

      return Promise.reject(new Error('Failure between Notify and their email provider'));
    });
};

const sendEmail = (templateId, emailAddress, reference, data) => {
  return notifyClient.sendEmail(templateId, emailAddress, {
    personalisation: data,
    reference
  });
};

module.exports = {
  getEmail,
  pollEmailStatus,
  sendEmail,
};
