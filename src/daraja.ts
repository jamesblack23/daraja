import * as request from 'request-promise-native';
import { IDarajaConfig } from './daraja-config.interface';
import {
  DarajaConfigurationError,
  MPesaError,
  NO_LNM_CALLBACK_URL_ERROR_MESSAGE,
  NO_LNM_PASSKEY_ERROR_MESSAGE
} from './errors';
import { LNM_URL, OAUTH_URL } from './urls';
import * as utils from './utils';

export class Daraja {
  /**
   *
   *
   * @static
   * @param {number} shortcode - The Business Shortcode registered with the app
   * @param {string} consumerKey - Your App's Consumer Key (obtain from Developer's portal)
   * @param {string} consumerSecret - Your App's Consumer Secret (obtain from Developer's portal)
   * @param {Partial<IDarajaConfig>} config - Object containing shared request parameters
   * @returns {Daraja}
   */
  public static getInstance(
    shortcode: number,
    consumerKey: string,
    consumerSecret: string,
    config: Partial<IDarajaConfig>
  ): Daraja {
    if (!Daraja.daraja) {
      Daraja.daraja = new Daraja(
        shortcode,
        consumerKey,
        consumerSecret,
        config
      );
    }
    return Daraja.daraja;
  }

  private static daraja: Daraja;
  private accessToken: string;
  private accessTokenExpiry: number;

  private constructor(
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
   *
   * @param {number} Amount - This is the Amount transacted normaly a numeric value.
   * Money that customer pays to the Shorcode.
   * Only whole numbers are supported.
   * @param {number} PhoneNumber - The phone number sending money.
   * The parameter expected is a Valid Safaricom Mobile Number that is M-Pesa registered in the format 2547XXXXXXXX
   * @param {number} PartyB - The organization receiving the funds.
   * The parameter expected is a 5 to 6 digit
   * @param {string} AccountReference - An Alpha-Numeric parameter that is defined by your system as an Identifier
   * of the transaction for CustomerPayBillOnline transaction type.
   * @param {string} TransactionDesc - This is any additional information/comment that can be sent along with the
   * request from your system. Maximum of 13 Characters.
   * @returns
   * @memberof Daraja
   */
  public async lipaNaMpesa(
    Amount: number,
    PhoneNumber: number,
    PartyB: number,
    AccountReference: string,
    TransactionDesc: string
  ) {
    try {
      if (!this.config.LNMCallbackURL) {
        throw new DarajaConfigurationError(NO_LNM_CALLBACK_URL_ERROR_MESSAGE);
      }
      if (!this.config.LNMPasskey) {
        throw new DarajaConfigurationError(NO_LNM_PASSKEY_ERROR_MESSAGE);
      }
      if (Date.now() > this.accessTokenExpiry) {
        await this.setAccessToken();
      }
      const timestamp = utils.generateTimestamp(new Date());
      const response = await request.post(LNM_URL, {
        body: {
          AccountReference,
          Amount,
          BusinessShortCode: this.shortcode,
          CallBackURL: this.config.LNMCallbackURL,
          PartyA: PhoneNumber,
          PartyB,
          Password: utils.generateLNMPassword(
            this.shortcode,
            this.config.LNMPasskey,
            timestamp
          ),
          PhoneNumber,
          Timestamp: timestamp,
          TransactionDesc,
          TransactionType: 'CustomerPayBillOnline'
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
    try {
      const response = await request.get(OAUTH_URL, {
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
