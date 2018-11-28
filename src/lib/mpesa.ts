import { IDarajaConfig } from './config.interface';

import * as moment from 'moment';
import * as request from 'request-promise-native';
import { MPesaAPIError } from './errors';

export class MPesa {
  private tokenExpiry = moment();
  private accessToken = '';

  constructor(
    private consumerKey: string,
    private consumerSecret: string,
    private config: IDarajaConfig
  ) {}
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
      throw new MPesaAPIError(message);
    }
  }
}
