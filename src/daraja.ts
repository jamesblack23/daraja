import * as moment from 'moment';
import * as request from 'request-promise-native';
import { IDarajaConfig } from './daraja-config.interface';
import {
  ILNMQueryResponse,
  ILNMSuccessResponse
} from './daraja-response.interface';
import {
  DarajaConfigurationError,
  MPesaError,
  NO_LNM_CALLBACK_URL_ERROR_MESSAGE,
  NO_LNM_PASSKEY_ERROR_MESSAGE
} from './errors';
import { urls } from './urls';

export class Daraja {
  private accessToken: string;
  private accessTokenExpiry: number;

  constructor(
    private shortcode: number,
    private consumerKey: string,
    private consumerSecret: string,
    private config: Partial<IDarajaConfig>
  ) {
    this.accessToken = '';
    this.accessTokenExpiry = Date.now();
  }

  /**
   *
   * Initiates online payment on behalf of a customer
   * @param {number} Amount - This is the Amount transacted normaly a numeric
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
      if (Date.now() > this.accessTokenExpiry) {
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
      if (Date.now() > this.accessTokenExpiry) {
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
      this.accessTokenExpiry =
        this.accessTokenExpiry + parseInt(response.expires_in, 10) * 1000;
    } catch (error) {
      throw new MPesaError(error.message);
    }
  }
}
