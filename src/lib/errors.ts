export class DarajaConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DarajaConfigError';
  }
}
export class MPesaAPIError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'MPesaAPIError';
  }
}
