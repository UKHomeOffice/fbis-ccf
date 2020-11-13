'use strict';
var $ = require('jquery');

$(document).ready(function disableMultipleSubmit() {
  $('form').submit(function disable() {
    $(this).find('input[type="submit"]').prop('disabled', true);
  });
});

