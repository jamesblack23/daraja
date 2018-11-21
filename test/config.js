const dotenv = require('dotenv');
dotenv.config();
module.exports = {
  LNMShortcode: parseInt(process.env.LNM_SHORTCODE),
  consumerKey: process.env.CONSUMER_KEY,
  consumerSecret: process.env.CONSUMER_SECRET,
  LNMPasskey: process.env.LNM_PASSKEY,
  LNMCallbackURL: process.env.LNM_CALLBACK_URL,
  LNM_MSISDN: process.env.LNM_MSISDN,
  businessShortcode: process.env.BUSINESS_SHORTCODE,
  C2BValidationURL: process.env.C2B_VALIDATION_URL,
  C2BConfirmationURL: process.env.C2B_VALIDATION_URL,
  testMSISDN: process.env.MSISDN
};
