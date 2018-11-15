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

describe('Daraja', function() {
  this.timeout(0);
  let darajaLNM: Daraja;

  before(() => {
    darajaLNM = new DarajaBuilder(LNMShortcode, consumerKey, consumerSecret)
      .addLNMPasskey(LNMPasskey)
      .addLNMCallbackURL(LNMCallback)
      .build();
  });

  describe('lipaNaMpesa()', () => {
    it('should return successful response', () => {
      return assert.eventually.equal(
        darajaLNM.lipaNaMpesa(
          1,
          LNMMSISDN,
          LNMShortcode,
          'AccountRef',
          'TransDesc'
        ),
        'Success. Request accepted for processing'
      );
    });
  });
});
