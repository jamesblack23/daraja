/**
 *
 * This error is thrown when calling a method on {@link MPesa} that requires a
 * particular configuration to have been set up on {@link Daraja} first.
 * @export
 * @extends {Error}
 * @see [Daraja.configureMPesaExpress()]{@link Daraja#configureMPesaExpress}
 */
export class DarajaConfigError extends Error {
  /**
   * @hideconstructor
   */
  constructor(message: string) {
    super(message);
    this.name = 'DarajaConfigError';
  }
}
/**
 *
 * This error is thrown when a call has been made to the Daraja API that caused
 * an error. The main cause for this error is passing invalid arguments to the
 * methods calling the API.
 * @export
 * @extends {Error}
 */
export class DarajaAPIError extends Error {
  /**
   * @hideconstructor
   */
  constructor(message: string) {
    super(message);
    this.name = 'DarajaAPIError';
  }
}
/**
 *
 * This error is thrown when calling {@link MPesa#mPesaExpressRequest} without
 * passing the required number of arguments.
 * @export
 * @extends {Error}
 */
export class MPesaExpressError extends Error {
  /**
   * Creates an instance of MPesaExpressError.
   * @hideconstructor
   */
  constructor(message: string) {
    super(message);
    this.name = 'MPesaExpressError';
  }
}
