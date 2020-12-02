'use strict';

function uan(value) {
  return typeof value === 'string' && (value === '' || !!value.match(/^(1212|3434)(-\d{4})(-\d{4})(-\d{4})$/));
}

module.exports = {
  uan
};
