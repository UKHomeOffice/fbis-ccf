'use strict';
/* eslint no-process-env: 0 */

module.exports = {
  notify: {
    apiKey: process.env.NOTIFY_KEY,
    srcCaseworkEmail: process.env.SRC_CASEWORK_EMAIL,
    templateQuery: process.env.TEMPLATE_QUERY
  }
};
