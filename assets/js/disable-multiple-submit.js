'use strict';
var $ = require('jquery');
var throttleTImeout = require('../../config').submitThrottleTimeout;


$(document).ready(function disableMultipleSubmit() {

  $('form').submit(function disable(e) {
    var $inputSubmit = $(this).find('input[type="submit"]');

    if ($inputSubmit.data('throttle') === true) {
      e.preventDefault();
      return;
    }

    $inputSubmit.data('throttle', true);

    setTimeout(() => {
      $inputSubmit.data('throttle', false);
    }, throttleTImeout);
  });

});

