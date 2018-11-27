const chai = require('chai');
const {
  businessShortcode,
  consumerKey,
  consumerSecret
} = require('./config');
const { DarajaBuilder } = require('../dist');
const { MpesaError } = require('../dist/lib/errors');

chai.use(require('chai-as-promised'));
const expect = chai.expect;

describe('setAccessToken()', function() {
  this.timeout(0);
  
  let mpesa;

  beforeEach(() => {
    mpesa = new DarajaBuilder(
      businessShortcode,
      consumerKey,
      consumerSecret
    ).build();
  });

  it('should throw MpesaError when credentials are invalid', () =>
    expect(
      new DarajaBuilder(businessShortcode, 'key', 'secret')
        .build()
        .setAccessToken()
    ).to.eventually.be.rejectedWith(
      MpesaError,
      'Bad Request: Invalid Credentials'
    ));

  it('should throw MpesaError when environment is wrong', () =>
    expect(
      new DarajaBuilder(businessShortcode, 'key', 'secret', 'production')
        .build()
        .setAccessToken()
    ).to.eventually.be.rejectedWith(
      MpesaError,
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
