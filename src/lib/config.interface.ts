export interface IDarajaConfig {
  readonly environment: 'sandbox' | 'production';
  lipaNaMpesa: {
    passkey: string | null;
    transactionType: 'CustomerPayBillOnline' | 'CustomerBuyGoodsOnline';
  } | null;
}
