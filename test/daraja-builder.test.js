const chai = require('chai');
const { DarajaBuilder, Daraja } = require('../dist');
const { DarajaConfigError } = require('../dist/lib/errors');
const {
  MISSING_APP_SHORTCODE,
  MISSING_APP_CONSUMER_KEY,
  MISSING_APP_CONSUMER_SECRET,
  MISSING_PASSKEY_PARAMETER
} = require('../dist/lib/errors/constants');

const expect = chai.expect;

describe('DarajaBuilder', () => {
  describe('constructor', () => {
    it('should throw DarajaConfigError when the parameters are missing', () => {
      expect(() => new DarajaBuilder()).to.throw(
        DarajaConfigError,
        MISSING_APP_SHORTCODE
      );
      expect(() => new DarajaBuilder(12345)).to.throw(
        DarajaConfigError,
        MISSING_APP_CONSUMER_KEY
      );
      expect(() => new DarajaBuilder(12345, 'key')).to.throw(
        DarajaConfigError,
        MISSING_APP_CONSUMER_SECRET
      );
    });
  });

  describe('addLipaNaMpesaPasskey()', () => {
    it('should throw DarajaConfigError when the passkey is not passed', () => {
      expect(() =>
        new DarajaBuilder(12345, 'key', 'secret').addLipaNaMpesaPasskey()
      ).to.throw(DarajaConfigError, MISSING_PASSKEY_PARAMETER);
    });
    it('should return a DarajaBuilder instance with set passkey', () => {
      expect(
        new DarajaBuilder(12345, 'key', 'secret').addLipaNaMpesaPasskey(
          'passkey'
        )
      ).to.have.property('lipaNaMpesaPasskey', 'passkey');
    });
  });

  describe('build()', () => {
    it('should return a configured Daraja instance', () => {
      expect(
        new DarajaBuilder(12345, 'key', 'secret').build()
      ).to.be.an.instanceOf(Daraja);
      expect(
        new DarajaBuilder(12345, 'key', 'secret')
          .addLipaNaMpesaPasskey('passkey')
          .build().config
      ).to.have.property('lipaNaMpesaPasskey', 'passkey');
    });
  });
});
