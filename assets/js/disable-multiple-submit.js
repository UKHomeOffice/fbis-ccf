'use strict';
var $ = require('jquery');
var submitThrottleTimeout = 1000;

$(document).ready(function disableMultipleSubmit() {

  $('form').submit(function disable(e) {
    var $inputSubmit = $(this).find('input[type="submit"]');

    if ($inputSubmit.data('throttle') === true) {
      e.preventDefault();
      return;
    }

    $inputSubmit.data('throttle', true);

    setTimeout(function enable() {
      $inputSubmit.data('throttle', false);
    }, submitThrottleTimeout);
  });

});
