export class DarajaError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DarajaError';
  }
}

export class MpesaError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'MpesaError';
  }
}
