const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const {
  consumerKey,
  consumerSecret,
  lipaNaMpesa: { callbackUrl, passkey, phoneNumber, shortcode }
} = require('./config');
const { DarajaBuilder } = require('../dist');
const { DarajaError, MpesaError } = require('../dist/lib/errors');
const {
  INVALID_APP_CREDENTIALS,
  MISSING_AMOUNT_PARAMETER,
  MISSING_SENDER_PARAMETER,
  MISSING_RECIPIENT_PARAMETER,
  MISSING_CALLBACK_URL_PARAMETER,
  MISSING_ACCOUNT_REFERENCE_PARAMETER,
  MISSING_TRANSACTION_DESCRIPTION_PARAMETER,
  MISSING_LIPA_NA_MPESA_CONFIG
} = require('../dist/lib/errors/constants');

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('lipaNaMpesaRequest()', function() {
  this.timeout(0);

  let mpesa, mpesa2;

  before(() => {
    mpesa = new DarajaBuilder(shortcode, consumerKey, consumerSecret)
      .addLipaNaMpesaConfig(passkey)
      .build();
  });

  this.beforeEach(() => {
    mpesa2 = new DarajaBuilder(shortcode, consumerKey, consumerSecret)
      .addLipaNaMpesaConfig(passkey)
      .build();
  });

  it('should throw MpesaError when credentials are invalid', () => {
    mpesa2.consumerKey = 'key';
    return expect(
      mpesa2.lipaNaMpesaRequest(
        1,
        phoneNumber,
        shortcode,
        callbackUrl,
        'test account',
        'test description'
      )
    ).to.eventually.be.rejectedWith(MpesaError, INVALID_APP_CREDENTIALS);
  });

  it('should throw DarajaError when lipa na mpesa is missing in the configuration', () => {
    mpesa2.config.lipaNaMpesa = undefined;
    return expect(
      mpesa2.lipaNaMpesaRequest(
        1,
        phoneNumber,
        shortcode,
        callbackUrl,
        'test account',
        'test description'
      )
    ).to.eventually.be.rejectedWith(DarajaError, MISSING_LIPA_NA_MPESA_CONFIG);
  });

  it('should throw DarajaError when amount parameter is missing', () =>
    expect(mpesa.lipaNaMpesaRequest()).to.eventually.be.rejectedWith(
      DarajaError,
      MISSING_AMOUNT_PARAMETER
    ));
  it('should throw DarajaError when sender parameter is missing', () =>
    expect(mpesa.lipaNaMpesaRequest(1)).to.eventually.be.rejectedWith(
      DarajaError,
      MISSING_SENDER_PARAMETER
    ));
  it('should throw DarajaError when recipient parameter is missing', () =>
    expect(
      mpesa.lipaNaMpesaRequest(1, phoneNumber)
    ).to.eventually.be.rejectedWith(DarajaError, MISSING_RECIPIENT_PARAMETER));
  it('should throw DarajaError when callbackUrl parameter is missing', () =>
    expect(
      mpesa.lipaNaMpesaRequest(1, phoneNumber, shortcode)
    ).to.eventually.be.rejectedWith(
      DarajaError,
      MISSING_CALLBACK_URL_PARAMETER
    ));
  it('should throw DarajaError when accountReference parameter is missing', () =>
    expect(
      mpesa.lipaNaMpesaRequest(1, phoneNumber, shortcode, callbackUrl)
    ).to.eventually.be.rejectedWith(
      DarajaError,
      MISSING_ACCOUNT_REFERENCE_PARAMETER
    ));
  it('should throw DarajaError when transactionDescription parameter is missing', () =>
    expect(
      mpesa.lipaNaMpesaRequest(
        1,
        phoneNumber,
        shortcode,
        callbackUrl,
        'test account'
      )
    ).to.eventually.be.rejectedWith(
      DarajaError,
      MISSING_TRANSACTION_DESCRIPTION_PARAMETER
    ));
  it('should return a string if all parameters are passed', () =>
    expect(
      mpesa.lipaNaMpesaRequest(
        1,
        phoneNumber,
        shortcode,
        callbackUrl,
        'Account Ref',
        'Transaction Desc'
      )
    ).to.eventually.be.a('string'));
});
