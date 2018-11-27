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
  .addLipaNaMpesaConfig('passkey', 'transactionType')
  .build();

daraja
  .lipaNaMpesa(
    100,
    254712345678,
    12345,
    'http://mycallbackurl.com',
    'AccountReference',
    'TransactionDescription'
  )
  .then(response => console.log(response))
  .catch(error => console.log(error));
```

## API

The `DarajaBuilder` class is responsible for creating a properly configured
`Daraja` instance.

```javascript
const darajaBuilder = new DarajaBuilder(
  shortcode,
  consumerKey,
  consumerSecret,
  environment
);
```

- `shortcode`: `number` (required) - the organization's shortcode (Paybill or
  Buygoods - A 5 to 6 digit account number) used to identify an organization
- `consumerKey`: `string` (required) - the App's Consumer Key
- `consumerSecret`: `string` (required) - the App's Consumer Secret
- `environment`: `string` (optional, defaults to `sandbox`) - the environment
  Daraja will run on. Acceptable values are `sandbox` and `production`.

The following chainable `DarajaBuilder` instance methods return a newly
configured `DarajaBuilder` instance:

- `addLipaNaMpesaConfig(passkey, transactionType)` - Adds Lipa na M-Pesa to the
  configuration.
  - `passkey`: `string` (required for Lipa Na M-Pesa Online transactions) -
    the app's Lipa Na M-Pesa Online Passkey.
  - `transactionType`: `('CustomerPayBillOnline' | 'CustomerBuyGoodsOnline')`
    (optional, defaults to `CustomerPayBillOnline`) - the transaction type that
    is used to identify the transaction when sending the request to M-Pesa

### Lipa Na M-Pesa

```javascript
const daraja = darajaBuilder
  .addLipaNaMpesaConfig(passkey, transactionType)
  .build();
```

#### Lipa Na M-Pesa Online Request

Initiate an online payment on behalf of a customer. Activates an STK push to the
customer prompting them to enter their correct M-Pesa PIN to complete the
transaction.

```javascript
daraja.lipaNaMpesaRequest(
  amount,
  sender,
  recipient,
  callbackUrl,
  accountReference,
  transactionDescription
);
```

- `amount`: `number` (required) - the Amount to be transacted
- `sender`: `number` (required) - the phone number sending money. The parameter
  expected is a Valid Safaricom Mobile Number that is M-Pesa registered in the
  format 2547XXXXXXXX
- `recipient`: `number` (required) - the PayBill or Till Number for the
  organization receiving the funds.
- `callbackUrl`: `string` (required) - a valid endpoint to which the results
  will be sent by M-Pesa API via POST request
- `accountReference`: `string` (required) - an Alpha-Numeric parameter that is
  defined by your system as an Identifier
- `transactionDescription`: `string` (required) - any additional
  information/comment that can be sent along with the request from your system.
  Maximum of 13 Characters

Returns a `Promise` which resolves to a `string` value for the
`CheckoutRequestID`

Throws an `MPesaError` when something goes wrong

### C2B

```javascript
const daraja = darajaBuilder.build();
```

#### Register URLs

Register validation and confirmation URLs on M-Pesa

```javascript
daraja.C2BRegisterURLs(validationURL, confirmationURL, responseType);
```

- `validationUrl`: `string` (required) - the URL that receives the validation
  request from M-Pesa API upon payment submission
- `confirmationUrl`: `string` (required) - the URL that receives the
  confirmation request from M-Pesa API upon payment completion
- `responseType`: `('Canceled' | 'Completed')`
  (optional, defaults to `Completed`) - specifies what is to happen if for any
  reason the validation URL is not reachable.

Returns a `Promise` which resolves to a `string` value for `ResponseDescription`

Throws `MPesaError` when something goes wrong

#### Simulate C2B Transaction

Simulate a payment made from the client phone's STK/SIM Toolkit menu

```javascript
daraja.C2BSimulateTransaction(amount, sender, billReferenceNumber);
```

- `amount`: `number` (required) - the amount being transacted
- `sender`: `number` (required) - the phone number initiating the C2B
  transaction
- `billReferenceNumber`: `string` (required) - a unique bill identifier, e.g an
  Account Number

Returns a `Promise` which resolves to a `string` value for `ResponseDescription`

Throws `MPesaError` when something goes wrong

## Install

With [Node](https://nodejs.org/en/) & [npm](https://npmjs.org/) installed, run

```sh
npm install daraja
```

## License

MIT
