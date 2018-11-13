import { assert } from 'chai';
import { DarajaBuilder } from '../src';
import {
  DarajaConfigurationError,
  OVERRIDE_PASSKEY_ERROR_MESSAGE
} from '../src/errors';

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

  describe('addLNMPasskey()', () => {
    let builderLNM: DarajaBuilder;

    beforeEach(() => {
      builderLNM = builder.addLNMPasskey('passkey');
    });

    it('should set the Passkey property', () => {
      assert.propertyVal(
        builderLNM,
        'LNMPasskey',
        'passkey',
        'passkey value not set'
      );
    });

    it('should throw a DarajaConfigurationError when attempting to override previously set passkey', () => {
      assert.throws(
        () => builderLNM.addLNMPasskey('other'),
        DarajaConfigurationError,
        OVERRIDE_PASSKEY_ERROR_MESSAGE
      );
    });
  });
});
