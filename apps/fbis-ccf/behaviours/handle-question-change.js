'use strict';

module.exports = superclass => class HandleQuestionChange extends superclass {

  saveValues(req, res, next) {
    const isChangeLinkEdit = req.url.includes('/edit');

    if (!isChangeLinkEdit) {
      return super.saveValues(req, res, next);
    }

    const previousQuestion = req.sessionModel.get('question');
    const newQuestion = req.form.values.question;

    if (previousQuestion !== 'id-check' && newQuestion === 'id-check') {
      req.sessionModel.set('application-number', '');
    }

    return super.saveValues(req, res, next);
  }

};
