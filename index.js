'use strict';

const hof = require('hof');

const addDynamicSettings = (settings) => {
  settings.routes = settings.routes.map(route => require(route));
  settings.root = __dirname;

  // suppress logs when running the app in silent mode for automation testing, so app logs do not mix with test logs
  if (process.argv.some(commandLineArgument => commandLineArgument === 'silent')) {
    settings.loglevel = 'silent';
  }

  return settings;
};

const addGenericLocals = (req, res, next) => {
  res.locals.htmlLang = 'en';
  res.locals.feedbackUrl = '/feedback';
  res.locals.footerSupportLinks = [
    { path: '/cookies', property: 'base.cookies' },
    { path: '/terms-and-conditions', property: 'base.terms' },
    { path: '/accessibility', property: 'base.accessibility' },
  ];
  return next();
};

/*
 During automation test setup, we ping the app with '?automation-test' query to check it is ready before running tests.
 Put a cookie on this request so it doesn't fail HOF-middleware cookie check.
*/
const addAutomationTestCookie = (req, res, next) => {
  if (req.query['automation-test'] !== undefined) {
    req.cookies.testCookie = 'test';
  }
  return next();
};

const app = hof(addDynamicSettings(require('./hof.settings')));

app.use((req, res, next) => addGenericLocals(req, res, next));
app.use('/start', (req, res, next) => addAutomationTestCookie(req, res, next));

app.use('/terms-and-conditions', (req, res, next) => {
  res.locals = Object.assign({}, res.locals, req.translate('terms'));
  next();
});

app.use('/cookies', (req, res, next) => {
  res.locals = Object.assign({}, res.locals, req.translate('cookies'));
  next();
});

module.exports = app;
