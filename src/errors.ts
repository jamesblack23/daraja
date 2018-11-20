export const OVERRIDE_LNM_PASSKEY_ERROR_MESSAGE =
  'Cannot override previously set LNM Passkey';
export const OVERRIDE_LNM_CALLBACKURL_ERROR_MESSAGE =
  'Cannot override previously set LNM CallbackURL';

export const NO_LNM_CALLBACK_URL_ERROR_MESSAGE =
  'No Lipa Na Mpesa callback URL found';

export const NO_LNM_PASSKEY_ERROR_MESSAGE = 'No Lipa Na Mpesa Passkey found';

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
