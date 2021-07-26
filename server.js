'use strict';

const path = require('path');
const hof = require('hof');

let settings = require('./hof.settings');

settings = Object.assign({}, settings, {
  root: __dirname,
  behaviours: settings.behaviours.map(require),
  routes: settings.routes.map(require),
  views: settings.views.map(view => path.resolve(__dirname, view))
});

if (process.argv.some(commandLineArgument => commandLineArgument === 'silent')) {
  settings.loglevel = 'silent';
}

const app = hof(settings);

app.use((req, res, next) => {
  res.locals.htmlLang = 'en';
  res.locals.feedbackUrl = '/feedback';
  res.locals.footerSupportLinks = [
    { path: '/cookies', property: 'base.cookies' },
    { path: '/terms-and-conditions', property: 'base.terms' },
    { path: '/accessibility', property: 'base.accessibility' }
  ];
  return next();
});

/*
 During automation test setup, we ping the app with '?automation-test' query to check it is ready before running tests.
 Put a cookie on this request so it doesn't fail HOF-middleware cookie check.
*/
app.use('/start', (req, res, next) => {
  if (req.query['automation-test'] !== undefined) {
    req.cookies.testCookie = 'test';
  }
  return next();
});

app.use('/terms-and-conditions', (req, res, next) => {
  res.locals = Object.assign({}, res.locals, req.translate('terms'));
  next();
});

app.use('/cookies', (req, res, next) => {
  res.locals = Object.assign({}, res.locals, req.translate('cookies'));
  next();
});

module.exports = app;
