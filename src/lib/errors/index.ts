export class DarajaConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DarajaConfigError';
  }
}

export class MpesaCredentialsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'MpesaCredentialsError';
  }
}
