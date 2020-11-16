'use strict';
/* eslint no-process-env: 0 */

module.exports = {
  submitThrottleTimeout: 1000,
  notify: {
    apiKey: process.env.NOTIFY_KEY,
    templateQuery: process.env.TEMPLATE_QUERY,
    submitEmailSessionName: 'submit-email-reference',
    srcCaseworkEmail: process.env.SRC_CASEWORK_EMAIL,
    templateFeedback: process.env.TEMPLATE_FEEDBACK,
    feedbackEmailSessionName: 'feedback-email-reference',
    feedbackEmail: process.env.FEEDBACK_EMAIL,
    statusRetryLimit: 5,
    statusRetryInterval: 1000
  }
};
