const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  consumerKey: process.env.CONSUMER_KEY,
  consumerSecret: process.env.CONSUMER_SECRET,
  mPesaExpress: {
    shortcode: process.env.LNM_SHORTCODE,
    passkey: process.env.LNM_PASSKEY,
    callbackUrl: process.env.LNM_CALLBACK_URL,
    msisdn: process.env.LNM_MSISDN
  }
};
