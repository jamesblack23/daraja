import { IDarajaConfig } from './config.interface';
import { DarajaConfigError } from './errors';

export class Daraja {
  private config: IDarajaConfig = {};
  constructor() {}

  /**
   *
   * Add Lipa Na MPesa Online Passkey and callback URL to the configuration
   * @param {string} passkey - Lipa Na MPesa Online Passkey
   * @param {string} callbackUrl - valid secure URL that is used to receive
   * notifications from M-Pesa API
   * @returns {Daraja}
   * @memberof Daraja
   */
  public configureLipaNaMPesa(passkey: string, callbackUrl: string): Daraja {
    if (arguments.length !== this.configureLipaNaMPesa.length) {
      throw new DarajaConfigError(
        `Expected ${this.configureLipaNaMPesa.length} arguments but got ${
          arguments.length
        }`
      );
    }
    this.config = { ...this.config, lipaNaMPesa: { passkey, callbackUrl } };
    return this;
  }
}
