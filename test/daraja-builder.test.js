const { assert } = require('chai');
const { DarajaBuilder, Daraja } = require('../dist');
const {
  DarajaConfigError,
  ERROR_MISSING_CONSUMER_KEY,
  ERROR_MISSING_SHORTCODE,
  ERROR_MISSING_CONSUMER_SECRET,
  ERROR_INVALID_ENVIRONMENT,
  ERROR_NO_LNM_PASSKEY,
  ERROR_LNM_PASSKEY_OVERRIDE,
  ERROR_CALLBACK_URL_OVERRIDE,
  ERROR_NO_CALLBACK_URL
} = require('../dist/lib/errors');

suite('DarajaBuilder', () => {
  suite('constructor', () => {
    test('should throw a DarajaConfigError when shortcode is missing', () => {
      assert.throws(
        () => new DarajaBuilder(),
        DarajaConfigError,
        ERROR_MISSING_SHORTCODE
      );
    });

    test('should throw a DarajaConfigError when Consumer Key is missing', () => {
      assert.throws(
        () => new DarajaBuilder(12345),
        DarajaConfigError,
        ERROR_MISSING_CONSUMER_KEY
      );
    });

    test('should throw a DarajaConfigError when Consumer Secret is missing', () => {
      assert.throws(
        () => new DarajaBuilder(12345, 'consumerKey'),
        DarajaConfigError,
        ERROR_MISSING_CONSUMER_SECRET
      );
    });

    test('should throw an error if invalid environment is passed', () => {
      assert.throws(
        () => new DarajaBuilder(12345, 'consumerKey', 'consumerSecret', 'prod'),
        DarajaConfigError,
        ERROR_INVALID_ENVIRONMENT
      );
    });

    test('should create a DarajaBuilder instance', () => {
      assert.exists(new DarajaBuilder(12345, 'consumerKey', 'consumerSecret'));
      assert.exists(
        new DarajaBuilder(12345, 'consumerKey', 'consumerSecret', 'production')
      );
    });
  });

  suite('methods', () => {
    let builder;

    suiteSetup(() => {
      builder = new DarajaBuilder(12345, 'consumerKey', 'consumerSecret');
    });

    suite('addLNMPasskey()', () => {
      test('should throw a DarajaConfigError when passkey is not passed', () => {
        assert.throws(
          () => builder.addLNMPasskey(),
          DarajaConfigError,
          ERROR_NO_LNM_PASSKEY
        );
      });

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
      test('should throw a DarajaConfigError when callback url is not passed', () => {
        assert.throws(
          () => builder.addLNMCallbackURL(),
          DarajaConfigError,
          ERROR_NO_CALLBACK_URL
        );
      });

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
});
