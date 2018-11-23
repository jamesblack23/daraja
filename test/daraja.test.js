const chai = require('chai');
const {
  lipaNaMpesaShortcode,
  consumerKey,
  consumerSecret
} = require('./config');
const { DarajaBuilder } = require('../dist');
const { MpesaCredentialsError } = require('../dist/lib/errors');

chai.use(require('chai-as-promised'));
const expect = chai.expect;

describe('setAccessToken()', () => {
  let mpesa;

  beforeEach(() => {
    mpesa = new DarajaBuilder(
      lipaNaMpesaShortcode,
      consumerKey,
      consumerSecret
    ).build();
  });

  it('should throw MpesaCredentialsError when credentials are invalid', () =>
    expect(
      new DarajaBuilder(lipaNaMpesaShortcode, 'key', 'secret')
        .build()
        .setAccessToken()
    ).to.eventually.be.rejectedWith(
      MpesaCredentialsError,
      'Bad Request: Invalid Credentials'
    ));

  it('should throw MpesaCredentialsError when environment is wrong', () =>
    expect(
      new DarajaBuilder(lipaNaMpesaShortcode, 'key', 'secret', 'production')
        .build()
        .setAccessToken()
    ).to.eventually.be.rejectedWith(
      MpesaCredentialsError,
      'Bad Request: Invalid Credentials'
    ));

  it('should set the access token and expiry date when credentials are valid', async () => {
    const oldToken = mpesa.accessToken;
    const oldTokenExpiry = mpesa.accessTokenExpiry;
    await mpesa.setAccessToken();
    expect(mpesa.accessToken).to.not.equal(oldToken);
    expect(mpesa.accessTokenExpiry.isAfter(oldTokenExpiry)).to.be.true;
  });
});
