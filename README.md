# Daraja

![Daraja Logo](/img/daraja.png)
A NodeJS library to interact with Safaricom's Daraja M-Pesa API

[![npm version](https://badge.fury.io/js/daraja.svg)](https://badge.fury.io/js/daraja)

[![Build Status](https://travis-ci.com/austinewuncler/daraja.svg?branch=master)](https://travis-ci.com/austinewuncler/daraja)

[![dependencies Status](https://david-dm.org/austinewuncler/daraja/status.svg)](https://david-dm.org/austinewuncler/daraja)

[![Known Vulnerabilities](https://snyk.io/test/github/austinewuncler/daraja/badge.svg)](https://snyk.io/test/github/austinewuncler/daraja)

## Introduction

This is a JavaScript/TypeScript NodeJS library that simplifies making calls to the Safaricom's M-Pesa Daraja API.

## Prerequisites

You need an account on Safaricom's [Developer Portal](https://developer.safaricom.co.ke/) before using this library. Create an account if you don't already have one, and log in. Then create an app (sandbox or production) to get the required credentials (Consumer Key & Consumer Secret).

## Installation

You need [NodeJS](http://nodejs.org) installed to use this package.
Verify NodeJS and npm installation by

```sh
$ node -v
v10.13.0
$ npm -v
6.4.1
```

Then install the library in your project directory

```sh
npm install --save daraja
```

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

## Usage

First you instantiate the `DarajaBuilder` class by passing 3 arguments in the constructor.

```javascript
new DarajaBuilder(shortcode, consumerKey, consumerSecret);
```

- `shortcode` - `number` This is the organization's shortcode (Paybill or Buygoods - A 5 to 6 digit account number) used to identify an organization
- `consumerKey` - `string` Your App's Consumer Key (obtain from Developer's portal)
- `consumerSecret` - `string` Your App's Consumer Secret (obtain from Developer's portal)

For example

```javascript
const darajaBuilder = new DarajaBuilder(12345, 'consumerKey', 'consumerSecret');
```

Then you add configuration parameters via chained method calls on the `DarajaBuilder` instance.

```javascript
darajaBuilder.addLNMPasskey('passkey').addLNMCallbackURL('callbackURL');
```

These are all the chainable methods:

- `addLNMPasskey(passkey)` - Takes a string `passkey` argument and adds the Lipa na Mpesa Online Passkey which is required for Lipa na MPesa Online API transactions
- `addLNMCallbackURL(callbackURL)` - Takes a string `callbackURL` argument which is the endpoint to which M-Pesa sends notifications to for a Lipa na M-Pesa transaction.

Call the `build()` method to get a configured `Daraja` instance.

```javascript
const daraja = darajaBuilder.build();
```

Finally call the API using the various methods provided on the `Daraja` instance.

- Lipa Na M-Pesa Online - `lipaNaMpesa(Amount, PhoneNumber, PartyB, AccountReference, TransactionDesc)`

  - `Amount` - `number` - This is the amount transacted normally a numeric value. It is the money that the customer pays to the shortcode
  - `PhoneNumber` - `number` - This is the phone number sending the money. This parameter is expected to be a valid Safaricom mobile number that is M-Pesa registered. It must be in the format **2547XXXXXXXX**
  - `PartyB` - `number` - The organization receiving the funds.
  - `AccountReference` - `string` - This is an alphanumeric parameter that is defined by your system as an identifier of the transaction for _CustomerPayBillOnline_ transaction type.
  - `TransactionDesc` - `string` - This is any additional information/comment that can be sent along with the request from your system. Maximum of 13 characters.

  Returns a `Promise` which resolves to a successful response from M-Pesa

  ```javascript
  {
    MerchantRequestID: "16813-1590513-1",
    CheckoutRequestID: "ws_CO_DMZ_12321_23423476",
    ResponseCode: "0",
    ResponseDescription: "Success. Request accepted for processing",
    CustomerMessage: "Success. Request accepted for processing"
  }
  ```

  upon success, and throws `MPesaError` when the call fails

- Lipa Na M-Pesa Online Query- `lipaNaMPesaQuery(CheckoutRequestID)`

  - `CheckoutRequestID` - `string` - This is a global unique identifier of the processed checkout transaction request.

  Returns a `Promise` which resolves to a successful response from M-Pesa

  ```javascript
  {
    ResponseCode: "0",
    ResponseDescription: "The service request has been accepted successsfully",
    MerchantRequestID: "16813-1590513-1",
    CheckoutRequestID: "ws_CO_DMZ_123212312_2342347678234",
    ResultCode: "0",
    ResultDesc: "The service request is processed successfully."
  }
  ```

  upon success, and throws `MPesaError` when the call fails
