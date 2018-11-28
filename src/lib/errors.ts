export class DarajaConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DarajaConfigError';
  }
}
