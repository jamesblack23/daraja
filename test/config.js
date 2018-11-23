const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  lipaNaMpesaShortcode: process.env.LNM_SHORTCODE,
  consumerKey: process.env.CONSUMER_KEY,
  consumerSecret: process.env.CONSUMER_SECRET,
  passkey: process.env.LNM_PASSKEY,
  stkPushPhone: process.env.LNM_MSISDN,
  stkCallbackUrl: process.env.LNM_CALLBACK_URL
};
