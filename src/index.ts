import {
  DarajaConfigurationError,
  OVERRIDE_PASSKEY_ERROR_MESSAGE
} from './errors';

/**
 *
 *
 * @export
 * @class DarajaBuilder
 */
export class DarajaBuilder {
  public LNMPasskey: string = '';
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
  ) {}

  /**
   *
   *
   * @param {string} LNMPasskey - The Lipa na M-Pesa Online Passkey
   * @returns {DarajaBuilder}
   */
  public addLNMPasskey(LNMPasskey: string): DarajaBuilder {
    if (this.LNMPasskey.length > 0) {
      throw new DarajaConfigurationError(OVERRIDE_PASSKEY_ERROR_MESSAGE);
    }
    this.LNMPasskey = LNMPasskey;
    return this;
  }
}
