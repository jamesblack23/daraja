import { Daraja } from './daraja';
import { IDarajaConfig } from './daraja-config.interface';
import {
  DarajaConfigError,
  ERROR_B2C_QUEUE_TIMEOUT_URL_OVERRIDE,
  ERROR_B2C_RESULT_URL_OVERRIDE,
  ERROR_CALLBACK_URL_OVERRIDE,
  ERROR_INITIATOR_NAME_OVERRIDE,
  ERROR_INITIATOR_PASSWORD_OVERRIDE,
  ERROR_INVALID_ENVIRONMENT,
  ERROR_LNM_PASSKEY_OVERRIDE,
  ERROR_MISSING_CONSUMER_KEY,
  ERROR_MISSING_CONSUMER_SECRET,
  ERROR_MISSING_SHORTCODE,
  ERROR_NO_B2C_QUEUE_TIMEOUT_URL,
  ERROR_NO_B2C_RESULT_URL,
  ERROR_NO_CALLBACK_URL,
  ERROR_NO_INITIATOR_NAME,
  ERROR_NO_INITIATOR_PASSWORD,
  ERROR_NO_LNM_PASSKEY
} from './errors';

export class DarajaBuilder {
  private shortcode: number;
  private consumerKey: string;
  private consumerSecret: string;
  private environment: 'sandbox' | 'production';

  private LNMPasskey: string | null;
  private LNMCallbackURL: string | null;
  private initiatorName: string | null;
  private initiatorPassword: string | null;
  private B2CResultURL: string | null;
  private B2CQueueTimeoutURL: string | null;

  /**
   * Creates an instance of DarajaBuilder.
   * @param {number} shortcode - This is the organization's shortcode
   * (Paybill or Buygoods - A 5 to 6 digit account number) used to identify an organization
   * @param {string} consumerKey - Your App's Consumer Key (obtain from Developer's portal)
   * @param {string} consumerSecret - Your App's Consumer Secret (obtain from Developer's portal)
   * @param {string} environment - The environment to run Daraja. Can be either
   * 'sandbox' or 'production'. Defaults to 'sandbox'
   */
  constructor(
    shortcode: number,
    consumerKey: string,
    consumerSecret: string,
    environment: 'sandbox' | 'production' = 'sandbox'
  ) {
    if (!shortcode) {
      throw new DarajaConfigError(ERROR_MISSING_SHORTCODE);
    }
    if (!consumerKey) {
      throw new DarajaConfigError(ERROR_MISSING_CONSUMER_KEY);
    }
    if (!consumerSecret) {
      throw new DarajaConfigError(ERROR_MISSING_CONSUMER_SECRET);
    }
    if (environment !== 'sandbox' && environment !== 'production') {
      throw new DarajaConfigError(ERROR_INVALID_ENVIRONMENT);
    }

    this.shortcode = shortcode;
    this.consumerKey = consumerKey;
    this.consumerSecret = consumerSecret;
    this.environment = environment;

    this.LNMPasskey = null;
    this.LNMCallbackURL = null;
    this.initiatorName = null;
    this.initiatorPassword = null;
    this.B2CResultURL = null;
    this.B2CQueueTimeoutURL = null;
  }

  /**
   *
   * Adds the Lipa na M-Pesa Passkey to the configuration.
   * @param {string} LNMPasskey - The Lipa na M-Pesa Online Passkey
   */
  public addLNMPasskey(LNMPasskey: string): DarajaBuilder {
    if (!LNMPasskey) {
      throw new DarajaConfigError(ERROR_NO_LNM_PASSKEY);
    }
    if (this.LNMPasskey) {
      throw new DarajaConfigError(ERROR_LNM_PASSKEY_OVERRIDE);
    }
    this.LNMPasskey = LNMPasskey;
    return this;
  }

