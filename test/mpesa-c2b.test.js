const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const { DarajaBuilder } = require('../dist');
const { DarajaError, MpesaError } = require('../dist/lib/errors');
const {
  MISSING_AMOUNT_PARAMETER,
  MISSING_BILL_REFERENCE_NUMBER_PARAMETER,
  MISSING_CONFIRMATION_URL_PARAMETER,
  MISSING_SENDER_PARAMETER,
  INVALID_SIMULATION_ENVIRONMENT,
  MISSING_VALIDATION_URL_PARAMETER
} = require('../dist/lib/errors/constants');
const {
  businessShortcode,
  c2b: { validationUrl, confirmationUrl },
  consumerKey,
  consumerSecret,
  testPhoneNumber
} = require('./config');

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('C2B', function() {
  this.timeout(0);

  let mpesa;

  before(() => {
    mpesa = new DarajaBuilder(
      businessShortcode,
      consumerKey,
      consumerSecret
    ).build();
  });

  describe('c2bRegisterUrls()', () => {
    it('should throw DarajaError if validationUrl is missing', () =>
      expect(mpesa.c2bRegisterUrls()).to.eventually.be.rejectedWith(
        DarajaError,
        MISSING_VALIDATION_URL_PARAMETER
      ));
    it('should throw DarajaError if confirmationUrl is missing', () =>
      expect(
        mpesa.c2bRegisterUrls(validationUrl)
      ).to.eventually.be.rejectedWith(
        DarajaError,
        MISSING_CONFIRMATION_URL_PARAMETER
      ));
    it('should throw MpesaError if the urls are invalid', () =>
      expect(
        mpesa.c2bRegisterUrls('invalidValidationUrl', 'invalidConfirmationUrl')
      ).to.eventually.be.rejectedWith(MpesaError));
    it('should return success when all parameters are passed', () =>
      expect(
        mpesa.c2bRegisterUrls(validationUrl, confirmationUrl)
      ).to.eventually.equal('success'));
  });

  describe('c2bSimulateTransaction()', () => {
    it('should throw DarajaError if environment is production', () =>
      expect(
        new DarajaBuilder(
          businessShortcode,
          consumerKey,
          consumerSecret,
          'production'
        )
          .build()
          .c2bSimulateTransaction(validationUrl, confirmationUrl)
      ).to.eventually.be.rejectedWith(
        DarajaError,
        INVALID_SIMULATION_ENVIRONMENT
      ));
    it('should throw DarajaError if missing amount parameter', () =>
      expect(mpesa.c2bSimulateTransaction()).to.eventually.be.rejectedWith(
        DarajaError,
        MISSING_AMOUNT_PARAMETER
      ));
    it('should throw DarajaError if missing sender parameter', () =>
      expect(mpesa.c2bSimulateTransaction(1)).to.eventually.be.rejectedWith(
        DarajaError,
        MISSING_SENDER_PARAMETER
      ));
    it('should throw MpesaError if sender parameter is invalid', () =>
      expect(
        mpesa.c2bSimulateTransaction(1, 712345678, 'BillRef')
      ).to.eventually.be.rejectedWith(MpesaError));
    it('should throw DarajaError if missing billReferenceNumber parameter', () =>
      expect(
        mpesa.c2bSimulateTransaction(1, testPhoneNumber)
      ).to.eventually.be.rejectedWith(
        DarajaError,
        MISSING_BILL_REFERENCE_NUMBER_PARAMETER
      ));
    it('should return a success result if all parameters are passed', () =>
      expect(
        mpesa.c2bSimulateTransaction(1, testPhoneNumber, 'Bill Reference')
      ).to.eventually.equal('Accept the service request successfully.'));
  });
});
