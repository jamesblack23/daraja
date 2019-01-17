const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const nock = require('nock');
const api = require('../dist/lib/api');

chai.use(chaiAsPromised);
const { expect } = chai;

describe('API', () => {
  after(() => {
    nock.cleanAll();
  });

  describe('getEnvPath()', () => {
    it('should return the correct path for the environment', () => {
      expect(api.getEnvPath('production')).to.equal('api');
    });
  });

  describe('generateToken()', () => {
    before(() => {
      nock('https://sandbox.safaricom.co.ke')
        .get('/oauth/v1/generate')
        .basicAuth({ user: 'consumerKey', pass: 'consumerSecret' })
        .query({ grant_type: 'client_credentials' })
        .reply(200, {
          access_token: 'accessToken',
          expires_in: '3599'
        });
      nock('https://sandbox.safaricom.co.ke')
        .get('/oauth/v1/generate')
        .basicAuth({ user: 'invalidKey', pass: 'invalidSecret' })
        .query({ grant_type: 'client_credentials' })
        .reply(400);
    });

    it('should resolve to an object containing the \'access_token\' and \'expires_in\' properties', () =>
      expect(
        api.generateToken('sandbox', 'consumerKey', 'consumerSecret')
      ).to.eventually.deep.equal({
        access_token: 'accessToken',
        expires_in: '3599'
      }));
    it('should throw an error if the credentials are invalid', () =>
      expect(api.generateToken('sandbox', 'invalidKey', 'invalidSecret')).to
        .eventually.be.rejected);
  });

  describe('mpesaExpressRequest()', () => {
    before(() => {
      nock('https://sandbox.safaricom.co.ke')
        .matchHeader('Authorization', 'Bearer accessToken')
        .post('/mpesa/stkpush/v1/processrequest', {
          BusinessShortCode: 123456,
          Password: 'password',
          Timestamp: '20190109164054',
          TransactionType: 'CustomerPayBillOnline',
          Amount: 100,
          PartyA: 254712345678,
          PartyB: 123456,
          PhoneNumber: 254712345678,
          CallBackURL: 'http://callbackurl.com',
          AccountReference: 'accountref',
          TransactionDesc: 'transactiondesc'
        })
        .reply(200, {
          MerchantRequestID: 'merchantRequestId',
          CheckoutRequestID: 'checkoutRequestId',
          ResponseCode: '0',
          ResponseDescription: 'Success. Request accepted for processing',
          CustomerMessage: 'Success. Request accepted for processing'
        });

      nock('https://sandbox.safaricom.co.ke')
        .matchHeader('Authorization', 'Bearer accessToken')
        .post('/mpesa/stkpush/v1/processrequest', {
          BusinessShortCode: 123456,
          Password: 'password',
          Timestamp: '20190109164054',
          TransactionType: 'invalid transaction type',
          Amount: 100,
          PartyA: 254712345678,
          PartyB: 123456,
          PhoneNumber: 254712345678,
          CallBackURL: 'http://callbackurl.com',
          AccountReference: 'accountref',
          TransactionDesc: 'transactiondesc'
        })
        .reply(400);
    });

    it('should resolve to an object containing the \'MerchantRequestID\' and \'CheckoutRequestID\' properties', () =>
      expect(
        api.mpesaExpressRequest(
          'sandbox',
          'accessToken',
          123456,
          'password',
          '20190109164054',
          'CustomerPayBillOnline',
          100,
          254712345678,
          123456,
          254712345678,
          'http://callbackurl.com',
          'accountref',
          'transactiondesc'
        )
      ).to.eventually.deep.equal({
        MerchantRequestID: 'merchantRequestId',
        CheckoutRequestID: 'checkoutRequestId',
        ResponseCode: '0',
        ResponseDescription: 'Success. Request accepted for processing',
        CustomerMessage: 'Success. Request accepted for processing'
      }));

    it('should throw an error if the parameters are incorrect', () =>
      expect(
        api.mpesaExpressRequest(
          'sandbox',
          'accessToken',
          123456,
          'password',
          '20190109164054',
          'invalid transaction type',
          100,
          254712345678,
          123456,
          254712345678,
          'http://callbackurl.com',
          'accountref',
          'transactiondesc'
        )
      ).to.eventually.be.rejected);
  });

  describe('mpesaExpressQuery()', () => {
    before(() => {
      nock('https://sandbox.safaricom.co.ke')
        .matchHeader('Authorization', 'Bearer accessToken')
        .post('/mpesa/stkpushquery/v1/query', {
          BusinessShortCode: 123456,
          Password: 'password',
          Timestamp: '20190109164054',
          CheckoutRequestID: 'checkoutRequestId'
        })
        .reply(200, {
          ResponseCode: '0',
          ResponseDescription:
            'The service request has been accepted successsfully',
          MerchantRequestID: 'merchantRequestId',
          CheckoutRequestID: 'checkoutRequestId',
          ResultCode: '1032',
          ResultDesc: '[STK_CB - ]Request cancelled by user'
        });

      nock('https://sandbox.safaricom.co.ke')
        .matchHeader('Authorization', 'Bearer accessToken')
        .post('/mpesa/stkpushquery/v1/query', {
          BusinessShortCode: 123456,
          Password: 'password',
          Timestamp: '20190109164054',
          CheckoutRequestID: 'invalidCheckoutRequestId'
        })
        .reply(400);
    });

    it('should resolve to an object containing the \'ResultCode\' and \'ResultDesc\' properties', () =>
      expect(
        api.mpesaExpressQuery(
          'sandbox',
          'accessToken',
          123456,
          'password',
          '20190109164054',
          'checkoutRequestId'
        )
      ).to.eventually.deep.equal({
        ResponseCode: '0',
        ResponseDescription:
          'The service request has been accepted successsfully',
        MerchantRequestID: 'merchantRequestId',
        CheckoutRequestID: 'checkoutRequestId',
        ResultCode: '1032',
        ResultDesc: '[STK_CB - ]Request cancelled by user'
      }));

    it('should throw an error if the parameters are incorrect', () =>
      expect(
        api.mpesaExpressQuery(
          'sandbox',
          'accessToken',
          123456,
          'password',
          '20190109164054',
          'invalidCheckoutRequestId'
        )
      ).to.eventually.be.rejected);
  });

  describe('c2bRegisterUrl()', () => {
    before(() => {
      nock('https://sandbox.safaricom.co.ke')
        .matchHeader('Authorization', 'Bearer accessToken')
        .post('/mpesa/c2b/v1/registerurl', {
          ValidationURL: 'http://validationurl.com',
          ConfirmationURL: 'http://confirmationurl.com',
          ResponseType: 'Completed',
          ShortCode: 123456
        })
        .reply(200, {
          ConversationID: '',
          OriginatorCoversationID: '',
          ResponseDescription: 'success'
        });

      nock('https://sandbox.safaricom.co.ke')
        .matchHeader('Authorization', 'Bearer accessToken')
        .post('/mpesa/c2b/v1/registerurl', {
          ValidationURL: 'http://validationurl.com',
          ConfirmationURL: 'http://confirmationurl.com',
          ResponseType: 'Incorrect',
          ShortCode: 123456
        })
        .reply(400);
    });

    it('should resolve to an object containing the \'ResponseDescription\' property', () =>
      expect(
        api.c2bRegisterUrl(
          'sandbox',
          'accessToken',
          'http://validationurl.com',
          'http://confirmationurl.com',
          'Completed',
          123456
        )
      ).to.eventually.deep.equal({
        ConversationID: '',
        OriginatorCoversationID: '',
        ResponseDescription: 'success'
      }));

    it('should throw an error if the parameters are incorrect', () =>
      expect(
        api.c2bRegisterUrl(
          'sandbox',
          'accessToken',
          'http://validationurl.com',
          'http://confirmationurl.com',
          'Incorrect',
          123456
        )
      ).to.eventually.be.rejected);
  });

  describe('c2bSimulateTransaction()', () => {
    before(() => {
      nock('https://sandbox.safaricom.co.ke')
        .matchHeader('Authorization', 'Bearer accessToken')
        .post('/mpesa/c2b/v1/simulate', {
          CommandID: 'CustomerPayBillOnline',
          Amount: 100,
          Msisdn: 254712345678,
          BillRefNumber: 'BillRef',
          ShortCode: 123456
        })
        .reply(200, {
          ConversationID: 'conversationId',
          OriginatorCoversationID: 'originatorConversationId',
          ResponseDescription: 'Accept the service request successfully.'
        });

      nock('https://sandbox.safaricom.co.ke')
        .matchHeader('Authorization', 'Bearer accessToken')
        .post('/mpesa/c2b/v1/simulate', {
          CommandID: 'Invalid Command ID',
          Amount: 100,
          Msisdn: 254712345678,
          BillRefNumber: 'BillRef',
          ShortCode: 123456
        })
        .reply(400);
    });

    it('should resolve to an object containing the \'ResponseDescription\' property', () =>
      expect(
        api.c2bSimulateTransaction(
          'accessToken',
          'CustomerPayBillOnline',
          100,
          254712345678,
          'BillRef',
          123456
        )
      ).to.eventually.deep.equal({
        ConversationID: 'conversationId',
        OriginatorCoversationID: 'originatorConversationId',
        ResponseDescription: 'Accept the service request successfully.'
      }));

    it('should throw an error if the parameters are incorrect', () =>
      expect(
        api.c2bSimulateTransaction(
          'accessToken',
          'Invalid Command ID',
          100,
          254712345678,
          'BillRef',
          123456
        )
      ).to.eventually.be.rejected);
  });

  describe('b2cPaymentRequest()', () => {
    before(() => {
      nock('https://sandbox.safaricom.co.ke')
        .matchHeader('Authorization', 'Bearer accessToken')
        .post('/mpesa/b2c/v1/paymentrequest', {
          InitiatorName: 'initiator',
          SecurityCredential: 'credential',
          CommandID: 'BusinessPayment',
          Amount: 100,
          PartyA: 123456,
          PartyB: 254712345678,
          Remarks: 'remarks',
          QueueTimeOutURL: 'http://timeouturl.com',
          ResultURL: 'http://resulturl.com',
          Occassion: 'occassion'
        })
        .reply(200, {
          ConversationID: 'conversationId',
          OriginatorConversationID: 'originatorConversationId',
          ResponseCode: '0',
          ResponseDescription: 'Accept the service request successfully.'
        });

      nock('https://sandbox.safaricom.co.ke')
        .matchHeader('Authorization', 'Bearer accessToken')
        .post('/mpesa/b2c/v1/paymentrequest', {
          InitiatorName: 'initiator',
          SecurityCredential: 'credential',
          CommandID: 'Invalid CommandID',
          Amount: 100,
          PartyA: 123456,
          PartyB: 254712345678,
          Remarks: 'remarks',
          QueueTimeOutURL: 'http://timeouturl.com',
          ResultURL: 'http://resulturl.com',
          Occassion: 'occassion'
        })
        .reply(400);
    });

    it('should resolve to an object containing the \'ResponseDescription\' property', () =>
      expect(
        api.b2cPaymentRequest(
          'sandbox',
          'accessToken',
          'initiator',
          'credential',
          'BusinessPayment',
          100,
          123456,
          254712345678,
          'remarks',
          'http://timeouturl.com',
          'http://resulturl.com',
          'occassion'
        )
      ).to.eventually.deep.equal({
        ConversationID: 'conversationId',
        OriginatorConversationID: 'originatorConversationId',
        ResponseCode: '0',
        ResponseDescription: 'Accept the service request successfully.'
      }));

    it('should throw an error if the parameters are incorrect', () =>
      expect(
        api.b2cPaymentRequest(
          'sandbox',
          'accessToken',
          'initiator',
          'credential',
          'Invalid CommandID',
          100,
          123456,
          254712345678,
          'remarks',
          'http://timeouturl.com',
          'http://resulturl.com',
          'occassion'
        )
      ).to.eventually.be.rejected);
  });

  describe('accountBalanceRequest()', () => {
    before(() => {
      nock('https://sandbox.safaricom.co.ke')
        .matchHeader('Authorization', 'Bearer accessToken')
        .post('/mpesa/accountbalance/v1/query', {
          CommandID: 'AccountBalance',
          PartyA: 123456,
          IdentifierType: 4,
          Remarks: 'remarks',
          Initiator: 'initiator',
          SecurityCredential: 'credential',
          QueueTimeOutURL: 'http://timeouturl.com',
          ResultURL: 'http://resulturl.com'
        })
        .reply(200, {
          OriginatorConversationID: 'originatorConversationId',
          ConversationID: 'conversationId',
          ResponseCode: '0',
          ResponseDescription: 'Accept the service request successfully.'
        });

      nock('https://sandbox.safaricom.co.ke')
        .matchHeader('Authorization', 'Bearer accessToken')
        .post('/mpesa/accountbalance/v1/query', {
          CommandID: 'Invalid Command ID',
          PartyA: 123456,
          IdentifierType: 4,
          Remarks: 'remarks',
          Initiator: 'initiator',
          SecurityCredential: 'credential',
          QueueTimeOutURL: 'http://timeouturl.com',
          ResultURL: 'http://resulturl.com'
        })
        .reply(400);
    });

    it('should resolve to an object containing the \'ResponseDescription\' property', () =>
      expect(
        api.accountBalanceRequest(
          'sandbox',
          'accessToken',
          'AccountBalance',
          123456,
          4,
          'remarks',
          'initiator',
          'credential',
          'http://timeouturl.com',
          'http://resulturl.com'
        )
      ).to.eventually.deep.equal({
        OriginatorConversationID: 'originatorConversationId',
        ConversationID: 'conversationId',
        ResponseCode: '0',
        ResponseDescription: 'Accept the service request successfully.'
      }));

    it('should throw an error if the parameters are incorrect', () =>
      expect(
        api.accountBalanceRequest(
          'sandbox',
          'accessToken',
          'Invalid Command ID',
          123456,
          4,
          'remarks',
          'initiator',
          'credential',
          'http://timeouturl.com',
          'http://resulturl.com'
        )
      ).to.eventually.be.rejected);
  });

  describe('transactionStatusRequest()', () => {
    before(() => {
      nock('https://sandbox.safaricom.co.ke')
        .matchHeader('Authorization', 'Bearer accessToken')
        .post('/mpesa/transactionstatus/v1/query', {
          CommandID: 'TransactionStatusQuery',
          PartyA: 123456,
          IdentifierType: 4,
          Remarks: 'remarks',
          Initiator: 'initiator',
          SecurityCredential: 'credential',
          QueueTimeOutURL: 'http://timeouturl.com',
          ResultURL: 'http://resulturl.com',
          TransactionID: 'MX00000000',
          Occasion: 'occassion'
        })
        .reply(200, {
          OriginatorConversationID: 'originatorConversationId',
          ConversationID: 'conversationId',
          ResponseCode: '0',
          ResponseDescription: 'Accept the service request successfully.'
        });

      nock('https://sandbox.safaricom.co.ke')
        .matchHeader('Authorization', 'Bearer accessToken')
        .post('/mpesa/transactionstatus/v1/query', {
          CommandID: 'Invalid Command ID',
          PartyA: 123456,
          IdentifierType: 4,
          Remarks: 'remarks',
          Initiator: 'initiator',
          SecurityCredential: 'credential',
          QueueTimeOutURL: 'http://timeouturl.com',
          ResultURL: 'http://resulturl.com',
          TransactionID: 'MX00000000',
          Occasion: 'occassion'
        })
        .reply(400);
    });

    it('should resolve to an object containing the \'ResponseDescription\' property', () =>
      expect(
        api.transactionStatusRequest(
          'sandbox',
          'accessToken',
          'TransactionStatusQuery',
          123456,
          4,
          'remarks',
          'initiator',
          'credential',
          'http://timeouturl.com',
          'http://resulturl.com',
          'MX00000000',
          'occassion'
        )
      ).to.eventually.deep.equal({
        OriginatorConversationID: 'originatorConversationId',
        ConversationID: 'conversationId',
        ResponseCode: '0',
        ResponseDescription: 'Accept the service request successfully.'
      }));

    it('should throw an error if the parameters are incorrect', () =>
      expect(
        api.transactionStatusRequest(
          'sandbox',
          'accessToken',
          'TransactionStatusQuery',
          123456,
          4,
          'remarks',
          'initiator',
          'credential',
          'http://timeouturl.com',
          'http://resulturl.com',
          'MX00000000',
          'occassion'
        )
      ).to.eventually.be.rejected);
  });

  describe('reversalRequest()', () => {
    before(() => {
      nock('https://sandbox.safaricom.co.ke')
        .matchHeader('Authorization', 'Bearer accessToken')
        .post('/mpesa/reversal/v1/request', {
          CommandID: 'TransactionReversal',
          ReceiverParty: 123456,
          ReceiverIdentifierType: 11,
          Remarks: 'remarks',
          Initiator: 'initiator',
          SecurityCredential: 'credential',
          QueueTimeOutURL: 'http://timeouturl.com',
          ResultURL: 'http://resulturl.com',
          TransactionID: 'MX00000000',
          Occasion: 'occassion'
        })
        .reply(200, {
          OriginatorConversationID: 'originatorConversationId',
          ConversationID: 'conversationId',
          ResponseCode: '0',
          ResponseDescription: 'Accept the service request successfully.'
        });

      nock('https://sandbox.safaricom.co.ke')
        .matchHeader('Authorization', 'Bearer accessToken')
        .post('/mpesa/reversal/v1/request', {
          CommandID: 'Invalid Command ID',
          ReceiverParty: 123456,
          ReceiverIdentifierType: 11,
          Remarks: 'remarks',
          Initiator: 'initiator',
          SecurityCredential: 'credential',
          QueueTimeOutURL: 'http://timeouturl.com',
          ResultURL: 'http://resulturl.com',
          TransactionID: 'MX00000000',
          Occasion: 'occassion'
        })
        .reply(400);
    });

    it('should resolve to an object containing the \'ResponseDescription\' property', () =>
      expect(
        api.reversalRequest(
          'sandbox',
          'accessToken',
          'TransactionReversal',
          123456,
          11,
          'remarks',
          'initiator',
          'credential',
          'http://timeouturl.com',
          'http://resulturl.com',
          'MX00000000',
          'occassion'
        )
      ).to.eventually.deep.equal({
        OriginatorConversationID: 'originatorConversationId',
        ConversationID: 'conversationId',
        ResponseCode: '0',
        ResponseDescription: 'Accept the service request successfully.'
      }));

    it('should throw an error if the parameters are incorrect', () =>
      expect(
        api.reversalRequest(
          'sandbox',
          'accessToken',
          'Invalid Command ID',
          123456,
          11,
          'remarks',
          'initiator',
          'credential',
          'http://timeouturl.com',
          'http://resulturl.com',
          'MX00000000',
          'occassion'
        )
      ).to.eventually.be.rejected);
  });
});
