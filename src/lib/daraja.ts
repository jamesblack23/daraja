import * as moment from 'moment';
import * as request from 'request-promise-native';
import { IDarajaConfig } from './daraja-config.interface';

import {
  DarajaConfigError,
  ERROR_INVALID_C2B_RESPONSE_TYPE,
  ERROR_INVALID_CREDENTIALS,
  ERROR_NO_CALLBACK_URL,
  ERROR_NO_CONFIRMATION_URL,
  ERROR_NO_LNM_PASSKEY,
  ERROR_NO_VALIDATION_URL,
  ERROR_SIMULATE_PRODUCTION,
  MPesaError
} from './errors';
import { urls } from './urls';

export class Daraja {
  private shortcode: number;
  private consumerKey: string;
  private consumerSecret: string;
  private config: Partial<IDarajaConfig>;
  private accessToken: string;
  private accessTokenExpiry: moment.Moment;

  constructor(
    shortcode: number,
    consumerKey: string,
    consumerSecret: string,
    config: Partial<IDarajaConfig>
  ) {
    this.shortcode = shortcode;
    this.consumerKey = consumerKey;
    this.consumerSecret = consumerSecret;
    this.config = config;
    this.accessToken = '';
    this.accessTokenExpiry = moment();
  }

  /**
   *
   * Initiates online payment on behalf of a customer
   * @param {number} amount - This is the Amount transacted normally a numeric
   * value.
   * Money that customer pays to the Shorcode.
   * Only whole numbers are supported.
   * @param {number} sender - The phone number sending money.
   * The parameter expected is a Valid Safaricom Mobile Number that is M-Pesa
   * registered in the format 2547XXXXXXXX
   * @param {number} recipient - The organization receiving the funds.
   * The parameter expected is a 5 to 6 digit
   * @param {string} accountReference - An Alpha-Numeric parameter that is
   * defined by your system as an Identifier
   * of the transaction for CustomerPayBillOnline transaction type.
   * @param {string} transactionDescription - This is any additional
   * information/comment that can be sent along with the
   * request from your system. Maximum of 13 Characters.
   */
  public async lipaNaMpesaRequest(
    amount: number,
    sender: number,
    recipient: number,
    accountReference: string,
    transactionDescription: string
  ) {
    if (!this.config.LNMCallbackURL) {
      throw new DarajaConfigError(ERROR_NO_CALLBACK_URL);
    }
    if (!this.config.LNMPasskey) {
      throw new DarajaConfigError(ERROR_NO_LNM_PASSKEY);
    }

    const url =
      this.config.environment === 'production'
        ? urls.production.LNMRequest
        : urls.sandbox.LNMRequest;

    try {
      if (moment().isAfter(this.accessTokenExpiry)) {
        await this.setAccessToken();
      }
      const timestamp = moment().format('YYYYMMDDHHmmss');
      const response = await request.post(url, {
        body: {
          AccountReference: accountReference,
          Amount: amount,
          BusinessShortCode: this.shortcode,
          CallBackURL: this.config.LNMCallbackURL,
          PartyA: sender,
          PartyB: recipient,
          Password: Buffer.from(
            `${this.shortcode}${this.config.LNMPasskey}${timestamp}`
          ).toString('base64'),
          PhoneNumber: sender,
          Timestamp: timestamp,
          TransactionDesc: transactionDescription,
          TransactionType: 'CustomerPayBillOnline'
        },
        headers: { Authorization: `Bearer ${this.accessToken}` },
        json: true
      });
      return response.CheckoutRequestID;
    } catch (error) {
      throw new MPesaError(error.message);
    }
  }

