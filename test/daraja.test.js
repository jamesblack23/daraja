const { assert } = require('chai');
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

    test('should return a successful response', async () => {
      const response = await darajaLNM.lipaNaMpesaRequest(
        1,
        LNM_MSISDN,
        LNMShortcode,
        'Accountref',
        'TransactionDesc'
      );
      assert.strictEqual(response.ResponseCode, '0');
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
      test('should return a successful response', async () => {
        const response = await darajaC2B.C2BRegisterURLs(
          C2BValidationURL,
          C2BConfirmationURL,
          'Completed'
        );
        assert.strictEqual(response, 'success');
      });
    });

    suite('simulate', () => {
      test('should return a successful response', async () => {
        const response = await darajaC2B.C2BSimulate(
          1,
          testMSISDN,
          'CustomerPayBillOnline',
          'TestRef'
        );
        assert.strictEqual(response, 'Accept the service request successfully.');
      });
    });
  });
});
