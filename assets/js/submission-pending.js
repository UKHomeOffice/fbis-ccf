'use strict';
var $ = require('jquery');

$(document).ready(function submissionPending() {

  var $inputSubmit = $(document).find('#confirm-column input[type="submit"]');

  if (!$inputSubmit.length) {
    return;
  }

  $('form').submit(function showPostSubmit() {
    // hide back link, check your answers header, and check your answers content
    $('.link-back, #confirm-column header, #pre-submit').each(function hide() {
      $(this).addClass('hidden');
    });
    // reveal submission pending message and spinner
    $(document).find('#post-submit').removeClass('hidden');
  });

});