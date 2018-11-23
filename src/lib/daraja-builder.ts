import { IDarajaConfig } from './config.interface';
import { Daraja } from './daraja';
import { DarajaConfigError } from './errors';
import {
  MISSING_APP_CONSUMER_KEY,
  MISSING_APP_CONSUMER_SECRET,
  MISSING_APP_SHORTCODE,
  MISSING_PASSKEY_PARAMETER
} from './errors/constants';

export class DarajaBuilder {
  private lipaNaMpesaPasskey: string | null = null;
  /**
   * Creates an instance of DarajaBuilder.
   * @param {number} shortcode - the business shortcode
   * @param {string} consumerKey - the application's Consumer Key
   * @param {string} consumerSecret - the appliaction's Consumer Secret
   * @param {('production' | 'sandbox')} [environment='sandbox'] - the
   * environment to run Daraja in
   * @memberof DarajaBuilder
   */
  constructor(
    private shortcode: number,
    private consumerKey: string,
    private consumerSecret: string,
    private environment: 'production' | 'sandbox' = 'sandbox'
  ) {
    if (!shortcode) {
      throw new DarajaConfigError(MISSING_APP_SHORTCODE);
    }
    if (!consumerKey) {
      throw new DarajaConfigError(MISSING_APP_CONSUMER_KEY);
    }
    if (!consumerSecret) {
      throw new DarajaConfigError(MISSING_APP_CONSUMER_SECRET);
    }
  }

  /**
   *
   *
   * Adds the Lipa Na M-Pesa Online Passkey to the configuration
   * @param {string} lipaNaMpesaPasskey - the app's Lipa Na M-Pesa Online
   * Passkey
   * @returns {DarajaBuilder}
   * @memberof DarajaBuilder
   */
  public addLipaNaMpesaPasskey(lipaNaMpesaPasskey: string): DarajaBuilder {
    if (!lipaNaMpesaPasskey) {
      throw new DarajaConfigError(MISSING_PASSKEY_PARAMETER);
    }
    this.lipaNaMpesaPasskey = lipaNaMpesaPasskey;
    return this;
  }

  public build() {
    let config: Partial<IDarajaConfig> = { environment: this.environment };
    if (this.lipaNaMpesaPasskey) {
      config = { ...config, lipaNaMpesaPasskey: this.lipaNaMpesaPasskey };
    }
    return new Daraja(
      this.shortcode,
      this.consumerKey,
      this.consumerSecret,
      config
    );
  }
}
