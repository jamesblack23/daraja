import { IDarajaConfig } from './daraja-config.interface';

export class Daraja {
  public static getInstance(
    shortcode: number,
    consumerKey: string,
    consumerSecret: string,
    config: Partial<IDarajaConfig>
  ): Daraja {
    if (!Daraja.daraja) {
      Daraja.daraja = new Daraja(
        shortcode,
        consumerKey,
        consumerSecret,
        config
      );
    }
    return Daraja.daraja;
  }

  private static daraja: Daraja;

  private constructor(
    private shortcode: number,
    private consumerKey: string,
    private consumerSecret: string,
    private config: Partial<IDarajaConfig>
  ) {}
}
