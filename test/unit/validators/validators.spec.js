'use strict';

const validators = require('../../../apps/fbis-ccf/validators');

describe('Custom validators', () => {

  describe('uan', () => {

    it('should approve an empty string', () => {
      expect(validators.uan('')).to.equal(true);
    });

    it('should approve a string of 16 digits, hyphen-split into 4 groups of 4, beginning with 1212', () => {
      expect(validators.uan('1212-1230-5896-8432')).to.equal(true);
    });

    it('should approve a string of 16 digits, hyphen-split into 4 groups of 4, beginning with 1212', () => {
      expect(validators.uan('3434-1230-5896-8432')).to.equal(true);
    });

    it('should reject strings of 16 digits, hyphen-split into 4 groups of 4, beginning not with 1212 or 3434', () => {
      expect(validators.uan('1111-1230-5896-8432')).to.equal(false);
    });

    it('should reject strings of 16 digits, not hyphen split into 4 groups of 4', () => {
      expect(validators.uan('1212123058968432')).to.equal(false);
      expect(validators.uan('1212-123058968432')).to.equal(false);
      expect(validators.uan('1212-1230-58968-432')).to.equal(false);
    });

    it('should reject strings with characters that are not digits', () => {
      expect(validators.uan('1212-123O-5896-8432')).to.equal(false);
    });

    it('should reject non-strings', () => {
      expect(validators.uan(1212123058968432)).to.equal(false);
    });

  });

});
