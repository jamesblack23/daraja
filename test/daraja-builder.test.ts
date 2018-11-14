import { assert } from 'chai';
import { DarajaBuilder } from '../src';
import { Daraja } from '../src/daraja';
import {
  DarajaConfigurationError,
  OVERRIDE_LNM_CALLBACKURL_ERROR_MESSAGE,
  OVERRIDE_LNM_PASSKEY_ERROR_MESSAGE
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
    let builderLNMPasskey: DarajaBuilder;

    beforeEach(() => {
      builderLNMPasskey = builder.addLNMPasskey('passkey');
    });

    it('should set the LNMPasskey property', () => {
      assert.propertyVal(
        builderLNMPasskey,
        'LNMPasskey',
        'passkey',
        'LNMPasskey value not set'
      );
    });

    it('should throw a DarajaConfigurationError when attempting to override previously set LNMPasskey', () => {
      assert.throws(
        () => builderLNMPasskey.addLNMPasskey('other'),
        DarajaConfigurationError,
        OVERRIDE_LNM_PASSKEY_ERROR_MESSAGE
      );
    });
  });

  describe('addLNMCallbackURL()', () => {
    let builderLNMCallbackURL: DarajaBuilder;

    beforeEach(() => {
      builderLNMCallbackURL = builder.addLNMCallbackURL('myurl');
    });

    it('should set the LNMCallbackURL property', () => {
      assert.propertyVal(
        builderLNMCallbackURL,
        'LNMCallbackURL',
        'myurl',
        'LNMCallbackURL value not set'
      );
    });

    it('should throw a DarajaConfigurationError when attempting to override previously set LNMCallbackURL', () => {
      assert.throws(
        () => builderLNMCallbackURL.addLNMCallbackURL('otherurl'),
        DarajaConfigurationError,
        OVERRIDE_LNM_CALLBACKURL_ERROR_MESSAGE
      );
    });
  });

  describe('build()', () => {
    let daraja: Daraja;

    beforeEach(() => {
      daraja = builder.build();
    });

    it('should create an instance of Daraja', () => {
      assert.instanceOf(daraja, Daraja, 'does not create a Daraja instance');
    });
  });
});
