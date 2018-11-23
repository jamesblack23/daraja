import * as moment from 'moment';
import * as request from 'request-promise-native';
import { IDarajaConfig } from './config.interface';
import { DarajaError, MpesaError } from './errors';
import {
  MISSING_ACCOUNT_REFERENCE_PARAMETER,
  MISSING_AMOUNT_PARAMETER,
  MISSING_CALLBACK_URL_PARAMETER,
  MISSING_PASSKEY_CONFIG,
  MISSING_RECIPIENT_PARAMETER,
  MISSING_SENDER_PARAMETER,
  MISSING_TRANSACTION_DESCRIPTION_PARAMETER
} from './errors/constants';
import { urls } from './urls';

export class Mpesa {
  private accessToken: string | null;
  private accessTokenExpiry: moment.Moment;
  private config: IDarajaConfig = {
    environment: 'sandbox',
    lipaNaMpesa: { passkey: null, transactionType: 'CustomerPayBillOnline' }
  };

  constructor(
    private shortcode: number,
    private consumerKey: string,
    private consumerSecret: string,
    config: Partial<IDarajaConfig>
  ) {
    this.config = { ...this.config, ...config };
    this.accessToken = null;
    this.accessTokenExpiry = moment();
  }

  /**
   *
   *
   * initiate online payment on behalf of a customer
   * @param {number} amount - money that the customer pays to the Shorcode
   * @param {number} sender - phone number sending money
   * @param {number} recipient - the organization receiving the funds
   * @param {string} callbackUrl - endpoint to which the results will be sent by
   *  M-Pesa API
   * @param {string} accountReference - parameter that is defined by your
   * system as an Identifier of the transaction for CustomerPayBillOnline
   * transaction type
   * @param {string} transactionDescription - any additional information/comment
   *  that can be sent along with the request from your system
   * @returns
   * @memberof Mpesa
   */
  public async lipaNaMpesaRequest(
    amount: number,
    sender: number,
    recipient: number,
    callbackUrl: string,
    accountReference: string,
    transactionDescription: string
  ) {
    const url =
      this.config.environment === 'production'
        ? urls.production.mpesaExpress
        : urls.sandbox.mpesaExpress;

    if (!this.config.lipaNaMpesa.passkey) {
      throw new DarajaError(MISSING_PASSKEY_CONFIG);
    }

    if (!amount) {
      throw new DarajaError(MISSING_AMOUNT_PARAMETER);
    }
    if (!sender) {
      throw new DarajaError(MISSING_SENDER_PARAMETER);
    }
    if (!recipient) {
      throw new DarajaError(MISSING_RECIPIENT_PARAMETER);
    }
    if (!callbackUrl) {
      throw new DarajaError(MISSING_CALLBACK_URL_PARAMETER);
    }
    if (!accountReference) {
      throw new DarajaError(MISSING_ACCOUNT_REFERENCE_PARAMETER);
    }
    if (!transactionDescription) {
      throw new DarajaError(MISSING_TRANSACTION_DESCRIPTION_PARAMETER);
    }

    try {
      if (moment().isAfter(this.accessTokenExpiry.subtract(1, 'minute'))) {
        await this.setAccessToken();
      }
      const timestamp = moment().format('YYYYMMDDHHmmss');
      const response = await request.post(url, {
        body: {
          AccountReference: accountReference,
          Amount: amount,
          BusinessShortCode: this.shortcode,
          CallBackURL: callbackUrl,
          PartyA: sender,
          PartyB: recipient,
          Password: Buffer.from(
            `${this.shortcode}${this.config.lipaNaMpesa.passkey}${timestamp}`
          ).toString('base64'),
          PhoneNumber: sender,
          Timestamp: timestamp,
          TransactionDesc: transactionDescription,
          TransactionType: this.config.lipaNaMpesa.transactionType
        },
        headers: { Authorization: `Bearer ${this.accessToken}` },
        json: true
      });
      return response.CheckoutRequestID;
    } catch (error) {
      throw new MpesaError(error.message);
    }
  }

  private async setAccessToken() {
    const url =
      this.config.environment === 'production'
        ? urls.production.oAuth
        : urls.sandbox.oAuth;
    try {
      const response = await request.get(url, {
        auth: { user: this.consumerKey, pass: this.consumerSecret },
        json: true,
        qs: { grant_type: 'client_credentials' }
      });
      this.accessToken = response.access_token;
      this.accessTokenExpiry = moment().add(
        parseInt(response.expires_in, 10),
        'seconds'
      );
    } catch (error) {
      throw new MpesaError(error.response.statusMessage);
    }
  }
}
