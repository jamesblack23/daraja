export const OVERRIDE_LNM_PASSKEY_ERROR_MESSAGE =
  'Cannot override previously set LNM Passkey';
export const OVERRIDE_LNM_CALLBACKURL_ERROR_MESSAGE =
  'Cannot override previously set LNM CallbackURL';

export const NO_LNM_CALLBACK_URL_ERROR_MESSAGE =
  'No Lipa Na Mpesa callback URL found';

export const NO_LNM_PASSKEY_ERROR_MESSAGE = 'No Lipa Na Mpesa Passkey found';
export const INVALID_CREDENTIALS_ERROR_MESSAGE =
  'Invalid Consumer Key or Secret';
export const INVALID_AMOUNT_ERROR_MESSAGE = 'Invalid Amount';
export const INVALID_PHONE_NUMBER_ERROR_MESSAGE = 'Invalid Phone Number';
export const INVALID_BUSINESS_SHORTCODE_ERROR_MESSAGE =
  'Invalid Business Shortcode';

export class DarajaConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DarajaConfigurationError';
  }
}

// tslint:disable-next-line:max-classes-per-file
export class MPesaError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'MPesaError';
  }
}
