import { API_URLS } from './api-urls';
import { IDarajaConfig } from './config.interface';
import { DarajaConfigError } from './errors';
import { MPesa } from './mpesa';

/**
 * This class contains methods that set values that should persist across
 * multiple Daraja API calls.
 */
export class Daraja {
  private config: IDarajaConfig = { urls: API_URLS.sandbox };

  /**
   * Creates an instance of Daraja.
   * @param {number} shortcode - organization shortcode
   * @param {string} consumerKey - app's ConsumerKey
   * @param {string} consumerSecret - app's ConsumerSecret
   * @memberof Daraja
   */
  constructor(
    private shortcode: number,
    private consumerKey: string,
    private consumerSecret: string
  ) {}

  /**
   *
   * Adds Lipa Na MPesa Online Passkey and callback URL to the configuration.
   * @param {string} passkey - Lipa Na MPesa Online Passkey
   * @param {string} callbackUrl - valid secure URL that is used to receive
   * notifications from M-Pesa API
   * @returns {Daraja} The Daraja instance with the passkey and MPesa Express
   * callbackUrl added to the configuration
   * @throws {DarajaConfigError} If the passkey or callbackUrl arguments are
   * missing.
   * @memberof Daraja
   */
  public configureMPesaExpress(passkey: string, callbackUrl: string): Daraja {
    if (arguments.length !== this.configureMPesaExpress.length) {
      throw new DarajaConfigError(
        `Expected ${this.configureMPesaExpress.length} arguments but got ${
          arguments.length
        }`
      );
    }
    this.config = { ...this.config, mPesaExpress: { passkey, callbackUrl } };
    return this;
  }

  /**
   *
   * Creates an {@link MPesa} instance set up to perform API calls that have
   * been configured.
   * @param {('sandbox' | 'production')} [environment='sandbox'] - MPesa API
   * environment
   * @returns {MPesa}
   * @memberof Daraja
   */
  public build(environment: 'sandbox' | 'production' = 'sandbox'): MPesa {
    this.config = {
      ...this.config,
      urls:
        environment === 'production' ? API_URLS.production : API_URLS.sandbox
    };
    return new MPesa(
      this.shortcode,
      this.consumerKey,
      this.consumerSecret,
      this.config
    );
  }
}
