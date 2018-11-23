const chai = require('chai');
const sinon = require('sinon');
const {
  lipaNaMpesaShortcode,
  consumerKey,
  consumerSecret,
  passkey,
  stkPushPhone,
  stkCallbackUrl
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
  MISSING_PASSKEY_CONFIG
} = require('../dist/lib/errors/constants');

chai.use(require('chai-as-promised'));
const expect = chai.expect;

describe('lipaNaMpesaRequest()', function() {
  this.timeout(0);

  let mpesa;

  beforeEach(() => {
    mpesa = new DarajaBuilder(lipaNaMpesaShortcode, consumerKey, consumerSecret)
      .addLipaNaMpesaConfig(passkey)
      .build();
  });

  it('should throw MpesaError when credentials are invalid', () => {
    mpesa.consumerKey = 'key';
    return expect(
      mpesa.lipaNaMpesaRequest(
        1,
        stkPushPhone,
        lipaNaMpesaShortcode,
        stkCallbackUrl,
        'test account',
        'test description'
      )
    ).to.eventually.be.rejectedWith(MpesaError, INVALID_APP_CREDENTIALS);
  });

  it('should throw DarajaError when passkey is missing in the configuration', () => {
    mpesa.config.lipaNaMpesa.passkey = null;
    return expect(
      mpesa.lipaNaMpesaRequest(
        1,
        stkPushPhone,
        lipaNaMpesaShortcode,
        stkCallbackUrl,
        'test account',
        'test description'
      )
    ).to.eventually.be.rejectedWith(DarajaError, MISSING_PASSKEY_CONFIG);
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
      mpesa.lipaNaMpesaRequest(1, stkPushPhone)
    ).to.eventually.be.rejectedWith(DarajaError, MISSING_RECIPIENT_PARAMETER));
  it('should throw MpesaError when callbackUrl parameter is missing', () =>
    expect(
      mpesa.lipaNaMpesaRequest(1, stkPushPhone, lipaNaMpesaShortcode)
    ).to.eventually.be.rejectedWith(
      DarajaError,
      MISSING_CALLBACK_URL_PARAMETER
    ));
  it('should throw MpesaError when accountReference parameter is missing', () =>
    expect(
      mpesa.lipaNaMpesaRequest(
        1,
        stkPushPhone,
        lipaNaMpesaShortcode,
        stkCallbackUrl
      )
    ).to.eventually.be.rejectedWith(
      DarajaError,
      MISSING_ACCOUNT_REFERENCE_PARAMETER
    ));
  it('should throw MpesaError when transactionDescription parameter is missing', () =>
    expect(
      mpesa.lipaNaMpesaRequest(
        1,
        stkPushPhone,
        lipaNaMpesaShortcode,
        stkCallbackUrl,
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
      stkPushPhone,
      lipaNaMpesaShortcode,
      stkCallbackUrl,
      'test account',
      'test description'
    );
    expect(response).to.be.a('string');
    mpesa.config.environment = 'production';
    try {
      await mpesa.lipaNaMpesaRequest(
        1,
        stkPushPhone,
        lipaNaMpesaShortcode,
        stkCallbackUrl,
        'test account',
        'test description'
      );
    } catch (error) {
      expect(error).to.exist;
    }
    expect(spy.calledOnce).to.be.true;
  });
});
