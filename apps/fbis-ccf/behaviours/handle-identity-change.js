'use strict';

module.exports = superclass => class HandleIdentityChange extends superclass {

  saveValues(req, res, next) {
    const isChangeLinkEdit = req.url.includes('/edit');

    if (!isChangeLinkEdit) {
      return super.saveValues(req, res, next);
    }

    const previousIdentity = req.sessionModel.get('identity');
    const newIdentity = req.form.values.identity;

    if (previousIdentity === 'Yes' && newIdentity === 'No') {
      req.sessionModel.set('representative-first-names', '');
      req.sessionModel.set('representative-last-names', '');
      req.sessionModel.set('organisation', '');
      return super.saveValues(req, res, next);
    }

    if (previousIdentity === 'No' && newIdentity === 'Yes') {
      req.sessionModel.set('identity', newIdentity);
      return res.redirect(`${req.get('origin')}/representative-details/edit`);
    }

    return super.saveValues(req, res, next);
  }

};
