/**
 *
 *
 * @export
 * @class DarajaBuilder
 */
export class DarajaBuilder {
  /**
   * Creates an instance of DarajaBuilder.
   * @param {number} shortcode - This is the organization's shortcode
   * (Paybill or Buygoods - A 5 to 6 digit account number) used to identify an organization
   * @param {string} consumerKey - Your App's Consumer Key (obtain from Developer's portal)
   * @param {string} consumerSecret - Your App's Consumer Secret (obtain from Developer's portal)
   */
  constructor(
    public shortcode: number,
    public consumerKey: string,
    public consumerSecret: string
  ) {}
}
