'use strict';

const config = require('./ui-test-config');

module.exports = class MockNotifyClient {

  sendEmail(templateId, emailAddress, options) {
    const isInvalidEmail = options.personalisation.email === config.notifyFailureEmail;
    const isInvalidFeedbackEmail = options.personalisation.feedbackEmail === config.notifyFailureEmail;

    if (isInvalidEmail || isInvalidFeedbackEmail) {
      return Promise.reject(new Error('Mock notify client error'));
    }

    return Promise.resolve();
  }

  getNotifications() {
    return Promise.resolve({
      data: {
        notifications: [{
          status: 'delivered'
        }]
      }
    });
  }

};
