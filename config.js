'use strict';
/* eslint no-process-env: 0 */

module.exports = {
  submitThrottleTimeout: 1000,
  notify: {
    apiKey: process.env.NOTIFY_KEY,
    feedbackEmailReference: 'feedback-email-reference',
    feedbackEmail: process.env.FEEDBACK_EMAIL,
    srcCaseworkEmail: process.env.SRC_CASEWORK_EMAIL,
    statusRetryLimit: 5,
    statusRetryInterval: 1000,
    submitEmailSessionName: 'submit-email-reference',
    templateFeedback: process.env.TEMPLATE_FEEDBACK,
    templateQuery: process.env.TEMPLATE_QUERY,
  }
};
