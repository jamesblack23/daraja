import * as dotenv from 'dotenv';
dotenv.config();

import { assert } from 'chai';
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { Daraja } from '../src/daraja';
import { DarajaBuilder } from '../src/index';

chai.use(chaiAsPromised);

const LNMShortcode = parseInt(process.env.LNM_SHORTCODE || '123', 10);
const consumerKey = process.env.CONSUMER_KEY || 'key';
const consumerSecret = process.env.CONSUMER_SECRET || 'secret';
const LNMPasskey = process.env.LNM_PASSKEY || 'passkey';
const LNMCallback = process.env.LNM_CALLBACK || 'lnmcallback';
const LNMMSISDN = parseInt(process.env.LNM_MSISDN || '123', 10);
const shortcode = parseInt(process.env.BUSINESS_SHORTCODE || '123', 10);
const C2BValidationURL = process.env.C2B_VALIDATION_URL || 'c2bValidationURL';
const C2BConfirmationURL =
  process.env.C2B_CONFIRMATION_URL || 'c2bConfirmationURL';
const MSISDN = parseInt(process.env.MSISDN || '123', 10);

suite('Daraja', function() {
  this.timeout(0);

  suite('lipaNaMpesa()', () => {
    let darajaLNM: Daraja;

    before(() => {
      darajaLNM = new DarajaBuilder(LNMShortcode, consumerKey, consumerSecret)
        .addLNMPasskey(LNMPasskey)
        .addLNMCallbackURL(LNMCallback)
        .build();
    });

    test('should return successful response', async () => {
      return assert.eventually.exists(
        darajaLNM.lipaNaMpesa(
          1,
          LNMMSISDN,
          LNMShortcode,
          'AccountRef',
          'TransactionDesc'
        )
      );
    });
  });

  suite('C2B', () => {
    let darajaC2B: Daraja;

    beforeEach(() => {
      darajaC2B = new DarajaBuilder(
        shortcode,
        consumerKey,
        consumerSecret
      ).build();
    });

    suite('registerURLs', () => {
      test('should return a successful response', () => {
        return assert.eventually.equal(
          darajaC2B.C2BRegisterURLs(
            C2BValidationURL,
            C2BConfirmationURL,
            'Completed'
          ),
          'success'
        );
      });
    });

    suite('simulate', () => {
      test('should return a successful response', () => {
        return assert.eventually.equal(
          darajaC2B.C2BSimulate(1, MSISDN, 'CustomerPayBillOnline', 'BillRef'),
          'Accept the service request successfully.'
        );
      });
    });
  });
});
