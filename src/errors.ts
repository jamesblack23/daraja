export const OVERRIDE_PASSKEY_ERROR_MESSAGE =
  'Cannot override previously set Passkey';

export class DarajaConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DarajaConfigurationError';
  }
}