  /**
   *
   * Checks the status of a Lipa Na M-Pesa Online Payment.
   * @param {string} CheckoutRequestID - This is a global unique identifier of
   * the processed checkout transaction request.
   */
  public async lipaNaMPesaQuery(checkoutRequestID: string) {
    if (!this.config.LNMPasskey) {
      throw new DarajaConfigError(ERROR_NO_LNM_PASSKEY);
    }

    const url =
      this.config.environment === 'production'
        ? urls.production.LNMQuery
        : urls.sandbox.LNMQuery;

    try {
      if (moment().isAfter(this.accessTokenExpiry)) {
        await this.setAccessToken();
      }
      const timestamp = moment().format('YYYYMMDDHHmmss');
      const response = await request.post(url, {
        body: {
          BusinessShortCode: this.shortcode,
          CheckoutRequestID: checkoutRequestID,
          Password: Buffer.from(
            `${this.shortcode}${this.config.LNMPasskey}${timestamp}`
          ).toString('base64'),
          Timestamp: timestamp
        },
        headers: { Authorization: `Bearer ${this.accessToken}` },
        json: true
      });
      return response.ResultCode;
    } catch (error) {
      throw new MPesaError(error.message);
    }
  }

  /**
   *
   * Register validation and confirmation URLs on M-Pesa
   * @param {string} validationURL - This is the URL that receives the
   * validation request from API upon payment submission
   * @param {string} confirmationURL - This is the URL that receives the
   * confirmation request from API upon payment completion
   * @param {('Canceled' | 'Completed')} defaultResponseType - This parameter
   * specifies what is to happen if for any reason the validation URL is not
   * reachable
   */
  public async C2BRegisterURLs(
    validationURL: string,
    confirmationURL: string,
    defaultResponseType: 'Canceled' | 'Completed' = 'Completed'
  ): Promise<string> {
    const url =
      this.config.environment === 'production'
        ? urls.production.C2BRegisterURLs
        : urls.sandbox.C2BRegisterURLs;

    if (!validationURL) {
      throw new MPesaError(ERROR_NO_VALIDATION_URL);
    }
    if (!confirmationURL) {
      throw new MPesaError(ERROR_NO_CONFIRMATION_URL);
    }
    if (
      defaultResponseType !== 'Canceled' &&
      defaultResponseType !== 'Completed'
    ) {
      throw new MPesaError(ERROR_INVALID_C2B_RESPONSE_TYPE);
    }
    try {
      if (moment().isAfter(this.accessTokenExpiry)) {
        await this.setAccessToken();
      }
      const response = await request.post(url, {
        body: {
          ConfirmationURL: confirmationURL,
          ResponseType: defaultResponseType,
          ShortCode: this.shortcode,
          ValidationURL: validationURL
        },
        headers: { Authorization: `Bearer ${this.accessToken}` },
        json: true
      });
      return response.ResponseDescription;
    } catch (error) {
      throw new MPesaError(error.message);
    }
  }

  /**
   *
   * Simulate payment requests from Client to Business (C2B). Only available in
   * the 'sandbox' environment
   * @param {number} amount - This is the amount being transacted
   * @param {number} sender - This is the phone number initiating the C2B
   * transaction
   * @param {string} billReferenceNumber - This is used on CustomerPayBillOnline
   * option only. This is where a customer is expected to enter a unique bill
   * identifier, e.g an Account Number
   */
  public async C2BSimulate(
    amount: number,
    sender: number,
    billReferenceNumber: string
  ): Promise<string> {
    if (!(this.config.environment === 'sandbox')) {
      throw new MPesaError(ERROR_SIMULATE_PRODUCTION);
    }
    const url = urls.sandbox.C2BSimulate;

    try {
      if (moment().isAfter(this.accessTokenExpiry)) {
        await this.setAccessToken();
      }

      const response = await request.post(url, {
        body: {
          Amount: amount,
          BillRefNumber: billReferenceNumber,
          CommandID: 'CustomerPayBillOnline',
          Msisdn: sender,
          ShortCode: this.shortcode
        },
        headers: { Authorization: `Bearer ${this.accessToken}` },
        json: true
      });

      return response.ResponseDescription;
    } catch (error) {
      throw new MPesaError(error.message);
    }
  }

  private async setAccessToken() {
    const url =
      this.config.environment === 'production'
        ? urls.production.OAuth
        : urls.sandbox.OAuth;

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
      throw new MPesaError(ERROR_INVALID_CREDENTIALS);
    }
  }
}
