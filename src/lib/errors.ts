/**
 *
 * A required value is missing in the configuration
 * @export
 * @class DarajaConfigError
 * @extends {Error}
 */
export class DarajaConfigError extends Error {
  /**
   * Creates an instance of DarajaConfigError.
   * @param {string} message
   * @memberof DarajaConfigError
   * @private
   */
  constructor(message: string) {
    super(message);
    this.name = 'DarajaConfigError';
  }
}
/**
 *
 * The Daraja API cannot process the request
 * @export
 * @class DarajaAPIError
 * @extends {Error}
 */
export class DarajaAPIError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DarajaAPIError';
  }
}
/**
 *
 * Invalid arguments have been passed
 * @export
 * @class MPesaExpressError
 * @extends {Error}
 */
export class MPesaExpressError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'MPesaExpressError';
  }
}
