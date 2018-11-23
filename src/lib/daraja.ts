import * as moment from 'moment';
import * as request from 'request-promise-native';
import { IDarajaConfig } from './config.interface';
import { MpesaCredentialsError } from './errors';
import { urls } from './urls';

export class Daraja {
  private accessToken: string | null = null;
  private accessTokenExpiry: moment.Moment = moment();

  constructor(
    private shortcode: number,
    private consumerKey: string,
    private consumerSecret: string,
    private config: Partial<IDarajaConfig>
  ) {}

  private async setAccessToken() {
    const url =
      this.config.environment === 'production'
        ? urls.production.oAuth
        : urls.sandbox.oAuth;
    try {
      const { access_token, expires_in } = await request.get(url, {
        auth: { username: this.consumerKey, password: this.consumerSecret },
        json: true,
        qs: { grant_type: 'client_credentials' }
      });
      this.accessToken = access_token;
      this.accessTokenExpiry = moment().add(expires_in, 'seconds');
    } catch (error) {
      throw new MpesaCredentialsError(error.response.statusMessage);
    }
  }
}
