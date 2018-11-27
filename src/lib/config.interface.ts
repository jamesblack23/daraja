export interface IDarajaConfig {
  environment: 'sandbox' | 'production';
  lipaNaMpesa?: {
    passkey: string | null;
    transactionType: 'CustomerPayBillOnline' | 'CustomerBuyGoodsOnline';
  };
  b2c?: { initiatorName: string; securityCredential: string };
  urls: {
    C2BRegisterUrls: string;
    mpesaExpress: string;
    oAuth: string;
    C2BSimulateTransaction?: string;
  };
}
