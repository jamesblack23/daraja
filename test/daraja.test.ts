import { assert } from 'chai';
import { DarajaBuilder } from '../src';

describe('DarajaBuilder', () => {
  let builder: DarajaBuilder;

  beforeEach(() => {
    builder = new DarajaBuilder(12345, 'key', 'secret');
  });

  describe('constructor', () => {
    it('should set the respective properties', () => {
      assert.propertyVal(
        builder,
        'shortcode',
        12345,
        'shortcode value not set'
      );
      assert.propertyVal(
        builder,
        'consumerKey',
        'key',
        'consumerKey value not set'
      );
      assert.propertyVal(
        builder,
        'consumerSecret',
        'secret',
        'consumerSecret value not set'
      );
    });
  });
});
