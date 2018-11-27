const chai = require('chai');
const { DarajaBuilder } = require('../dist');
const sinon = require('sinon');
const { DarajaError, MpesaError } = require('../dist/lib/errors');
const {
  MISSING_VALIDATION_URL_PARAMETER,
  MISSING_CONFIRMATION_URL_PARAMETER
} = require('../dist/lib/errors/constants');
const {
  businessShortcode,
  consumerKey,
  consumerSecret,
  C2B: { validationUrl, confirmationUrl }
} = require('./config');

chai.use(require('chai-as-promised'));
const expect = chai.expect;

describe('C2B', function() {
  this.timeout(0);

  let mpesa;

  beforeEach(() => {
    mpesa = new DarajaBuilder(
      businessShortcode,
      consumerKey,
      consumerSecret
    ).build();
  });

  describe('C2BRegisterUrls()', () => {
    it('should throw DarajaError if validationUrl is missing', () =>
      expect(mpesa.C2BRegisterUrls()).to.eventually.be.rejectedWith(
        DarajaError,
        MISSING_VALIDATION_URL_PARAMETER
      ));
    it('should throw DarajaError if confirmationUrl is missing', () =>
      expect(
        mpesa.C2BRegisterUrls(validationUrl)
      ).to.eventually.be.rejectedWith(
        DarajaError,
        MISSING_CONFIRMATION_URL_PARAMETER
      ));
    it('should throw MpesaError if the urls are invalid', () =>
      expect(
        mpesa.C2BRegisterUrls('invalidValidationUrl', 'invalidConfirmationUrl')
      ).to.eventually.be.rejectedWith(MpesaError));
    it('should return success when all parameters are passed', async () => {
      const spy = sinon.spy(mpesa, 'setAccessToken');
      await mpesa.C2BRegisterUrls(validationUrl, confirmationUrl);
      const response = await mpesa.C2BRegisterUrls(
        validationUrl,
        confirmationUrl
      );
      expect(response).to.equal('success');
      expect(spy.calledOnce).to.be.true;
    });
  });
});
