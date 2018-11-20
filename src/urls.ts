const BASE_URL_PROD = 'https://api.safaricom.co.ke';
const BASE_URL_SANDBOX = 'https://sandbox.safaricom.co.ke';

export const urls = {
  production: {
    LNMQuery: `${BASE_URL_PROD}/mpesa/stkpushquery/v1/query`,
    LNMRequest: `${BASE_URL_PROD}/mpesa/stkpush/v1/processrequest`,
    OAuth: `${BASE_URL_PROD}/oauth/v1/generate`
  },
  sandbox: {
    LNMQuery: `${BASE_URL_SANDBOX}/mpesa/stkpushquery/v1/query`,
    LNMRequest: `${BASE_URL_SANDBOX}/mpesa/stkpush/v1/processrequest`,
    OAuth: `${BASE_URL_SANDBOX}/oauth/v1/generate`
  }
};