  /**
   *
   * Adds the Callback URL to receive Lipa na M-Pesa Online transaction
   * notifications
   * @param {string} LNMCallbackURL - A valid secure URL that is used to receive notifications from M-Pesa API.
   * It is the endpoint to which the results will be sent by M-Pesa API.
   * @returns {DarajaBuilder}
   */
  public addLNMCallbackURL(LNMCallbackURL: string): DarajaBuilder {
    if (!LNMCallbackURL) {
      throw new DarajaConfigError(ERROR_NO_CALLBACK_URL);
    }
    if (this.LNMCallbackURL) {
      throw new DarajaConfigError(ERROR_CALLBACK_URL_OVERRIDE);
    }
    this.LNMCallbackURL = LNMCallbackURL;
    return this;
  }

  /**
   *
   * Adds the initiator name
   * @param {string} initiatorName - The username of the M-Pesa API operator
   */
  public addInitiatorName(initiatorName: string): DarajaBuilder {
    if (!initiatorName) {
      throw new DarajaConfigError(ERROR_NO_INITIATOR_NAME);
    }
    if (this.initiatorName) {
      throw new DarajaConfigError(ERROR_INITIATOR_NAME_OVERRIDE);
    }
    this.initiatorName = initiatorName;
    return this;
  }

  /**
   *
   * Add the initiator password
   * @param {string} initiatorPassword - The password of the API initiator
   */
  public addInitiatorPassword(initiatorPassword: string): DarajaBuilder {
    if (!initiatorPassword) {
      throw new DarajaConfigError(ERROR_NO_INITIATOR_PASSWORD);
    }
    if (this.initiatorPassword) {
      throw new DarajaConfigError(ERROR_INITIATOR_PASSWORD_OVERRIDE);
    }
    this.initiatorPassword = initiatorPassword;
    return this;
  }

  /**
   *
   * Add the result url
   * @param {string} B2CResultURL - The URL that will be used by M-Pesa to send
   * a notification upon processing of the payment request
   */
  public addB2CResultURL(B2CResultURL: string): DarajaBuilder {
    if (!B2CResultURL) {
      throw new DarajaConfigError(ERROR_NO_B2C_RESULT_URL);
    }
    if (this.B2CResultURL) {
      throw new DarajaConfigError(ERROR_B2C_RESULT_URL_OVERRIDE);
    }
    this.B2CResultURL = B2CResultURL;
    return this;
  }

  /**
   *
   * Add the queue timeout url
   * @param {string} B2CQueueTimeoutURL - The URL that will be used by the API
   * Proxy to send a notification incase the payment request is timed out while
   * awaiting processing in the queue
   */
  public addB2CQueueTimeoutURL(B2CQueueTimeoutURL: string): DarajaBuilder {
    if (!B2CQueueTimeoutURL) {
      throw new DarajaConfigError(ERROR_NO_B2C_QUEUE_TIMEOUT_URL);
    }
    if (this.B2CQueueTimeoutURL) {
      throw new DarajaConfigError(ERROR_B2C_QUEUE_TIMEOUT_URL_OVERRIDE);
    }
    this.B2CQueueTimeoutURL = B2CQueueTimeoutURL;
    return this;
  }

  /**
   *
   * Bundles all provided configuration options and creates a Daraja instance
   */
  public build(): Daraja {
    const config: Partial<IDarajaConfig> = { environment: this.environment };
    if (this.LNMCallbackURL) {
      config.LNMCallbackURL = this.LNMCallbackURL;
    }
    if (this.LNMPasskey) {
      config.LNMPasskey = this.LNMPasskey;
    }
    if (this.initiatorName) {
      config.initiatorName = this.initiatorName;
    }
    if (this.initiatorPassword) {
      config.initiatorPassword = this.initiatorPassword;
    }
    if (this.B2CResultURL) {
      config.B2CResultURL = this.B2CResultURL;
    }
    if (this.B2CQueueTimeoutURL) {
      config.B2CQueueTimeoutURL = this.B2CQueueTimeoutURL;
    }

    return new Daraja(
      this.shortcode,
      this.consumerKey,
      this.consumerSecret,
      config
    );
  }
}
