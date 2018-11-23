const chai = require('chai');
const { DarajaBuilder } = require('../dist');
const { DarajaConfigError } = require('../dist/lib/errors');
const {
  MISSING_APP_SHORTCODE,
  MISSING_APP_CONSUMER_KEY,
  MISSING_APP_CONSUMER_SECRET,
  MISSING_PASSKEY_PARAMETER
} = require('../dist/lib/errors/constants');

const expect = chai.expect;

describe('DarajaBuilder', () => {
  const passkey = 'passkey';

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

  describe('addLipaNaMpesaConfig()', () => {
    it('should throw DarajaConfigError when the passkey is not passed', () => {
      expect(() =>
        new DarajaBuilder(12345, 'key', 'secret').addLipaNaMpesaConfig()
      ).to.throw(DarajaConfigError, MISSING_PASSKEY_PARAMETER);
    });
    it('should return a configured DarajaBuilder instance when successful', () => {
      expect(
        new DarajaBuilder(12345, 'key', 'secret').addLipaNaMpesaConfig(passkey)
          .config.lipaNaMpesa
      ).to.have.property(passkey, passkey);
    });
  });

  describe('build()', () => {
    it('should return a configured Daraja instance', () => {
      expect(
        new DarajaBuilder(12345, 'key', 'secret')
          .addLipaNaMpesaConfig(passkey)
          .build().config.lipaNaMpesa
      ).to.have.property(passkey, passkey);
    });
  });
});
