export interface IDarajaConfig {
  mPesaExpress?: { passkey: string; callbackUrl: string };
  urls: { generateToken: string; mPesaExpress: { request: string } };
}
