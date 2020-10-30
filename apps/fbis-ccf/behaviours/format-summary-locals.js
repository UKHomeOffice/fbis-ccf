'use strict';

module.exports = SuperClass => class FormatSummaryLocals extends SuperClass {

  locals(req, res) {
    const locals = super.locals(req, res);
    locals.rows[0] = this.formatQuestionSection(req, locals.rows[0]);
    locals.rows[locals.rows.length - 1] = this.formatQuerySection(req, locals.rows[locals.rows.length - 1]);
    return locals;
  }

  formatQuestionSection(req, questionSection) {
    questionSection.fields[0].value = req.translate(`fields.question.options.${req.form.values.question}.label`);
    return questionSection;
  }

  formatQuerySection(req, querySection) {
    querySection.section = req.translate(`pages.query.header.${req.form.values.question}`);

    querySection.fields.map(field => {
      if (field.field !== 'query') {
        field.label = req.translate(`fields.${field.field}.label.identity.${req.form.values.identity}`);
      }
      return field;
    });

    return querySection;
  }

};
