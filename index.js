'use strict';

const hof = require('hof');

const settings = require('./hof.settings');

settings.routes = settings.routes.map(route => require(route));
settings.root = __dirname;
settings.start = false;

const app = hof(settings);

app.use((req, res, next) => {
  res.locals.feedbackUrl = '/feedback';
  next();
});

module.exports = app;
