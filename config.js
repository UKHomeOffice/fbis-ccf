'use strict';
/* eslint no-process-env: 0 */

module.exports = {
  host: (process.env.HOST || 'localhost:8080'),
  notify: {
    apiKey: process.argv.some(arg => arg === 'mock-notify') ? 'UI_MOCK' : process.env.NOTIFY_KEY,
    feedbackEmailReference: 'feedback-email-reference',
    feedbackEmail: process.env.FEEDBACK_EMAIL,
    srcCaseworkEmail: process.env.SRC_CASEWORK_EMAIL,
    statusRetryLimit: 30,
    statusRetryInterval: 1000,
    submitEmailReference: 'submit-email-reference',
    templateConfirmation: process.env.TEMPLATE_CONFIRMATION,
    templateFeedback: process.env.TEMPLATE_FEEDBACK,
    templateQuery: process.env.TEMPLATE_QUERY,
  }
};
