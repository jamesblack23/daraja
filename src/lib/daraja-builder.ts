import { Daraja } from './daraja';
import { IDarajaConfig } from './daraja-config.interface';
import {
  DarajaConfigError,
  ERROR_CALLBACK_URL_OVERRIDE,
  ERROR_INVALID_ENVIRONMENT,
  ERROR_LNM_PASSKEY_OVERRIDE,
  ERROR_MISSING_CONSUMER_KEY,
  ERROR_MISSING_CONSUMER_SECRET,
  ERROR_MISSING_SHORTCODE,
  ERROR_NO_CALLBACK_URL,
  ERROR_NO_LNM_PASSKEY
} from './errors';

export class DarajaBuilder {
  private LNMPasskey: string | null;
  private LNMCallbackURL: string | null;

  /**
   * Creates an instance of DarajaBuilder.
   * @param {number} shortcode - This is the organization's shortcode
   * (Paybill or Buygoods - A 5 to 6 digit account number) used to identify an organization
   * @param {string} consumerKey - Your App's Consumer Key (obtain from Developer's portal)
   * @param {string} consumerSecret - Your App's Consumer Secret (obtain from Developer's portal)
   */
  constructor(
    private shortcode: number,
    private consumerKey: string,
    private consumerSecret: string,
    private environment: 'sandbox' | 'production' = 'sandbox'
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

    this.LNMPasskey = null;
    this.LNMCallbackURL = null;
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
   * Bundles all provided configuration options and creates a Daraja instance
   * @returns {Daraja}
   * @memberof DarajaBuilder
   */
  public build(): Daraja {
    const config: Partial<IDarajaConfig> = { environment: this.environment };
    if (this.LNMCallbackURL) {
      config.LNMCallbackURL = this.LNMCallbackURL;
    }
    if (this.LNMPasskey) {
      config.LNMPasskey = this.LNMPasskey;
    }

    return new Daraja(
      this.shortcode,
      this.consumerKey,
      this.consumerSecret,
      config
    );
  }
}
