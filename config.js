'use strict';
/* eslint no-process-env: 0 */

module.exports = {
  notify: {
    apiKey: process.env.NOTIFY_KEY,
    srcCaseworkEmail: process.env.SRC_CASEWORK_EMAIL,
    feedbackEmail: process.env.FEEDBACK_EMAIL,
    templateQuery: process.env.TEMPLATE_QUERY,
    templateFeedback: process.env.TEMPLATE_FEEDBACK
  }
};
