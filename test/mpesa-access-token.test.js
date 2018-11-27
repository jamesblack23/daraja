const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const { businessShortcode, consumerKey, consumerSecret } = require('./config');
const { DarajaBuilder } = require('../dist');
const { MpesaError } = require('../dist/lib/errors');

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('setAccessToken()', function() {
  this.timeout(0);

  let mpesa;

  before(() => {
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
    ).to.eventually.be.rejectedWith(MpesaError));

  it('should set the access token when credentials are valid', async () => {
    const oldToken = mpesa.accessToken;
    await mpesa.setAccessToken();
    expect(mpesa.accessToken).to.not.equal(oldToken);
  });

  it('should not set new token when current token has not expired', async () => {
    const oldToken = mpesa.accessToken;
    await mpesa.setAccessToken();
    expect(mpesa.accessToken).to.equal(oldToken);
  });
});
