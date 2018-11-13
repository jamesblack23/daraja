export const OVERRIDE_LNM_PASSKEY_ERROR_MESSAGE =
  'Cannot override previously set LNM Passkey';
export const OVERRIDE_LNM_CALLBACKURL_ERROR_MESSAGE =
  'Cannot override previously set LNM CallbackURL';

export class DarajaConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DarajaConfigurationError';
  }
}
