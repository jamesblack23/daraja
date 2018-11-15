import { assert } from 'chai';
import * as utils from '../src/utils';

describe('utils', () => {
  describe('generateTimestamp()', () => {
    it('should generate correct timestamp', () => {
      const date = new Date(2018, 10, 15, 10, 12, 30);
      assert.equal(utils.generateTimestamp(date), '20181115101230');
    });
  });

  describe('generateLNMPassword()', () => {
    it('should generate a correct encoded password', () => {
      assert.equal(
        utils.generateLNMPassword(123456, 'passkey', '20181115113045'),
        'MTIzNDU2cGFzc2tleTIwMTgxMTE1MTEzMDQ1'
      );
    });
  });
});
