export interface IDarajaConfig {
  environment: 'sandbox' | 'production';
  lipaNaMpesa?: {
    passkey: string | null;
    transactionType: 'CustomerPayBillOnline' | 'CustomerBuyGoodsOnline';
  };
  b2c?: { initiatorName: string; securityCredential: string };
  urls: {
    c2bRegisterUrls: string;
    mpesaExpress: string;
    oAuth: string;
    c2bSimulateTransaction?: string;
    b2c: string;
  };
}
