import * as constants from 'constants';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import { IDarajaConfig } from './config.interface';
import { DarajaError } from './errors';
import {
  MISSING_APP_CONSUMER_KEY,
  MISSING_APP_CONSUMER_SECRET,
  MISSING_APP_SHORTCODE,
  MISSING_INITIATOR_NAME_PARAMETER,
  MISSING_INITIATOR_PASSWORD_PARAMETER,
  MISSING_PASSKEY_PARAMETER
} from './errors/constants';
import { Mpesa } from './mpesa';

export class DarajaBuilder {
  private static generateSecurityCredential(
    password: string,
    environment: 'production' | 'sandbox' = 'sandbox'
  ): string {
    return crypto
      .publicEncrypt(
        {
          key: fs.readFileSync(
            path.join(
              __dirname,
              '../../certificates',
              environment === 'production' ? 'production.cer' : 'sandbox.cer'
            ),
            { encoding: 'utf8' }
          ),
          padding: constants.RSA_PKCS1_PADDING
        },
        Buffer.from(password)
      )
      .toString('base64');
  }
  private config: Partial<IDarajaConfig>;

  /**
   * Creates an instance of DarajaBuilder.
   * @param {number} shortcode - the business shortcode
   * @param {string} consumerKey - the application's Consumer Key
   * @param {string} consumerSecret - the appliaction's Consumer Secret
   * @param {('production' | 'sandbox')} [environment='sandbox'] - the
   * environment to run Daraja in
   */
  constructor(
    private shortcode: number,
    private consumerKey: string,
    private consumerSecret: string,
    environment: 'production' | 'sandbox' = 'sandbox'
  ) {
    if (!shortcode) {
      throw new DarajaError(MISSING_APP_SHORTCODE);
    }
    if (!consumerKey) {
      throw new DarajaError(MISSING_APP_CONSUMER_KEY);
    }
    if (!consumerSecret) {
      throw new DarajaError(MISSING_APP_CONSUMER_SECRET);
    }
    this.config = { environment };
  }

  /**
   *
   *
   * adds Lipa Na M-Pesa to the configuration
   * @param {string} passkey - the app's Lipa Na M-Pesa Online Passkey
   * @param {('CustomerPayBillOnline'| 'CustomerBuyGoodsOnline')}
   * [transactionType='CustomerPayBillOnline'] - the transaction type that is
   * used to identify the transaction when sending the request to M-Pesa
   */
  public addLipaNaMpesaConfig(
    passkey: string,
    transactionType:
      | 'CustomerPayBillOnline'
      | 'CustomerBuyGoodsOnline' = 'CustomerPayBillOnline'
  ): DarajaBuilder {
    if (!passkey) {
      throw new DarajaError(MISSING_PASSKEY_PARAMETER);
    }
    this.config = {
      ...this.config,
      lipaNaMpesa: { passkey, transactionType }
    };
    return this;
  }

  public addB2CConfig(initiatorName: string, initiatorPassword: string) {
    if (!initiatorName) {
      throw new DarajaError(MISSING_INITIATOR_NAME_PARAMETER);
    }
    if (!initiatorPassword) {
      throw new DarajaError(MISSING_INITIATOR_PASSWORD_PARAMETER);
    }
    this.config = {
      ...this.config,
      b2c: {
        initiatorName,
        securityCredential: DarajaBuilder.generateSecurityCredential(
          initiatorPassword,
          this.config.environment
        )
      }
    };
    return this;
  }

  /**
   *
   *
   * Creates a configured instance of Mpesa
   */
  public build(): Mpesa {
    return new Mpesa(
      this.shortcode,
      this.consumerKey,
      this.consumerSecret,
      this.config
    );
  }
}
