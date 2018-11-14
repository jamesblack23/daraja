import { Daraja } from './daraja';
import { IDarajaConfig } from './daraja-config.interface';
import {
  DarajaConfigurationError,
  OVERRIDE_LNM_CALLBACKURL_ERROR_MESSAGE,
  OVERRIDE_LNM_PASSKEY_ERROR_MESSAGE
} from './errors';

/**
 *
 *
 * @export
 * @class DarajaBuilder
 */
export class DarajaBuilder {
  public LNMPasskey: string;
  public LNMCallbackURL: string;

  /**
   * Creates an instance of DarajaBuilder.
   * @param {number} shortcode - This is the organization's shortcode
   * (Paybill or Buygoods - A 5 to 6 digit account number) used to identify an organization
   * @param {string} consumerKey - Your App's Consumer Key (obtain from Developer's portal)
   * @param {string} consumerSecret - Your App's Consumer Secret (obtain from Developer's portal)
   */
  constructor(
    public shortcode: number,
    public consumerKey: string,
    public consumerSecret: string
  ) {
    this.LNMPasskey = '';
    this.LNMCallbackURL = '';
  }

  /**
   *
   *
   * @param {string} LNMPasskey - The Lipa na M-Pesa Online Passkey
   * @returns {DarajaBuilder}
   */
  public addLNMPasskey(LNMPasskey: string): DarajaBuilder {
    if (this.LNMPasskey.length > 0) {
      throw new DarajaConfigurationError(OVERRIDE_LNM_PASSKEY_ERROR_MESSAGE);
    }
    this.LNMPasskey = LNMPasskey;
    return this;
  }

  /**
   *
   *
   * @param {string} LNMCallbackURL - A valid secure URL that is used to receive notifications from M-Pesa API.
   * It is the endpoint to which the results will be sent by M-Pesa API.
   * @returns {DarajaBuilder}
   */
  public addLNMCallbackURL(LNMCallbackURL: string): DarajaBuilder {
    if (this.LNMCallbackURL.length > 0) {
      throw new DarajaConfigurationError(
        OVERRIDE_LNM_CALLBACKURL_ERROR_MESSAGE
      );
    }
    this.LNMCallbackURL = LNMCallbackURL;
    return this;
  }

  public build(): Daraja {
    const config: Partial<IDarajaConfig> = {};

    if (this.LNMCallbackURL) {
      config.LNMCallbackURL = this.LNMCallbackURL;
    }
    if (this.LNMPasskey) {
      config.LNMPasskey = this.LNMPasskey;
    }

    return Daraja.getInstance(
      this.shortcode,
      this.consumerKey,
      this.consumerSecret,
      config
    );
  }
}
