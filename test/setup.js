'use strict';

process.env.NODE_ENV = 'test';

global.chai = require('chai');
global.expect = chai.expect;
global.sinon = require('sinon');

chai.use(require('sinon-chai'));
