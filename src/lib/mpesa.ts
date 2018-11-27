import * as moment from 'moment';
import * as request from 'request-promise-native';
import { IDarajaConfig } from './config.interface';
import { DarajaError, MpesaError } from './errors';
import {
  INVALID_SIMULATION_ENVIRONMENT,
  MISSING_ACCOUNT_REFERENCE_PARAMETER,
  MISSING_AMOUNT_PARAMETER,
  MISSING_B2C_CONFIG,
  MISSING_BILL_REFERENCE_NUMBER_PARAMETER,
  MISSING_CALLBACK_URL_PARAMETER,
  MISSING_COMMAND_ID_PARAMETER,
  MISSING_CONFIRMATION_URL_PARAMETER,
  MISSING_LIPA_NA_MPESA_CONFIG,
  MISSING_OCCASSION_PARAMETER,
  MISSING_RECIPIENT_PARAMETER,
  MISSING_REMARKS_PARAMETER,
  MISSING_RESULT_URL_PARAMETER,
  MISSING_SENDER_PARAMETER,
  MISSING_TIMEOUT_URL_PARAMETER,
  MISSING_TRANSACTION_DESCRIPTION_PARAMETER,
  MISSING_VALIDATION_URL_PARAMETER
} from './errors/constants';
import { urls } from './urls';

export class Mpesa {
  private accessToken: string | null;
  private accessTokenExpiry: moment.Moment;
  private config: IDarajaConfig = {
    environment: 'sandbox',
    urls: urls.sandbox
  };

