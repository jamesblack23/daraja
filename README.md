![Daraja Logo](/img/daraja.png)

[![npm version](https://badge.fury.io/js/daraja.svg)](https://badge.fury.io/js/daraja)
[![Build Status](https://travis-ci.com/austinewuncler/daraja.svg?branch=master)](https://travis-ci.com/austinewuncler/daraja)
[![Coverage Status](https://coveralls.io/repos/github/austinewuncler/daraja/badge.svg?branch=master)](https://coveralls.io/github/austinewuncler/daraja?branch=master)
[![dependencies Status](https://david-dm.org/austinewuncler/daraja/status.svg)](https://david-dm.org/austinewuncler/daraja)
[![Known Vulnerabilities](https://snyk.io/test/github/austinewuncler/daraja/badge.svg)](https://snyk.io/test/github/austinewuncler/daraja)

## Example

```javascript
const { DarajaBuilder } = require('daraja');

const daraja = new DarajaBuilder(12345, 'consumerKey', 'consumerSecret')
  .addLNMPasskey('passkey')
  .addLNMCallbackURL('callbackURL')
  .build();

daraja
  .lipaNaMpesa(
    100,
    254712345678,
    12345,
    'AccountReference',
    'TransactionDescription'
  )
  .then(response => console.log(response))
  .catch(error => console.log(error));
```

## API

The `DarajaBuilder` class is responsible for creating a properly configured `Daraja` instance.

```javascript
const darajaBuilder = new DarajaBuilder(
  shortcode,
  consumerKey,
  consumerSecret,
  environment
);
```

- `shortcode`: `number` (required) - the organization's shortcode (Paybill or Buygoods - A 5 to 6 digit account number) used to identify an organization
- `consumerKey`: `string` (required) - the App's Consumer Key
- `consumerSecret`: `string` (required) - the App's Consumer Secret
- `environment`: `string` (optional, defaults to `sandbox`) - the environment Daraja will run on. Acceptable values are `sandbox` and `production`.

The following chainable `DarajaBuilder` instance methods return a newly configured `DarajaBuilder` instance:

- `addLNMPasskey(LNMPasskey)` - Adds the Lipa na M-Pesa Passkey to the configuration.
  - `LNMPasskey`: `string` (required for Lipa Na M-Pesa Online transactions) - the app's Lipa Na M-Pesa Online Passkey
- `addLNMCallbackURL(LNMCallbackURL)` - Adds the Callback URL to receive Lipa na M-Pesa Online transaction notifications
  - `LNMCallbackURL`: `string` (required for Lipa Na M-Pesa Online transactions) - the URL to where M-Pesa will send notifications of Lipa Na M-Pesa transactions.

### Lipa Na M-Pesa

```javascript
const daraja = darajaBuilder
  .addLNMPasskey(LNMPasskey)
  .addLNMCallbackURL(LNMCallbackURL)
  .build();
```

#### Lipa Na M-Pesa Online Request

Initiate an online payment on behalf of a customer. Activates an STK push to the customer prompting them to enter their correct M-Pesa PIN to complete the transaction.

`daraja.lipaNaMpesaRequest(amount, sender, recipient, accountReference, transactionDescription)`

- `amount`: `number` (required) - the Amount to be transacted
- `sender`: `number` (required) - the phone number sending money. The parameter expected is a Valid Safaricom Mobile Number that is M-Pesa registered in the format 2547XXXXXXXX
- `recipient`: `number` (required) - the PayBill or Till Number for the organization receiving the funds.
- `accountReference`: `string` (required) - an Alpha-Numeric parameter that is defined by your system as an Identifier
- `transactionDescription`: `string` (required) - any additional information/comment that can be sent along with the request from your system. Maximum of 13 Characters

Returns a `Promise` which resolves to a `string` value for the `CheckoutRequestID`

Throws an `MPesaError` when something goes wrong

#### Lipa Na M-Pesa Online Query

Check the status of a Lipa Na M-Pesa Online Payment.

`daraja.lipaNaMPesaQuery(checkoutRequestID)`

- `checkoutRequestID`: `string` (required) - A global unique identifier of the processed checkout transaction request

Returns a `Promise` which resolves to a `string` value for the `ResultCode`

Throws an `MPesaError` when something goes wrong

### C2B

```javascript
const daraja = darajaBuilder.build();
```

#### Register URLs

Register validation and confirmation URLs on M-Pesa

`daraja.C2BRegisterURLs(validationURL, confirmationURL, defaultResponseType)`

- `validationURL`: `string` (required) - the URL that receives the validation request from API upon payment submission
- `confirmationURL`: `string` (required) - the URL that receives the confirmation request from API upon payment completion
- `defaultResponseType`: `string` (optional, defaults to `Completed`) - This parameter specifies what is to happen if for any reason the validation URL is not reachable

Returns a `Promise` which resolves to a `string` value for `ResponseDescription`

Throws `MPesaError` when something goes wrong

#### Simulate Transaction

Simulate payment requests from Client to Business (C2B). Only available in the 'sandbox' environment

`daraja.C2BSimulate(amount, sender, billReferenceNumber)`

- `amount`: `number` (required) - the amount being transacted
- `sender`: `number` (required) - the phone number initiating the C2B transaction
- `billReferenceNumber`: `string` (required) - a unique bill identifier, e.g an Account Number

Returns a `Promise` that resolves to a `string` value for `ResponseDescription`

Throws `MPesaError` when something goes wrong

## Install

With [Node](https://nodejs.org/en/) & [npm](https://npmjs.org/) installed, run

```sh
npm install daraja
```

## License

MIT
