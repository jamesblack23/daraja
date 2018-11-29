import { IDarajaConfig } from './config.interface';

import * as moment from 'moment';
import * as request from 'request-promise-native';
import { DarajaAPIError, DarajaConfigError, MPesaExpressError } from './errors';

/**
 * This class implements the MPesa API methods. Should only be instantiated
 * using a {@link Daraja} instance.
 * @see [Daraja.build()]{@link Daraja#build}
 */
export class MPesa {
  private tokenExpiry = moment();
  private accessToken = '';
  private request = request.defaults({ json: true });

  /**
   * Creates an instance of MPesa.
   * @param {number} shortcode - organization shortcode
   * @param {string} consumerKey - app's ConsumerKey
   * @param {string} consumerSecret - app's ConsumerSecret
   * @param {IDarajaConfig} config - a configuration object with persistent
   * values to be used in Daraja API calls
   * @memberof MPesa
   * @hideconstructor
   */
  constructor(
    private shortcode: number,
    private consumerKey: string,
    private consumerSecret: string,
    private config: IDarajaConfig
  ) {}

  /**
   *
   * This method invokes the Lipa Na M-Pesa Online Payment API. Use this method
   * to initiate an online payment on behalf of a customer.
   * @param {number} amount - money that the customer pays to the Shorcode
   * @param {number} sender - phone number sending money
   * @param {number} recipient - organization receiving the funds
   * @param {('CustomerPayBillOnline' | 'CustomerBuyGoodsOnline')} transactionType -
   * transaction type that is used to identify the transaction when sending the
   * request to M-Pesa
   * @param {string} accountReference - alpha-Numeric parameter that is defined
   * by your system as an Identifier of the transaction for
   * CustomerPayBillOnline transaction type
   * @param {string} transactionDescription - any additional
   * information/comment that can be sent along with the request from your
   * system
   * @returns {Promise<string>} CheckoutRequestID -
   * This is a global unique identifier of the processed checkout transaction
   * request.
   * @throws {DarajaConfigError} When mPesaExpress has not been configured.
   * @see [Daraja.configureMPesaExpress()]{@link Daraja#configureMPesaExpress}
   * @throws {MPesaExpressError} When an invalid arguments have been passed.
   * @throws {DarajaAPIError} When the Daraja API cannot process the request.
   * @memberof MPesa
   * @async
   */
  public async mPesaExpressRequest(
    amount: number,
    sender: number,
    recipient: number,
    transactionType: 'CustomerPayBillOnline' | 'CustomerBuyGoodsOnline',
    accountReference: string,
    transactionDescription: string
  ): Promise<string> {
    if (!this.config.mPesaExpress) {
      throw new DarajaConfigError('Missing mPesaExpress configuration');
    }
    if (arguments.length !== this.mPesaExpressRequest.length) {
      throw new MPesaExpressError(
        `Expected ${this.mPesaExpressRequest.length} arguments but got ${
          arguments.length
        }`
      );
    }
    try {
      const timestamp = moment().format('YYYYMMDDHHmmss');
      const { CheckoutRequestID } = await this.request.post(
        this.config.urls.mPesaExpress.request,
        {
          body: {
            AccountReference: accountReference,
            Amount: amount,
            BusinessShortCode: this.shortcode,
            CallBackURL: this.config.mPesaExpress.callbackUrl,
            PartyA: sender,
            PartyB: recipient,
            Password: Buffer.from(
              `${this.shortcode}${this.config.mPesaExpress.passkey}${timestamp}`
            ).toString('base64'),
            PhoneNumber: sender,
            Timestamp: timestamp,
            TransactionDesc: transactionDescription,
            TransactionType: transactionType
          },
          headers: { Authorization: `Bearer ${await this.generateToken()}` }
        }
      );
      return CheckoutRequestID;
    } catch (error) {
      const {
        response: {
          body: { errorMessage: message }
        }
      } = error;
      throw new DarajaAPIError(message);
    }
  }

  /**
   *
   *
   * @private
   * @returns {Promise<string>}
   * @memberof MPesa
   */
  private async generateToken(): Promise<string> {
    try {
      if (moment().isBefore(this.tokenExpiry.subtract(1, 'minute'))) {
        return this.accessToken;
      }
      const { access_token, expires_in } = await request.get(
        this.config.urls.generateToken,
        {
          auth: { user: this.consumerKey, pass: this.consumerSecret },
          json: true,
          qs: { grant_type: 'client_credentials' }
        }
      );
      this.accessToken = access_token;
      this.tokenExpiry = moment().add(parseInt(expires_in, 10), 'seconds');
      return access_token;
    } catch (error) {
      const {
        response: { statusMessage: message }
      } = error;
      throw new DarajaAPIError(message);
    }
  }
}
