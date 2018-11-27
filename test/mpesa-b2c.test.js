const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const {
  b2c: { resultUrl, timeoutUrl },
  businessShortcode,
  consumerKey,
  consumerSecret,
  initiatorName,
  initiatorPassword,
  testPhoneNumber
} = require('./config');
const { DarajaBuilder } = require('../dist');
const { DarajaError, MpesaError } = require('../dist/lib/errors');
const {
  MISSING_AMOUNT_PARAMETER,
  MISSING_B2C_CONFIG,
  MISSING_COMMAND_ID_PARAMETER,
  MISSING_OCCASSION_PARAMETER,
  MISSING_RECIPIENT_PARAMETER,
  MISSING_REMARKS_PARAMETER,
  MISSING_RESULT_URL_PARAMETER,
  MISSING_TIMEOUT_URL_PARAMETER
} = require('../dist/lib/errors/constants');

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('B2C', function() {
  this.timeout(0);

  let mpesa;

  before(() => {
    mpesa = new DarajaBuilder(businessShortcode, consumerKey, consumerSecret)
      .addB2CConfig(initiatorName, initiatorPassword)
      .build();
  });

  describe('b2cPaymentRequest()', () => {
    it('should throw DarajaError if B2C config is missing', () =>
      expect(
        new DarajaBuilder(businessShortcode, consumerKey, consumerSecret)
          .build()
          .b2cPaymentRequest()
      ).to.eventually.be.rejectedWith(DarajaError, MISSING_B2C_CONFIG));
    it('should throw DarajaError if amount is missing', () =>
      expect(mpesa.b2cPaymentRequest()).to.eventually.be.rejectedWith(
        DarajaError,
        MISSING_AMOUNT_PARAMETER
      ));
    it('should throw DarajaError if recipient is missing', () =>
      expect(mpesa.b2cPaymentRequest(1)).to.eventually.be.rejectedWith(
        DarajaError,
        MISSING_RECIPIENT_PARAMETER
      ));
    it('should throw DarajaError if commandID is missing', () =>
      expect(
        mpesa.b2cPaymentRequest(1, testPhoneNumber)
      ).to.eventually.be.rejectedWith(
        DarajaError,
        MISSING_COMMAND_ID_PARAMETER
      ));
    it('should throw DarajaError if resultUrl is missing', () =>
      expect(
        mpesa.b2cPaymentRequest(1, testPhoneNumber, 'SalaryPayment')
      ).to.eventually.be.rejectedWith(
        DarajaError,
        MISSING_RESULT_URL_PARAMETER
      ));
    it('should throw DarajaError if timeoutUrl is missing', () =>
      expect(
        mpesa.b2cPaymentRequest(1, testPhoneNumber, 'SalaryPayment', resultUrl)
      ).to.eventually.be.rejectedWith(
        DarajaError,
        MISSING_TIMEOUT_URL_PARAMETER
      ));
    it('should throw DarajaError if remarks is missing', () =>
      expect(
        mpesa.b2cPaymentRequest(
          1,
          testPhoneNumber,
          'SalaryPayment',
          resultUrl,
          timeoutUrl
        )
      ).to.eventually.be.rejectedWith(DarajaError, MISSING_REMARKS_PARAMETER));
    it('should throw DarajaError if occassion is missing', () =>
      expect(
        mpesa.b2cPaymentRequest(
          1,
          testPhoneNumber,
          'SalaryPayment',
          resultUrl,
          timeoutUrl,
          'remarks'
        )
      ).to.eventually.be.rejectedWith(
        DarajaError,
        MISSING_OCCASSION_PARAMETER
      ));
    it('should throw MpesaError when the commandID is invalid', () =>
      expect(
        mpesa.b2cPaymentRequest(
          1,
          testPhoneNumber,
          'invalidCommandID',
          resultUrl,
          timeoutUrl,
          'remarks',
          'occassion'
        )
      ).to.eventually.be.rejectedWith(MpesaError));
    it('should return success when all parameters are present', async () =>
      expect(
        mpesa.b2cPaymentRequest(
          1,
          testPhoneNumber,
          'SalaryPayment',
          resultUrl,
          timeoutUrl,
          'remarks',
          'occassion'
        )
      ).to.eventually.equal('Accept the service request successfully.'));
  });
});
