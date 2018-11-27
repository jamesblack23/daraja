const chai = require('chai');
const sinon = require('sinon');
const {
  consumerKey,
  consumerSecret,
  lipaNaMpesa: { shortcode, passkey, phoneNumber, callbackUrl }
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

chai.use(require('chai-as-promised'));
const expect = chai.expect;

describe('lipaNaMpesaRequest()', function() {
  this.timeout(0);

  let mpesa;

  beforeEach(() => {
    mpesa = new DarajaBuilder(shortcode, consumerKey, consumerSecret)
      .addLipaNaMpesaConfig(passkey)
      .build();
  });

  it('should throw MpesaError when credentials are invalid', () => {
    mpesa.consumerKey = 'key';
    return expect(
      mpesa.lipaNaMpesaRequest(
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
    mpesa.config.lipaNaMpesa = undefined;
    return expect(
      mpesa.lipaNaMpesaRequest(
        1,
        phoneNumber,
        shortcode,
        callbackUrl,
        'test account',
        'test description'
      )
    ).to.eventually.be.rejectedWith(DarajaError, MISSING_LIPA_NA_MPESA_CONFIG);
  });

  it('should throw MpesaError when amount parameter is missing', () =>
    expect(mpesa.lipaNaMpesaRequest()).to.eventually.be.rejectedWith(
      DarajaError,
      MISSING_AMOUNT_PARAMETER
    ));
  it('should throw MpesaError when sender parameter is missing', () =>
    expect(mpesa.lipaNaMpesaRequest(1)).to.eventually.be.rejectedWith(
      DarajaError,
      MISSING_SENDER_PARAMETER
    ));
  it('should throw MpesaError when recipient parameter is missing', () =>
    expect(
      mpesa.lipaNaMpesaRequest(1, phoneNumber)
    ).to.eventually.be.rejectedWith(DarajaError, MISSING_RECIPIENT_PARAMETER));
  it('should throw MpesaError when callbackUrl parameter is missing', () =>
    expect(
      mpesa.lipaNaMpesaRequest(1, phoneNumber, shortcode)
    ).to.eventually.be.rejectedWith(
      DarajaError,
      MISSING_CALLBACK_URL_PARAMETER
    ));
  it('should throw MpesaError when accountReference parameter is missing', () =>
    expect(
      mpesa.lipaNaMpesaRequest(1, phoneNumber, shortcode, callbackUrl)
    ).to.eventually.be.rejectedWith(
      DarajaError,
      MISSING_ACCOUNT_REFERENCE_PARAMETER
    ));
  it('should throw MpesaError when transactionDescription parameter is missing', () =>
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
  it('should return a string if all parameters are passed', async () => {
    const spy = sinon.spy(mpesa, 'setAccessToken');
    const response = await mpesa.lipaNaMpesaRequest(
      1,
      phoneNumber,
      shortcode,
      callbackUrl,
      'test account',
      'test description'
    );
    expect(response).to.be.a('string');
    mpesa.config.environment = 'production';
    try {
      await mpesa.lipaNaMpesaRequest(
        1,
        phoneNumber,
        shortcode,
        callbackUrl,
        'test account',
        'test description'
      );
    } catch (error) {
      expect(error).to.exist;
    }
    expect(spy.calledOnce).to.be.true;
  });
});
