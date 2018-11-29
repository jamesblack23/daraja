### Importing the library

#### JavaScript

```javascript
const { Daraja } = require('daraja');

const mpesa = new Daraja(12345, 'consumerKey', 'consumerSecret')
  .configureMPesaExpress('passkey', 'http://callback.url')
  .build();
```

#### TypeScript

```typescript
import { Daraja } from 'daraja';

const mpesa = new Daraja(12345, 'consumerKey', 'consumerSecret')
  .configureMPesaExpress('passkey', 'http://callback.url')
  .build();
```

### Calling the API method

#### Using native Promises

```javascript
mpesa
  .mPesaExpressRequest(
    100, //amount
    254712345678, //sender
    600123, //recipient
    'CustomerPayBillOnline', //transactionType
    'INV0123455', //acountReference
    'BILL PAYMENT' //transactionDescription
  )
  .then(response => {
    // response = CheckoutRequestID
  })
  .catch(error => {
    // error = MPesaAPIError
  });
```

#### Using async-await

```javascript
try {
  const response = await mpesa.mPesaExpressRequest(
    100, //amount
    254712345678, //sender
    600123, //recipient
    'CustomerPayBillOnline', //transactionType
    'INV0123455', //acountReference
    'BILL PAYMENT' //transactionDescription
  );

  // response = CheckoutRequestID
} catch (error) {
  // error = MPesaAPIError
}
```
