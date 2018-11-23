const chai = require('chai');
chai.use(require('chai-as-promised'));
const { DarajaBuilder } = require('../dist');
const { MpesaCredentialsError } = require('../dist/lib/errors');
const { INVALID_CREDENTIALS } = require('../dist/lib/errors/constants');
const {
  lipaNaMpesaShortcode,
  consumerKey,
  consumerSecret
} = require('./config');
const expect = chai.expect;

describe('Daraja', () => {
  let daraja;
  beforeEach(() => {
    daraja = new DarajaBuilder(
      lipaNaMpesaShortcode,
      consumerKey,
      consumerSecret
    ).build();
  });
  describe('setAccessToken()', () => {
    it('should throw MpesaCredentialsError when the credentials are invalid', () =>
      expect(
        new DarajaBuilder(lipaNaMpesaShortcode, 'key', 'secret')
          .build()
          .setAccessToken()
      ).to.eventually.be.rejectedWith(
        MpesaCredentialsError,
        INVALID_CREDENTIALS
      ));
    it('should throw MpesaCredentialsError when the credentials are invalid', () => {
      return expect(
        new DarajaBuilder(
          lipaNaMpesaShortcode,
          consumerKey,
          consumerSecret,
          'production'
        )
          .build()
          .setAccessToken()
      ).to.eventually.be.rejectedWith(
        MpesaCredentialsError,
        INVALID_CREDENTIALS
      );
    });
    it('should set the access token and expiry date', async () => {
      const oldToken = daraja.accessToken;
      const oldExpiryDate = daraja.accessTokenExpiry;
      await daraja.setAccessToken();
      expect(daraja.accessToken).to.not.equal(oldToken);
      expect(daraja.accessTokenExpiry.isAfter(oldExpiryDate)).to.be.true;
    });
  });
});
