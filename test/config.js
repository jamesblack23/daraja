require('dotenv').config();

module.exports = {
  businessShortcode: parseInt(process.env.BUSINESS_SHORTCODE),
  consumerKey: process.env.CONSUMER_KEY,
  consumerSecret: process.env.CONSUMER_SECRET,
  testPhoneNumber: parseInt(process.env.TEST_MSISDN),
  initiatorName: process.env.INITIATOR_NAME,
  initiatorPassword: process.env.INITIATOR_PASSWORD,
  lipaNaMpesa: {
    shortcode: parseInt(process.env.LNM_SHORTCODE),
    passkey: process.env.LNM_PASSKEY,
    phoneNumber: parseInt(process.env.LNM_MSISDN),
    callbackUrl: process.env.LNM_CALLBACK_URL
  },
  c2b: {
    validationUrl: process.env.C2B_VALIDATION_URL,
    confirmationUrl: process.env.C2B_CONFIRMATION_URL
  },
  b2c: {
    resultUrl: process.env.B2C_RESULT_URL,
    timeoutUrl: process.env.B2C_TIMEOUT_URL
  }
};
