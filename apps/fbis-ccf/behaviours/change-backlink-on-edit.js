'use strict';

module.exports = superclass => class disableBacklinkOnEdit extends superclass {
  locals(req, res) {
    const locals = super.locals(req, res);

    const isChangeLinkEdit = req.url.includes('/edit');

    if (!isChangeLinkEdit) {
      return locals;
    }

    locals.backLink = req.headers.referer;

    return locals;
  }
};
