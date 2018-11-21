export const ERROR_LNM_PASSKEY_OVERRIDE =
  'Cannot override previously set LNM Passkey';
export const ERROR_CALLBACK_URL_OVERRIDE =
  'Cannot override previously set CallbackURL';
export const ERROR_NO_CALLBACK_URL = 'No callback URL found';
export const ERROR_NO_LNM_PASSKEY = 'No Lipa Na Mpesa Passkey found';
export const ERROR_INVALID_CREDENTIALS = 'Invalid Consumer Key or Secret';
export const ERROR_INVALID_AMOUNT = 'Invalid Amount';
export const ERROR_INVALID_PHONE_NUMBER = 'Invalid Phone Number';
export const ERROR_INVALID_BUSINESS_SHORTCODE = 'Invalid Business Shortcode';
export const ERROR_MISSING_SHORTCODE = 'No Business Shortcode passed';
export const ERROR_MISSING_CONSUMER_KEY = 'No consumer Key passed';
export const ERROR_MISSING_CONSUMER_SECRET = 'No consumer Secret passed';
export const ERROR_INVALID_ENVIRONMENT =
  'Invalid environment parameter passed. Only sandbox and production are allowed';

export class DarajaConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DarajaConfigError';
  }
}

export class MPesaError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'MPesaError';
  }
}
