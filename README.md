![Daraja Logo](img/daraja.png)

A NodeJS library to simplify integration with Safaricom's Daraja M-Pesa API

![npm](https://img.shields.io/npm/v/daraja.svg?style=flat-square)
![Travis (.com)](https://img.shields.io/travis/com/austinewuncler/daraja.svg?style=flat-square)
![Coveralls github](https://img.shields.io/coveralls/github/austinewuncler/daraja.svg?style=flat-square)
![Codacy grade](https://img.shields.io/codacy/grade/52f5703641404c969aa8d6c0d9f0616d.svg?style=flat-square)
![Code Climate issues](https://img.shields.io/codeclimate/issues/austinewuncler/daraja.svg?style=flat-square)
![Code Climate maintainability](https://img.shields.io/codeclimate/maintainability/austinewuncler/daraja.svg?style=flat-square)
![David](https://img.shields.io/david/austinewuncler/daraja.svg?style=flat-square)
![David](https://img.shields.io/david/dev/austinewuncler/daraja.svg?style=flat-square)
![npm bundle size (minified)](https://img.shields.io/bundlephobia/min/daraja.svg?style=flat-square)
![npm](https://img.shields.io/npm/dt/daraja.svg?style=flat-square)
![GitHub](https://img.shields.io/github/license/austinewuncler/daraja.svg?style=flat-square)

## Example

```javascript
const { Daraja } = require('daraja');

// instantiate Daraja with the organization's shortcode and app's Consumer Key
// and Consumer Secret
const daraja = new Daraja([SHORTCODE], '[CONSUMER_KEY]', '[CONSUMER_SECRET]');

// create an MPesa instance configured according to the API's you will consume
// e.g to consume MPesa Express (Lipa Na M-Pesa Online) API
const mpesa = daraja
  .configureMPesaExpress('[PASSKEY]', '[CALLBACK_URL]')
  .build();

// finally make the call to the API passing the required arguments
mpesa
  .mPesaExpressRequest(
    [AMOUNT],
    [SENDER],
    [RECIPIENT],
    '[TRANSACTION_TYPE]',
    '[ACCOUNT_REFERENCE]',
    '[TRANSACTION_DESCRIPTION]'
  )
  .then(response => {
    // if the call was successfull, you can do something with the response here
  })
  .catch(error => {
    // if any error occurs, you can handle it here
  });

// you can also use async-await to handle the response and errors
try {
  const response = await mpesa.mPesaExpressRequest(
    [AMOUNT],
    [SENDER],
    [RECIPIENT],
    '[TRANSACTION_TYPE]',
    '[ACCOUNT_REFERENCE]',
    '[TRANSACTION_DESCRIPTION]'
  );
  // handle the response here
} catch (error) {
  // handle any errors here
}
```

## Motivation

I developed this library to make it as painless as possible for JavaScript &
TypeScript developers to integrate their web applications with Safaricom's
Daraja M-Pesa API.

The emphasis is to make use of modern JavaScript & TypeScript syntax to provide
a clean an easy to use interface.
This library is under constant maintenance and more features will be added to
simplify the integration even further and capture all common use cases.

## Installation

1. Ensure you have [Node & npm](https://nodejs.org) installed for your
   operating system.

   ```sh
   node --version
   ```

   ```sh
   npm --version
   ```

2. Open a command line and navigate to your project folder. Run the following
   command to install `daraja` as a project dependency

   ```sh
   npm install --save daraja
   ```

## API Reference

Visit the [documentation](https://austinewuncler.github.io/daraja)

## License

This project is licensed under the [MIT](LICENCE) License.
