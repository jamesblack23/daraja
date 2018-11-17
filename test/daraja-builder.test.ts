import { assert } from 'chai';
import { DarajaBuilder } from '../src';
import {
  DarajaConfigurationError,
  OVERRIDE_LNM_CALLBACKURL_ERROR_MESSAGE,
  OVERRIDE_LNM_PASSKEY_ERROR_MESSAGE
} from '../src/errors';

suite('DarajaBuilder', () => {
  let builder: DarajaBuilder;

  beforeEach(() => {
    builder = new DarajaBuilder(12345, 'key', 'secret');
  });

  suite('addLNMPasskey()', () => {
    let builderLNMPasskey: DarajaBuilder;

    beforeEach(() => {
      builderLNMPasskey = builder.addLNMPasskey('passkey');
    });

    test('should set the LNMPasskey property', () => {
      assert.propertyVal(
        builderLNMPasskey,
        'LNMPasskey',
        'passkey',
        'LNMPasskey value not set'
      );
    });

    test('should throw a DarajaConfigurationError when attempting to override previously set LNMPasskey', () => {
      assert.throws(
        () => builderLNMPasskey.addLNMPasskey('other'),
        OVERRIDE_LNM_PASSKEY_ERROR_MESSAGE
      );
    });
  });

  suite('addLNMCallbackURL()', () => {
    let builderLNMCallbackURL: DarajaBuilder;

    beforeEach(() => {
      builderLNMCallbackURL = builder.addLNMCallbackURL('myurl');
    });

    test('should set the LNMCallbackURL property', () => {
      assert.propertyVal(
        builderLNMCallbackURL,
        'LNMCallbackURL',
        'myurl',
        'LNMCallbackURL value not set'
      );
    });

    test('should throw a DarajaConfigurationError when attempting to override previously set LNMCallbackURL', () => {
      assert.throws(
        () => builderLNMCallbackURL.addLNMCallbackURL('otherurl'),
        OVERRIDE_LNM_CALLBACKURL_ERROR_MESSAGE
      );
    });
  });
});
