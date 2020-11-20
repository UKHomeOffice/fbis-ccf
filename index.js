'use strict';

const hof = require('hof');
const path = require('path');

const settings = require('./hof.settings');

settings.routes = settings.routes.map(route => require(route));
settings.root = __dirname;
settings.start = false;
settings.views = path.resolve(__dirname, './apps/common/views');
settings.translations = './apps/common/translations';

// suppress logs when running the app in silent mode for automation testing, so app logs do not mix with test logs
if (process.argv.some(commandLineArgument => commandLineArgument === 'silent')) {
  settings.loglevel = 'silent';
}

const app = hof(settings);

/*
 During automation test setup, we ping the app with '?automation-test' query to check it is ready before running tests.
 Put a cookie on this request so it doesn't fail HOF-middleware cookie check.
*/
app.use('/landing', (req, res, next) => {
  if (req.query['automation-test'] !== undefined) {
    req.cookies.testCookie = 'test';
  }
  return next();
});

app.use((req, res, next) => {
  res.locals.feedbackUrl = '/feedback';
  next();
});

module.exports = app;
