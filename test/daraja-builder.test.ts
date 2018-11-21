import { assert } from 'chai';
import { DarajaBuilder } from '../src';
import { Daraja } from '../src/lib/daraja';
import {
  DarajaConfigError,
  ERROR_CALLBACK_URL_OVERRIDE,
  ERROR_LNM_PASSKEY_OVERRIDE
} from '../src/lib/errors';

suite('DarajaBuilder', () => {
  let builder: DarajaBuilder;

  suiteSetup(() => {
    builder = new DarajaBuilder(12345, 'consumerKey', 'consumerSecret');
  });

  suite('addLNMPasskey()', () => {
    test('should throw a DarajaConfigError if LNMPasskey was already defined', () => {
      const builderLNMPasskey = builder.addLNMPasskey('passkey');
      assert.throws(
        () => builderLNMPasskey.addLNMPasskey('otherPasskey'),
        DarajaConfigError,
        ERROR_LNM_PASSKEY_OVERRIDE
      );
    });
  });

  suite('addLNMCallbackURL()', () => {
    test('should throw a DarajaConfigError if LNMCallbackURL was already defined', () => {
      const builderLNMCallbackURL = builder.addLNMCallbackURL('callbackURL');
      assert.throws(
        () => builderLNMCallbackURL.addLNMCallbackURL('otherCallbackURL'),
        DarajaConfigError,
        ERROR_CALLBACK_URL_OVERRIDE
      );
    });
  });

  suite('build()', () => {
    test('should create a Daraja instance', () => {
      assert.instanceOf(builder.build(), Daraja);
    });
  });
});
