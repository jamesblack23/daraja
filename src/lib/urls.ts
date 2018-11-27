export const urls = {
  production: {
    C2BRegisterUrls: 'https://api.safaricom.co.ke/mpesa/c2b/v1/registerurl',
    mpesaExpress: 'https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
    oAuth: 'https://api.safaricom.co.ke/oauth/v1/generate'
  },
  sandbox: {
    C2BRegisterUrls: 'https://sandbox.safaricom.co.ke/mpesa/c2b/v1/registerurl',
    C2BSimulateTransaction:
      'https://sandbox.safaricom.co.ke/mpesa/c2b/v1/simulate',
    mpesaExpress:
      'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
    oAuth: 'https://sandbox.safaricom.co.ke/oauth/v1/generate'
  }
};
