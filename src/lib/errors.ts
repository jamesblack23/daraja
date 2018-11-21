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
export const ERROR_NO_VALIDATION_URL = 'No C2BValidationURL passed';
export const ERROR_NO_CONFIRMATION_URL = 'No C2BConfirmationURL passed';
export const ERROR_INVALID_C2B_RESPONSE_TYPE =
  'Invalid C2B default ResponseType';
export const ERROR_SIMULATE_PRODUCTION =
  'Cannot simulate C2B transactions on Production';
export const ERROR_NO_INITIATOR_NAME = 'No Initiator name passed';
export const ERROR_INITIATOR_NAME_OVERRIDE =
  'Cannot override previously set initiator name';
export const ERROR_NO_INITIATOR_PASSWORD = 'No initiator password passed';
export const ERROR_INITIATOR_PASSWORD_OVERRIDE =
  'Cannot override previously set initiator password';
export const ERROR_NO_B2C_RESULT_URL = 'No B2C Result URL passed';
export const ERROR_B2C_RESULT_URL_OVERRIDE =
  'Cannot override previously set B2C Result URL';
export const ERROR_NO_B2C_QUEUE_TIMEOUT_URL = 'No queue timeout URL passed';
export const ERROR_B2C_QUEUE_TIMEOUT_URL_OVERRIDE =
  'Cannot override previously set queue timeout URL';

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
