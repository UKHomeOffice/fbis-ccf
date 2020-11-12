'use strict';
/* eslint no-process-env: 0 */

module.exports = {
  notify: {
    apiKey: process.env.NOTIFY_KEY,
    templateQuery: process.env.TEMPLATE_QUERY,
    submitEmailSessionName: 'submit-email-reference',
    srcCaseworkEmail: process.env.SRC_CASEWORK_EMAIL,
    statusRetryLimit: 5,
    statusRetryInterval: 1000
  }
};
