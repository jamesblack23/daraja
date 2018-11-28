import { API_URLS } from './api-urls';
import { IDarajaConfig } from './config.interface';
import { DarajaConfigError } from './errors';
import { MPesa } from './mpesa';

export class Daraja {
  private config: IDarajaConfig = { urls: API_URLS.sandbox };
  constructor(private consumerKey: string, private consumerSecret: string) {}

  /**
   *
   * Add Lipa Na MPesa Online Passkey and callback URL to the configuration
   * @param {string} passkey - Lipa Na MPesa Online Passkey
   * @param {string} callbackUrl - valid secure URL that is used to receive
   * notifications from M-Pesa API
   * @returns {Daraja}
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
    this.config = { ...this.config, lipaNaMPesa: { passkey, callbackUrl } };
    return this;
  }

  /**
   *
   * Create a configured MPesa instance
   * @param {('sandbox' | 'production')} [environment='sandbox'] - the
   * environment to run MPesa on
   * @returns
   * @memberof Daraja
   */
  public build(environment: 'sandbox' | 'production' = 'sandbox') {
    this.config = {
      ...this.config,
      urls:
        environment === 'production' ? API_URLS.production : API_URLS.sandbox
    };
    return new MPesa(this.consumerKey, this.consumerSecret, this.config);
  }
}
