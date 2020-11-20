'use strict';
/* eslint no-process-env: 0 */

module.exports = {
  submitThrottleTimeout: 1000,
  notify: {
    apiKey: process.env.NOTIFY_KEY,
    feedbackEmailReference: 'feedback-email-reference',
    feedbackEmail: process.env.FEEDBACK_EMAIL,
    mockApiKey: process.env.MOCK_NOTIFY_KEY,
    srcCaseworkEmail: process.env.SRC_CASEWORK_EMAIL,
    statusRetryLimit: 30,
    statusRetryInterval: 1000,
    submitEmailReference: 'submit-email-reference',
    templateFeedback: process.env.TEMPLATE_FEEDBACK,
    templateQuery: process.env.TEMPLATE_QUERY,
  }
};