  constructor(
    private shortcode: number,
    private consumerKey: string,
    private consumerSecret: string,
    config: Partial<IDarajaConfig>
  ) {
    this.config = {
      ...this.config,
      ...config,
      urls: config.environment === 'production' ? urls.production : urls.sandbox
    };
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
    if (!this.config.lipaNaMpesa) {
      throw new DarajaError(MISSING_LIPA_NA_MPESA_CONFIG);
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
      await this.setAccessToken();
      const timestamp = moment().format('YYYYMMDDHHmmss');
      const response = await request.post(this.config.urls.mpesaExpress, {
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

  /**
   *
   * register validation and confirmation URLs on M-Pesa
   * @param {string} validationUrl - the URL that receives the validation
   * request from M-Pesa API upon payment submission
   * @param {string} confirmationUrl - the URL that receives the confirmation
   * request from M-Pesa API upon payment completion
   * @param {('Canceled' | 'Completed')} [responseType='Completed'] - specifies
   * what is to happen if for any reason the validation URL is nor reachable
   */
  public async c2bRegisterUrls(
    validationUrl: string,
    confirmationUrl: string,
    responseType: 'Canceled' | 'Completed' = 'Completed'
  ) {
    if (!validationUrl) {
      throw new DarajaError(MISSING_VALIDATION_URL_PARAMETER);
    }
    if (!confirmationUrl) {
      throw new DarajaError(MISSING_CONFIRMATION_URL_PARAMETER);
    }

    try {
      await this.setAccessToken();
      const response = await request.post(this.config.urls.c2bRegisterUrls, {
        body: {
          ConfirmationURL: confirmationUrl,
          ResponseType: responseType,
          ShortCode: this.shortcode,
          ValidationURL: validationUrl
        },
        headers: { Authorization: `Bearer ${this.accessToken}` },
        json: true
      });

      return response.ResponseDescription;
    } catch (error) {
      throw new MpesaError(error.message);
    }
  }

  /**
   *
   *
   * simulate a payment made from the client phone's STK/SIM Toolkit menu
   * @param {number} amount - the amount being transacted
   * @param {number} sender - the phone number initiating the C2B transaction
   * @param {string} billReferenceNumber - a unique bill identifier, e.g an
   * Account Number
   */
  public async c2bSimulateTransaction(
    amount: number,
    sender: number,
    billReferenceNumber: string
  ) {
    if (!this.config.urls.c2bSimulateTransaction) {
      throw new DarajaError(INVALID_SIMULATION_ENVIRONMENT);
    }
    if (!amount) {
      throw new DarajaError(MISSING_AMOUNT_PARAMETER);
    }
    if (!sender) {
      throw new DarajaError(MISSING_SENDER_PARAMETER);
    }
    if (!billReferenceNumber) {
      throw new DarajaError(MISSING_BILL_REFERENCE_NUMBER_PARAMETER);
    }
    try {
      await this.setAccessToken();
      const response = await request.post(
        this.config.urls.c2bSimulateTransaction,
        {
          body: {
            Amount: amount,
            BillRefNumber: billReferenceNumber,
            CommandID: 'CustomerPayBillOnline',
            Msisdn: sender,
            ShortCode: this.shortcode
          },
          headers: { Authorization: `Bearer ${this.accessToken}` },
          json: true
        }
      );
      return response.ResponseDescription;
    } catch (error) {
      throw new MpesaError(error.message);
    }
  }

  /**
   *
   *
   * transact between an M-Pesa short code to a phone number registered on M-Pesa
   * @param {number} amount - the amount of money being sent to the customer
   * @param {number} recipient - the customer mobile number  to receive the
   * amount
   * @param {('SalaryPayment' | 'BusinessPayment' | 'PromotionPayment')} commandID
   *  - a unique command that specifies B2C transaction type
   * @param {string} resultUrl - the URL to be specified in your request that
   * will be used by M-Pesa to send notification upon processing of the payment
   * request
   * @param {string} timeoutUrl - the URL to be specified in your request that
   * will be used by API Proxy to send notification incase the payment request
   * is timed out while awaiting processing in the queue
   * @param {string} remarks - any additional information to be associated with
   * the transaction
   * @param {string} occassion - any additional information to be associated
   * with the transaction
   */
  public async b2cPaymentRequest(
    amount: number,
    recipient: number,
    commandID: 'SalaryPayment' | 'BusinessPayment' | 'PromotionPayment',
    resultUrl: string,
    timeoutUrl: string,
    remarks: string,
    occassion: string
  ) {
    if (!this.config.b2c) {
      throw new DarajaError(MISSING_B2C_CONFIG);
    }
    if (!amount) {
      throw new DarajaError(MISSING_AMOUNT_PARAMETER);
    }
    if (!recipient) {
      throw new DarajaError(MISSING_RECIPIENT_PARAMETER);
    }
    if (!commandID) {
      throw new DarajaError(MISSING_COMMAND_ID_PARAMETER);
    }
    if (!resultUrl) {
      throw new DarajaError(MISSING_RESULT_URL_PARAMETER);
    }
    if (!timeoutUrl) {
      throw new DarajaError(MISSING_TIMEOUT_URL_PARAMETER);
    }
    if (!remarks) {
      throw new DarajaError(MISSING_REMARKS_PARAMETER);
    }
    if (!occassion) {
      throw new DarajaError(MISSING_OCCASSION_PARAMETER);
    }
    try {
      await this.setAccessToken();
      const response = await request.post(this.config.urls.b2c, {
        body: {
          Amount: amount,
          CommandID: commandID,
          InitiatorName: this.config.b2c.initiatorName,
          Occassion: occassion,
          PartyA: this.shortcode,
          PartyB: recipient,
          QueueTimeOutURL: timeoutUrl,
          Remarks: remarks,
          ResultURL: resultUrl,
          SecurityCredential: this.config.b2c.securityCredential
        },
        headers: { Authorization: `Bearer ${this.accessToken}` },
        json: true
      });
      return response.ResponseDescription;
    } catch (error) {
      throw new MpesaError(error.message);
    }
  }

  private async setAccessToken() {
    if (moment().isBefore(this.accessTokenExpiry.subtract(1, 'minute'))) {
      return;
    }
    try {
      const response = await request.get(this.config.urls.oAuth, {
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
