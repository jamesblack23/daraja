import { Daraja } from './daraja';
import { IDarajaConfig } from './daraja-config.interface';
import {
  DarajaConfigurationError,
  OVERRIDE_LNM_CALLBACKURL_ERROR_MESSAGE,
  OVERRIDE_LNM_PASSKEY_ERROR_MESSAGE
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
    this.LNMPasskey = null;
    this.LNMCallbackURL = null;
  }

  /**
   *
   * Adds the Lipa na M-Pesa Passkey to the configuration.
   * @param {string} LNMPasskey - The Lipa na M-Pesa Online Passkey
   */
  public addLNMPasskey(LNMPasskey: string): DarajaBuilder {
    if (this.LNMPasskey) {
      throw new DarajaConfigurationError(OVERRIDE_LNM_PASSKEY_ERROR_MESSAGE);
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
    if (this.LNMCallbackURL) {
      throw new DarajaConfigurationError(
        OVERRIDE_LNM_CALLBACKURL_ERROR_MESSAGE
      );
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
