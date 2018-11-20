import * as moment from 'moment';
import * as request from 'request-promise-native';
import { IDarajaConfig } from './daraja-config.interface';
import {
  ILNMQueryResponse,
  ILNMSuccessResponse
} from './daraja-response.interface';
import {
  DarajaConfigurationError,
  INVALID_AMOUNT_ERROR_MESSAGE,
  INVALID_BUSINESS_SHORTCODE_ERROR_MESSAGE,
  INVALID_CREDENTIALS_ERROR_MESSAGE,
  INVALID_PHONE_NUMBER_ERROR_MESSAGE,
  MPesaError,
  NO_LNM_CALLBACK_URL_ERROR_MESSAGE,
  NO_LNM_PASSKEY_ERROR_MESSAGE
} from './errors';
import { urls } from './urls';

export class Daraja {
  private accessToken: string;
  private accessTokenExpiry: moment.Moment;

  constructor(
    private shortcode: number,
    private consumerKey: string,
    private consumerSecret: string,
    private config: Partial<IDarajaConfig>
  ) {
    this.accessToken = '';
    this.accessTokenExpiry = moment();
  }

  /**
   *
   * Initiates online payment on behalf of a customer
   * @param {number} Amount - This is the Amount transacted normally a numeric
   * value.
   * Money that customer pays to the Shorcode.
   * Only whole numbers are supported.
   * @param {number} PhoneNumber - The phone number sending money.
   * The parameter expected is a Valid Safaricom Mobile Number that is M-Pesa
   * registered in the format 2547XXXXXXXX
   * @param {number} PartyB - The organization receiving the funds.
   * The parameter expected is a 5 to 6 digit
   * @param {string} AccountReference - An Alpha-Numeric parameter that is
   * defined by your system as an Identifier
   * of the transaction for CustomerPayBillOnline transaction type.
   * @param {string} TransactionDesc - This is any additional
   * information/comment that can be sent along with the
   * request from your system. Maximum of 13 Characters.
   */
  public async lipaNaMpesa(
    Amount: number,
    PhoneNumber: number,
    PartyB: number,
    AccountReference: string,
    TransactionDesc: string
  ): Promise<ILNMSuccessResponse> {
    if (!this.config.LNMCallbackURL) {
      throw new DarajaConfigurationError(NO_LNM_CALLBACK_URL_ERROR_MESSAGE);
    }
    if (!this.config.LNMPasskey) {
      throw new DarajaConfigurationError(NO_LNM_PASSKEY_ERROR_MESSAGE);
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
          AccountReference,
          Amount,
          BusinessShortCode: this.shortcode,
          CallBackURL: this.config.LNMCallbackURL,
          PartyA: PhoneNumber,
          PartyB,
          Password: Buffer.from(
            `${this.shortcode}${this.config.LNMPasskey}${timestamp}`
          ).toString('base64'),
          PhoneNumber,
          Timestamp: timestamp,
          TransactionDesc,
          TransactionType: 'CustomerPayBillOnline'
        },
        headers: { Authorization: `Bearer ${this.accessToken}` },
        json: true
      });
      return response;
    } catch (error) {
      if (error.error.errorMessage === 'Bad Request - Invalid Amount') {
        throw new MPesaError(INVALID_AMOUNT_ERROR_MESSAGE);
      }
      if (error.error.errorMessage === 'Bad Request - Invalid PhoneNumber') {
        throw new MPesaError(INVALID_PHONE_NUMBER_ERROR_MESSAGE);
      }
      if (
        error.error.errorMessage === 'Bad Request - Invalid BusinessShortCode'
      ) {
        throw new MPesaError(INVALID_BUSINESS_SHORTCODE_ERROR_MESSAGE);
      }
      throw new MPesaError(error.message);
    }
  }

  /**
   *
   * Checks the status of a Lipa Na M-Pesa Online Payment.
   * @param {string} CheckoutRequestID - This is a global unique identifier of
   * the processed checkout transaction request.
   */
  public async lipaNaMPesaQuery(
    CheckoutRequestID: string
  ): Promise<ILNMQueryResponse> {
    if (!this.config.LNMPasskey) {
      throw new DarajaConfigurationError(NO_LNM_PASSKEY_ERROR_MESSAGE);
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
      const response = request.post(url, {
        body: {
          BusinessShortCode: this.shortcode,
          CheckoutRequestID,
          Password: Buffer.from(
            `${this.shortcode}${this.config.LNMPasskey}${timestamp}`
          ).toString('base64'),
          Timestamp: timestamp
        },
        headers: { Authorization: `Bearer ${this.accessToken}` },
        json: true
      });
      return response;
    } catch (error) {
      throw new MPesaError(error.message);
    }
  }

  /**
   *
   * Register validation and confirmation URLs on M-Pesa
   * @param {string} ValidationURL - This is the URL that receives the
   * validation request from API upon payment submission
   * @param {string} ConfirmationURL - This is the URL that receives the
   * confirmation request from API upon payment completion
   * @param {('Canceled' | 'Completed')} ResponseType - This parameter
   * specifies what is to happen if for any reason the validation URL is not
   * reachable
   */
  public async C2BRegisterURLs(
    ValidationURL: string,
    ConfirmationURL: string,
    ResponseType: 'Canceled' | 'Completed'
  ): Promise<string> {
    const url =
      this.config.environment === 'production'
        ? urls.production.C2BRegisterURLs
        : urls.sandbox.C2BRegisterURLs;

    try {
      if (moment().isAfter(this.accessTokenExpiry)) {
        await this.setAccessToken();
      }
      const response = await request.post(url, {
        body: {
          ConfirmationURL,
          ResponseType,
          ShortCode: this.shortcode,
          ValidationURL
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
   * @param {number} Amount - This is the amount being transacted
   * @param {number} Msisdn - This is the phone number initiating the C2B
   * transaction
   * @param {('CustomerPayBillOnline' | 'CustomerBuyGoodsOnline')} CommandID -
   * This is a unique identifier of the transaction type
   * @param {string} BillRefNumber - This is used on CustomerPayBillOnline
   * option only. This is where a customer is expected to enter a unique bill
   * identifier, e.g an Account Number
   */
  public async C2BSimulate(
    Amount: number,
    Msisdn: number,
    CommandID: 'CustomerPayBillOnline' | 'CustomerBuyGoodsOnline',
    BillRefNumber: string
  ): Promise<string> {
    if (!(this.config.environment === 'sandbox')) {
      throw new MPesaError('Cannot simulate C2B transactions on Production');
    }
    const url = urls.sandbox.C2BSimulate;

    try {
      if (moment().isAfter(this.accessTokenExpiry)) {
        await this.setAccessToken();
      }

      const response = await request.post(url, {
        body: {
          Amount,
          BillRefNumber,
          CommandID,
          Msisdn,
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
      throw new MPesaError(INVALID_CREDENTIALS_ERROR_MESSAGE);
    }
  }
}
