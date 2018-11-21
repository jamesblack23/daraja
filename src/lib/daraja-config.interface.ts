export interface IDarajaConfig {
  environment: 'sandbox' | 'production';
  LNMPasskey: string;
  LNMCallbackURL: string;
  initiatorName: string;
  initiatorPassword: string;
  B2CResultURL: string;
  B2CQueueTimeoutURL: string;
}
