const chai = require('chai');
const { DarajaBuilder } = require('../dist');
const sinon = require('sinon');
const { DarajaError, MpesaError } = require('../dist/lib/errors');
const {
  MISSING_VALIDATION_URL_PARAMETER,
  MISSING_CONFIRMATION_URL_PARAMETER,
  INVALID_SIMULATION_ENVIRONMENT,
  MISSING_AMOUNT_PARAMETER,
  MISSING_SENDER_PARAMETER,
  MISSING_BILL_REFERENCE_NUMBER_PARAMETER
} = require('../dist/lib/errors/constants');
const {
  businessShortcode,
  consumerKey,
  consumerSecret,
  testPhoneNumber,
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

  describe('C2BSimulateTransaction()', () => {
    it('should throw DarajaError if environment is production', () =>
      expect(
        new DarajaBuilder(
          businessShortcode,
          consumerKey,
          consumerSecret,
          'production'
        )
          .build()
          .C2BSimulateTransaction(validationUrl, confirmationUrl)
      ).to.eventually.be.rejectedWith(
        DarajaError,
        INVALID_SIMULATION_ENVIRONMENT
      ));
    it('should throw DarajaError if missing amount parameter', () =>
      expect(mpesa.C2BSimulateTransaction()).to.eventually.be.rejectedWith(
        DarajaError,
        MISSING_AMOUNT_PARAMETER
      ));
    it('should throw DarajaError if missing sender parameter', () =>
      expect(mpesa.C2BSimulateTransaction(1)).to.eventually.be.rejectedWith(
        DarajaError,
        MISSING_SENDER_PARAMETER
      ));
    it('should throw MpesaError if sender parameter is invalid', () =>
      expect(
        mpesa.C2BSimulateTransaction(1, 712345678, 'BillRef')
      ).to.eventually.be.rejectedWith(MpesaError));
    it('should throw DarajaError if missing billReferenceNumber parameter', () =>
      expect(
        mpesa.C2BSimulateTransaction(1, testPhoneNumber)
      ).to.eventually.be.rejectedWith(
        DarajaError,
        MISSING_BILL_REFERENCE_NUMBER_PARAMETER
      ));
    it('should return a success result if all parameters are passed', async () => {
      const spy = sinon.spy(mpesa, 'setAccessToken');
      await mpesa.C2BSimulateTransaction(1, testPhoneNumber, 'Bill Ref');
      const response = await mpesa.C2BSimulateTransaction(
        1,
        testPhoneNumber,
        'Bill Ref'
      );
      expect(response).to.equal('Accept the service request successfully.');
      expect(spy.calledOnce).to.be.true;
    });
  });
});
