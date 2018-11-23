export interface IDarajaConfig {
  environment: 'sandbox' | 'production';
  lipaNaMpesa: {
    passkey: string | null;
    transactionType: 'CustomerPayBillOnline' | 'CustomerBuyGoodsOnline';
  };
}
