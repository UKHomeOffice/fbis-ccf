'use strict';
var $ = require('jquery');

$(document).ready(function submissionPending() {

  var $inputSubmit = $(document).find('#confirm-column input[type="submit"]');

  if (!$inputSubmit.length) {
    return;
  }

  $('form').submit(function showPostSubmit() {
    $('.link-back, header, #pre-submit').each(function hide() {
      $(this).addClass('hidden');
    });
    $(document).find('#post-submit').removeClass('hidden');
  });

});
