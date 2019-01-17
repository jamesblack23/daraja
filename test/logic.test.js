const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const moment = require('moment');

const api = require('../dist/lib/api');
const logic = require('../dist/lib/logic');

chai.use(chaiAsPromised);
const { expect } = chai;

describe('Logic', () => {
  describe('generateToken()', () => {
    afterEach(() => {
      sinon.restore();
    });

    it('should return an object containing the access token and expiry date', () => {
      sinon.replace(
        api,
        'generateToken',
        sinon.fake.resolves({ access_token: 'accessToken', expires_in: '3599' })
      );
      return expect(
        logic.generateToken(
          'sandbox',
          'consumerKey',
          'consumerSecret',
          'accessToken',
          moment()
        )
      ).to.eventually.have.property('accessToken', 'accessToken');
    });

    it('should return the same accessToken if expiry date is not yet', () => {
      sinon.replace(
        api,
        'generateToken',
        sinon.fake.resolves({ access_token: 'accessToken', expires_in: '3599' })
      );
      return expect(
        logic.generateToken(
          'sandbox',
          'consumerKey',
          'consumerSecret',
          'originalAccessToken',
          moment().add(30, 'minutes')
        )
      ).to.eventually.have.property('accessToken', 'originalAccessToken');
    });

    it('should throw an error if the parameters are incorrect', () => {
      sinon.replace(api, 'generateToken', sinon.fake.rejects('Bad Request'));
      return expect(
        logic.generateToken(
          'sandbox',
          'invalidKey',
          'invalidSecret',
          'accessToken',
          moment()
        )
      ).to.eventually.be.rejectedWith('Bad Request');
    });
  });

  describe('mpesaExpressRequest()', () => {
    afterEach(() => {
      sinon.restore();
    });

    it('should return an object containing \'merchantRequestId\' and \'checkoutRequestId\' properties', () => {
      sinon.replace(
        api,
        'mpesaExpressRequest',
        sinon.fake.resolves({
          MerchantRequestID: 'merchantRequestId',
          CheckoutRequestID: 'checkoutRequestId',
          ResponseCode: '0',
          ResponseDescription: 'Success. Request accepted for processing',
          CustomerMessage: 'Success. Request accepted for processing'
        })
      );
      return expect(
        logic.mpesaExpressRequest(
          'sandbox',
          'accessToken',
          123456,
          'passkey',
          'CustomerPayBillOnline',
          100,
          254712345678,
          123456,
          'http://callbackurl.com',
          'accref',
          'transdesc'
        )
      ).to.eventually.deep.equal({
        merchantRequestId: 'merchantRequestId',
        checkoutRequestId: 'checkoutRequestId'
      });
    });

    it('should throw an error if the parameters are incorrect', () => {
      sinon.replace(
        api,
        'mpesaExpressRequest',
        sinon.fake.rejects('Bad Request')
      );
      return expect(
        logic.mpesaExpressRequest(
          'sandbox',
          'accessToken',
          123456,
          'passkey',
          'CustomerPayBillOnline',
          100,
          254712345678,
          123456,
          'http://callbackurl.com',
          'accref',
          'transdesc'
        )
      ).to.eventually.be.rejectedWith('Bad Request');
    });
  });

  describe('mpesaExpressQuery()', () => {
    afterEach(() => {
      sinon.restore();
    });

    it('should return an object containing \'resultCode\' and \'resultDescription\' properties', () => {
      sinon.replace(
        api,
        'mpesaExpressQuery',
        sinon.fake.resolves({
          ResponseCode: '0',
          ResponseDescription:
            'The service request has been accepted successsfully',
          MerchantRequestID: 'merchantRequestId',
          CheckoutRequestID: 'checkoutRequestId',
          ResultCode: '1032',
          ResultDesc: '[STK_CB - ]Request cancelled by user'
        })
      );
      return expect(
        logic.mpesaExpressQuery(
          'sandbox',
          'accessToken',
          123456,
          'passkey',
          'checkoutRequestId'
        )
      ).to.eventually.deep.equal({
        resultCode: '1032',
        resultDescription: '[STK_CB - ]Request cancelled by user'
      });
    });

    it('should throw an error if the parameters are incorrect', () => {
      sinon.replace(
        api,
        'mpesaExpressQuery',
        sinon.fake.rejects('Bad Request')
      );
      return expect(
        logic.mpesaExpressQuery(
          'sandbox',
          'accessToken',
          123456,
          'passkey',
          'checkoutRequestId'
        )
      ).to.eventually.be.rejectedWith('Bad Request');
    });
  });

  describe('c2bRegisterUrl()', () => {
    afterEach(() => {
      sinon.restore();
    });

    it('should return an object containing \'responseDescription\' property', () => {
      sinon.replace(
        api,
        'c2bRegisterUrl',
        sinon.fake.resolves({
          ConversationID: '',
          OriginatorConversationID: '',
          ResponseDescription: 'success'
        })
      );
      return expect(
        logic.c2bRegisterUrl(
          'sandbox',
          'accessToken',
          123456,
          'validationUrl',
          'confirmationUrl',
          'Completed'
        )
      ).to.eventually.deep.equal({ responseDescription: 'success' });
    });

    it('should throw an error if the parameters are incorrect', () => {
      sinon.replace(api, 'c2bRegisterUrl', sinon.fake.rejects('Bad Request'));
      return expect(
        logic.c2bRegisterUrl(
          'sandbox',
          'accessToken',
          123456,
          'validationUrl',
          'confirmationUrl',
          'Completed'
        )
      ).to.eventually.be.rejectedWith('Bad Request');
    });
  });

  describe('c2bSimulateTransaction()', () => {
    afterEach(() => {
      sinon.restore();
    });

    it('should return an object containing \'responseDescription\' property', () => {
      sinon.replace(
        api,
        'c2bSimulateTransaction',
        sinon.fake.resolves({
          ConversationID: 'conversationId',
          OriginatorCoversationID: 'originatorConversationId',
          ResponseDescription: 'Accept the service request successfully.'
        })
      );
      return expect(
        logic.c2bSimulateTransaction(
          'sandbox',
          'accessToken',
          123456,
          254712345678,
          100,
          'BillRef'
        )
      ).to.eventually.deep.equal({
        conversationId: 'conversationId',
        originatorConversationId: 'originatorConversationId',
        responseDescription: 'Accept the service request successfully.'
      });
    });

    it('should throw an error if the parameters are incorrect', () => {
      sinon.replace(
        api,
        'c2bSimulateTransaction',
        sinon.fake.rejects('Bad Request')
      );
      return expect(
        logic.c2bSimulateTransaction(
          'sandbox',
          'accessToken',
          123456,
          100,
          254712345678,
          'BillRef'
        )
      ).to.eventually.be.rejectedWith('Bad Request');
    });

    it('should throw an error if the environment is production', () => {
      sinon.replace(
        api,
        'c2bSimulateTransaction',
        sinon.fake.resolves({
          ConversationID: 'conversationId',
          OriginatorCoversationID: 'originatorConversationId',
          ResponseDescription: 'Accept the service request successfully.'
        })
      );
      return expect(
        logic.c2bSimulateTransaction(
          'production',
          'accessToken',
          123456,
          'CustomerPayBillOnline',
          100,
          254712345678,
          'BillRef'
        )
      ).to.eventually.be.rejectedWith(
        'Cannot simulate on production environment'
      );
    });
  });

  describe('b2cPaymentRequest()', () => {
    afterEach(() => {
      sinon.restore();
    });

    it('should return an object containing \'responseDescription\' property', () => {
      sinon.replace(
        api,
        'b2cPaymentRequest',
        sinon.fake.resolves({
          ConversationID: 'conversationId',
          OriginatorConversationID: 'originatorConversationId',
          ResponseCode: '0',
          ResponseDescription: 'Accept the service request successfully.'
        })
      );
      return expect(
        logic.b2cPaymentRequest(
          'sandbox',
          'accessToken',
          123456,
          254712345678,
          100,
          'BusinessPayment',
          'initiatorName',
          'initiatorPassword',
          'remarks',
          'occassion',
          'http://timeouturl.com',
          'http://resulturl.com'
        )
      ).to.eventually.deep.equal({
        conversationId: 'conversationId',
        originatorConversationId: 'originatorConversationId',
        responseDescription: 'Accept the service request successfully.'
      });
    });

    it('should throw an error if the parameters are incorrect', () => {
      sinon.replace(
        api,
        'b2cPaymentRequest',
        sinon.fake.rejects('Bad Request')
      );
      return expect(
        logic.b2cPaymentRequest(
          'sandbox',
          'accessToken',
          123456,
          254712345678,
          100,
          'BusinessPayment',
          'initiatorName',
          'initiatorPassword',
          'remarks',
          'occassion',
          'http://timeouturl.com',
          'http://resulturl.com'
        )
      ).to.eventually.be.rejectedWith('Bad Request');
    });
  });

  describe('accountBalanceRequest()', () => {
    afterEach(() => {
      sinon.restore();
    });

    it('should return an object containing \'responseDescription\' property', () => {
      sinon.replace(
        api,
        'accountBalanceRequest',
        sinon.fake.resolves({
          OriginatorConversationID: 'originatorConversationId',
          ConversationID: 'conversationId',
          ResponseCode: '0',
          ResponseDescription: 'Accept the service request successfully.'
        })
      );
      return expect(
        logic.accountBalanceRequest(
          'sandbox',
          'accessToken',
          123456,
          4,
          'initiatorName',
          'initiatorPassword',
          'remarks',
          'http://timeouturl.com',
          'http://resulturl.com'
        )
      ).to.eventually.deep.equal({
        conversationId: 'conversationId',
        originatorConversationId: 'originatorConversationId',
        responseDescription: 'Accept the service request successfully.'
      });
    });

    it('should throw an error if the parameters are incorrect', () => {
      sinon.replace(
        api,
        'accountBalanceRequest',
        sinon.fake.rejects('Bad Request')
      );
      return expect(
        logic.accountBalanceRequest(
          'sandbox',
          'accessToken',
          123456,
          4,
          'initiatorName',
          'initiatorPassword',
          'remarks',
          'http://timeouturl.com',
          'http://resulturl.com'
        )
      ).to.eventually.be.rejectedWith('Bad Request');
    });
  });

  describe('transactionStatusRequest()', () => {
    afterEach(() => {
      sinon.restore();
    });

    it('should return an object containing \'responseDescription\' property', () => {
      sinon.replace(
        api,
        'transactionStatusRequest',
        sinon.fake.resolves({
          OriginatorConversationID: 'originatorConversationId',
          ConversationID: 'conversationId',
          ResponseCode: '0',
          ResponseDescription: 'Accept the service request successfully.'
        })
      );
      return expect(
        logic.transactionStatusRequest(
          'sandbox',
          'accessToken',
          123456,
          4,
          'initiatorName',
          'initiatorPassword',
          'transactionId',
          'remarks',
          'occassion',
          'http://timeouturl.com',
          'http://resulturl.com'
        )
      ).to.eventually.deep.equal({
        conversationId: 'conversationId',
        originatorConversationId: 'originatorConversationId',
        responseDescription: 'Accept the service request successfully.'
      });
    });

    it('should throw an error if the parameters are incorrect', () => {
      sinon.replace(
        api,
        'transactionStatusRequest',
        sinon.fake.rejects('Bad Request')
      );
      return expect(
        logic.transactionStatusRequest(
          'sandbox',
          'accessToken',
          123456,
          4,
          'initiatorName',
          'initiatorPassword',
          'transactionId',
          'remarks',
          'occassion',
          'http://timeouturl.com',
          'http://resulturl.com'
        )
      ).to.eventually.be.rejectedWith('Bad Request');
    });
  });

  describe('reversalRequest()', () => {
    afterEach(() => {
      sinon.restore();
    });

    it('should return an object containing \'responseDescription\' property', () => {
      sinon.replace(
        api,
        'reversalRequest',
        sinon.fake.resolves({
          OriginatorConversationID: 'originatorConversationId',
          ConversationID: 'conversationId',
          ResponseCode: '0',
          ResponseDescription: 'Accept the service request successfully.'
        })
      );
      return expect(
        logic.reversalRequest(
          'sandbox',
          'accessToken',
          123456,
          'initiatorName',
          'initiatorPassword',
          'transactionId',
          'remarks',
          'occassion',
          'http://timeouturl.com',
          'http://resulturl.com'
        )
      ).to.eventually.deep.equal({
        conversationId: 'conversationId',
        originatorConversationId: 'originatorConversationId',
        responseDescription: 'Accept the service request successfully.'
      });
    });

    it('should throw an error if the parameters are incorrect', () => {
      sinon.replace(api, 'reversalRequest', sinon.fake.rejects('Bad Request'));
      return expect(
        logic.reversalRequest(
          'sandbox',
          'accessToken',
          123456,
          'initiatorName',
          'initiatorPassword',
          'transactionId',
          'remarks',
          'occassion',
          'http://timeouturl.com',
          'http://resulturl.com'
        )
      ).to.eventually.be.rejectedWith('Bad Request');
    });
  });
});
