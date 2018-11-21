const BASE_URL_PROD = 'https://api.safaricom.co.ke';
const BASE_URL_SANDBOX = 'https://sandbox.safaricom.co.ke';

export const urls = {
  production: {
    C2BRegisterURLs: `${BASE_URL_PROD}/mpesa/c2b/v1/registerurl`,
    LNMQuery: `${BASE_URL_PROD}/mpesa/stkpushquery/v1/query`,
    LNMRequest: `${BASE_URL_PROD}/mpesa/stkpush/v1/processrequest`,
    OAuth: `${BASE_URL_PROD}/oauth/v1/generate`
  },
  sandbox: {
    C2BRegisterURLs: `${BASE_URL_SANDBOX}/mpesa/c2b/v1/registerurl`,
    C2BSimulate: `${BASE_URL_SANDBOX}/mpesa/c2b/v1/simulate`,
    LNMQuery: `${BASE_URL_SANDBOX}/mpesa/stkpushquery/v1/query`,
    LNMRequest: `${BASE_URL_SANDBOX}/mpesa/stkpush/v1/processrequest`,
    OAuth: `${BASE_URL_SANDBOX}/oauth/v1/generate`
  }
};
