export class DarajaConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DarajaConfigError';
  }
}
export class DarajaAPIError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DarajaAPIError';
  }
}
export class MPesaExpressError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'MPesaExpressError';
  }
}
