const chai = require('chai');
const { DarajaBuilder } = require('../dist');
const { DarajaError } = require('../dist/lib/errors');
const {
  MISSING_APP_SHORTCODE,
  MISSING_APP_CONSUMER_KEY,
  MISSING_APP_CONSUMER_SECRET,
  MISSING_PASSKEY_PARAMETER,
  MISSING_INITIATOR_NAME_PARAMETER,
  MISSING_INITIATOR_PASSWORD_PARAMETER
} = require('../dist/lib/errors/constants');

const expect = chai.expect;

describe('DarajaBuilder', () => {
  const passkey = 'passkey';
  const initiatorName = 'initiatorName';
  const initiatorPassword = 'initiatorPassword';

  describe('#generateSecurityCredential()', () => {
    it('should return a string on sandbox', () => {
      expect(
        DarajaBuilder.generateSecurityCredential(initiatorPassword)
      ).to.be.a('string');
    });
    it('should return a string on production', () => {
      expect(
        DarajaBuilder.generateSecurityCredential(
          initiatorPassword,
          'production'
        )
      ).to.be.a('string');
    });
  });

  describe('constructor', () => {
    it('should throw DarajaError when the parameters are missing', () => {
      expect(() => new DarajaBuilder()).to.throw(
        DarajaError,
        MISSING_APP_SHORTCODE
      );
      expect(() => new DarajaBuilder(12345)).to.throw(
        DarajaError,
        MISSING_APP_CONSUMER_KEY
      );
      expect(() => new DarajaBuilder(12345, 'key')).to.throw(
        DarajaError,
        MISSING_APP_CONSUMER_SECRET
      );
    });
  });

  describe('addLipaNaMpesaConfig()', () => {
    it('should throw DarajaError when the passkey is not passed', () => {
      expect(() =>
        new DarajaBuilder(12345, 'key', 'secret').addLipaNaMpesaConfig()
      ).to.throw(DarajaError, MISSING_PASSKEY_PARAMETER);
    });
    it('should return a configured DarajaBuilder instance when successful', () => {
      expect(
        new DarajaBuilder(12345, 'key', 'secret').addLipaNaMpesaConfig(passkey)
          .config.lipaNaMpesa
      ).to.have.property(passkey, passkey);
    });
  });

  describe('addB2CConfig()', () => {
    it('should throw DarajaError when the initiatorName is not passed', () => {
      expect(() =>
        new DarajaBuilder(12345, 'key', 'secret').addB2CConfig()
      ).to.throw(DarajaError, MISSING_INITIATOR_NAME_PARAMETER);
    });
    it('should throw DarajaError when the initiatorPassword is not passed', () => {
      expect(() =>
        new DarajaBuilder(12345, 'key', 'secret').addB2CConfig(initiatorName)
      ).to.throw(DarajaError, MISSING_INITIATOR_PASSWORD_PARAMETER);
    });
    it('should return a configured DarajaBuilder instance when successful', () => {
      const builder = new DarajaBuilder(12345, 'key', 'secret').addB2CConfig(
        initiatorName,
        initiatorPassword
      );
      expect(builder.config.b2c).to.have.property(
        initiatorName,
        initiatorName,
        'initiatorName is not set on b2c config'
      );
      expect(builder.config.b2c).to.have.property('securityCredential');
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
