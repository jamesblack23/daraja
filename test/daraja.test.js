const chai = require('chai');
const { expect } = require('chai');
const { DarajaBuilder } = require('../dist');
const {
  LNMShortcode,
  consumerKey,
  consumerSecret,
  LNMPasskey,
  LNMCallbackURL,
  LNM_MSISDN,
  businessShortcode,
  C2BValidationURL,
  C2BConfirmationURL,
  testMSISDN
} = require('./config');
const {
  ERROR_NO_VALIDATION_URL,
  ERROR_NO_CONFIRMATION_URL,
  ERROR_INVALID_C2B_RESPONSE_TYPE,
  MPesaError,
  ERROR_SIMULATE_PRODUCTION
} = require('../dist/lib/errors');

chai.use(require('chai-as-promised'));

suite('Daraja', function() {
  this.timeout(0);

  suite('lipaNaMpesaRequest()', () => {
    let darajaLNM;

    suiteSetup(() => {
      darajaLNM = new DarajaBuilder(LNMShortcode, consumerKey, consumerSecret)
        .addLNMPasskey(LNMPasskey)
        .addLNMCallbackURL(LNMCallbackURL)
        .build();
    });

    test('should return a successful response', () => {
      return expect(
        darajaLNM.lipaNaMpesaRequest(
          1,
          LNM_MSISDN,
          LNMShortcode,
          'AccountRef',
          'TransactionDesc'
        )
      ).to.eventually.be.a('string');
    });
  });

  suite('C2B', () => {
    let darajaC2B;

    suiteSetup(() => {
      darajaC2B = new DarajaBuilder(
        businessShortcode,
        consumerKey,
        consumerSecret
      ).build();
    });

    suite('registerURLS', () => {
      test('should throw an MPesaError when no ValidationURL is passed', () => {
        return expect(
          darajaC2B.C2BRegisterURLs()
        ).to.eventually.be.rejectedWith(MPesaError, ERROR_NO_VALIDATION_URL);
      });

      test('should throw an MPesaError when no ConfirmationURL is passed', () => {
        return expect(
          darajaC2B.C2BRegisterURLs(C2BValidationURL)
        ).to.eventually.be.rejectedWith(MPesaError, ERROR_NO_CONFIRMATION_URL);
      });

      test('should throw an MPesaError when invalid ResponseType is passed', () => {
        return expect(
          darajaC2B.C2BRegisterURLs(
            C2BValidationURL,
            C2BConfirmationURL,
            'Invalid'
          )
        ).to.eventually.be.rejectedWith(
          MPesaError,
          ERROR_INVALID_C2B_RESPONSE_TYPE
        );
      });

      test('should return a successful response when valid parameters are passed', () => {
        return expect(
          darajaC2B.C2BRegisterURLs(C2BValidationURL, C2BConfirmationURL)
        ).to.eventually.equal('success');
      });
    });

    suite('simulate', () => {
      test('should throw a DarajaConfigError when the environment is production', () => {
        const darajaProd = new DarajaBuilder(
          businessShortcode,
          consumerKey,
          consumerSecret,
          'production'
        ).build();
        return expect(
          darajaProd.C2BSimulate(
            1,
            testMSISDN,
            'CustomerPayBillOnline',
            'TestRef'
          )
        ).to.eventually.be.rejectedWith(MPesaError, ERROR_SIMULATE_PRODUCTION);
      });
      test('should return a successful response', () => {
        return expect(
          darajaC2B.C2BSimulate(
            1,
            testMSISDN,
            'CustomerPayBillOnline',
            'TestRef'
          )
        ).to.eventually.equal('Accept the service request successfully.');
      });
    });
  });
});
