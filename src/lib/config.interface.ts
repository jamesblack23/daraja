export interface IDarajaConfig {
  environment: 'sandbox' | 'production';
  lipaNaMpesa: {
    passkey: string | null;
    transactionType: 'CustomerPayBillOnline' | 'CustomerBuyGoodsOnline';
  };
  urls: {
    C2BRegisterUrls: string;
    mpesaExpress: string;
    oAuth: string;
    C2BSimulateTransaction?: string;
  };
}
