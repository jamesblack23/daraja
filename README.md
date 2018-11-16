# daraja

[![Build Status](https://travis-ci.com/austinewuncler/daraja.svg?branch=master)](https://travis-ci.com/austinewuncler/daraja)
[![npm version](https://badge.fury.io/js/daraja.svg)](https://badge.fury.io/js/daraja)

A NodeJS library to interact with Safaricom's Daraja M-Pesa API

## Installation

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

Lastly, call the `build()` method to get a configured `Daraja` instance.

```javascript
const daraja = darajaBuilder.build();
```
