export const urls = {
  production: {
    b2c: 'https://api.safaricom.co.ke/mpesa/b2c/v1/paymentrequest',
    c2bRegisterUrls: 'https://api.safaricom.co.ke/mpesa/c2b/v1/registerurl',
    mpesaExpress: 'https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
    oAuth: 'https://api.safaricom.co.ke/oauth/v1/generate'
  },
  sandbox: {
    b2c: 'https://sandbox.safaricom.co.ke/mpesa/b2c/v1/paymentrequest',
    c2bRegisterUrls: 'https://sandbox.safaricom.co.ke/mpesa/c2b/v1/registerurl',
    c2bSimulateTransaction:
      'https://sandbox.safaricom.co.ke/mpesa/c2b/v1/simulate',
    mpesaExpress:
      'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
    oAuth: 'https://sandbox.safaricom.co.ke/oauth/v1/generate'
  }
};
