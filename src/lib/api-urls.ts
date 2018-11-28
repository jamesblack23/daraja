export const API_URLS = {
  production: {
    generateToken: 'https://api.safaricom.co.ke/oauth/v1/generate',
    mPesaExpress: {
      request: 'https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest'
    }
  },
  sandbox: {
    generateToken: 'https://sandbox.safaricom.co.ke/oauth/v1/generate',
    mPesaExpress: {
      request: 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest'
    }
  }
};
