const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const moment = require('moment');
const sinon = require('sinon');

const logic = require('../dist/lib/logic');
const { Mpesa } = require('../dist');

chai.use(chaiAsPromised);
const { expect } = chai;

describe('Mpesa', () => {
  let mpesa;

  beforeEach(() => {
    sinon.replace(
      logic,
      'generateToken',
      sinon.fake.resolves({
        accessToken: 'accessToken',
        expiryDate: moment()
      })
    );
    mpesa = new Mpesa(123456, 'consumerKey', 'consumerSecret');
  });

  describe('mpesaExpressRequest()', () => {
    afterEach(() => {
      sinon.restore();
    });

    it('should return a successful response', () => {
      sinon.replace(
        logic,
        'mpesaExpressRequest',
        sinon.fake.resolves({
          merchantRequestId: 'merchantRequestId',
          checkoutRequestId: 'checkoutRequestId'
        })
      );
      return expect(
        mpesa.mpesaExpressRequest(
          100,
          254712345678,
          123456,
          'passkey',
          'CustomerPayBillOnline',
          'reference',
          'description',
          'http://callbackurl.com'
        )
      ).to.eventually.deep.equal({
        merchantRequestId: 'merchantRequestId',
        checkoutRequestId: 'checkoutRequestId'
      });
    });

    it('should throw an error if parameters are invalid', () => {
      sinon.replace(
        logic,
        'mpesaExpressRequest',
        sinon.fake.rejects('Bad Request')
      );
      return expect(
        mpesa.mpesaExpressRequest(
          100,
          254712345678,
          123456,
          'passkey',
          'CustomerPayBillOnline',
          'reference',
          'description',
          'http://callbackurl.com'
        )
      ).to.eventually.be.rejectedWith('Bad Request');
    });
  });

  describe('mpesaExpressQuery()', () => {
    afterEach(() => {
      sinon.restore();
    });

    it('should return a successful response', () => {
      sinon.replace(
        logic,
        'mpesaExpressQuery',
        sinon.fake.resolves({
          resultCode: '1032',
          resultDescription: '[STK_CB - ]Request cancelled by user'
        })
      );
      return expect(mpesa.mpesaExpressQuery()).to.eventually.deep.equal({
        resultCode: '1032',
        resultDescription: '[STK_CB - ]Request cancelled by user'
      });
    });

    it('should throw an error if parameters are invalid', () => {
      sinon.replace(
        logic,
        'mpesaExpressQuery',
        sinon.fake.rejects('Bad Request')
      );
      return expect(mpesa.mpesaExpressQuery()).to.eventually.be.rejectedWith(
        'Bad Request'
      );
    });
  });

  describe('c2bRegisterUrl()', () => {
    afterEach(() => {
      sinon.restore();
    });

    it('should return a successful response', () => {
      sinon.replace(
        logic,
        'c2bRegisterUrl',
        sinon.fake.resolves({ responseDescription: 'success' })
      );
      return expect(
        mpesa.c2bRegisterUrl(
          'http://validationurl.com',
          'http://confirmationurl.com',
          'Completed'
        )
      ).to.eventually.deep.equal({
        responseDescription: 'success'
      });
    });

    it('should throw an error if parameters are invalid', () => {
      sinon.replace(logic, 'c2bRegisterUrl', sinon.fake.rejects('Bad Request'));
      return expect(
        mpesa.c2bRegisterUrl(
          'http://validationurl.com',
          'http://confirmationurl.com',
          'Completed'
        )
      ).to.eventually.be.rejectedWith('Bad Request');
    });
  });

  describe('c2bSimulateTransaction()', () => {
    afterEach(() => {
      sinon.restore();
    });

    it('should return a successful response', () => {
      sinon.replace(
        logic,
        'c2bSimulateTransaction',
        sinon.fake.resolves({
          conversationId: 'conversationId',
          originatorConversationId: 'originatorConversationId',
          responseDescription: 'Accept the service request successfully.'
        })
      );
      return expect(
        mpesa.c2bSimulateTransaction(100, 254712345678, 'billRef')
      ).to.eventually.deep.equal({
        conversationId: 'conversationId',
        originatorConversationId: 'originatorConversationId',
        responseDescription: 'Accept the service request successfully.'
      });
    });

    it('should throw an error if parameters are invalid', () => {
      sinon.replace(
        logic,
        'c2bSimulateTransaction',
        sinon.fake.rejects('Bad Request')
      );
      return expect(
        mpesa.c2bSimulateTransaction(100, 254712345678, 'billRef')
      ).to.eventually.be.rejectedWith('Bad Request');
    });
  });

  describe('b2cPaymentRequest()', () => {
    afterEach(() => {
      sinon.restore();
    });

    it('should return a successful response', () => {
      sinon.replace(
        logic,
        'b2cPaymentRequest',
        sinon.fake.resolves({
          conversationId: 'conversationId',
          originatorConversationId: 'originatorConversationId',
          responseDescription: 'Accept the service request successfully.'
        })
      );
      return expect(
        mpesa.b2cPaymentRequest(100, 254712345678, 'billRef')
      ).to.eventually.deep.equal({
        conversationId: 'conversationId',
        originatorConversationId: 'originatorConversationId',
        responseDescription: 'Accept the service request successfully.'
      });
    });

    it('should throw an error if parameters are invalid', () => {
      sinon.replace(
        logic,
        'b2cPaymentRequest',
        sinon.fake.rejects('Bad Request')
      );
      return expect(
        mpesa.b2cPaymentRequest(100, 254712345678, 'billRef')
      ).to.eventually.be.rejectedWith('Bad Request');
    });
  });

  describe('accountBalanceRequest()', () => {
    afterEach(() => {
      sinon.restore();
    });

    it('should return a successful response', () => {
      sinon.replace(
        logic,
        'accountBalanceRequest',
        sinon.fake.resolves({
          conversationId: 'conversationId',
          originatorConversationId: 'originatorConversationId',
          responseDescription: 'Accept the service request successfully.'
        })
      );
      return expect(
        mpesa.accountBalanceRequest(100, 254712345678, 'billRef')
      ).to.eventually.deep.equal({
        conversationId: 'conversationId',
        originatorConversationId: 'originatorConversationId',
        responseDescription: 'Accept the service request successfully.'
      });
    });

    it('should throw an error if parameters are invalid', () => {
      sinon.replace(
        logic,
        'accountBalanceRequest',
        sinon.fake.rejects('Bad Request')
      );
      return expect(
        mpesa.accountBalanceRequest(100, 254712345678, 'billRef')
      ).to.eventually.be.rejectedWith('Bad Request');
    });
  });

  describe('transactionStatusRequest()', () => {
    afterEach(() => {
      sinon.restore();
    });

    it('should return a successful response', () => {
      sinon.replace(
        logic,
        'transactionStatusRequest',
        sinon.fake.resolves({
          conversationId: 'conversationId',
          originatorConversationId: 'originatorConversationId',
          responseDescription: 'Accept the service request successfully.'
        })
      );
      return expect(
        mpesa.transactionStatusRequest(
          'transactionId',
          4,
          'initiatorName',
          'initiatorPassword',
          'remarks',
          'occassion',
          'http://resulturl.com',
          'http://timeouturl.com'
        )
      ).to.eventually.deep.equal({
        conversationId: 'conversationId',
        originatorConversationId: 'originatorConversationId',
        responseDescription: 'Accept the service request successfully.'
      });
    });

    it('should throw an error if parameters are invalid', () => {
      sinon.replace(
        logic,
        'transactionStatusRequest',
        sinon.fake.rejects('Bad Request')
      );
      return expect(
        mpesa.transactionStatusRequest(
          'transactionId',
          4,
          'initiatorName',
          'initiatorPassword',
          'remarks',
          'occassion',
          'http://resulturl.com',
          'http://timeouturl.com'
        )
      ).to.eventually.be.rejectedWith('Bad Request');
    });
  });

  describe('reversalRequest()', () => {
    afterEach(() => {
      sinon.restore();
    });

    it('should return a successful response', () => {
      sinon.replace(
        logic,
        'reversalRequest',
        sinon.fake.resolves({
          conversationId: 'conversationId',
          originatorConversationId: 'originatorConversationId',
          responseDescription: 'Accept the service request successfully.'
        })
      );
      return expect(
        mpesa.reversalRequest(
          'transactionId',
          'initiatorName',
          'initiatorPassword',
          'remarks',
          'occassion',
          'http://resulturl.com',
          'http://timeouturl.com'
        )
      ).to.eventually.deep.equal({
        conversationId: 'conversationId',
        originatorConversationId: 'originatorConversationId',
        responseDescription: 'Accept the service request successfully.'
      });
    });

    it('should throw an error if parameters are invalid', () => {
      sinon.replace(
        logic,
        'reversalRequest',
        sinon.fake.rejects('Bad Request')
      );
      return expect(
        mpesa.reversalRequest(
          'transactionId',
          'initiatorName',
          'initiatorPassword',
          'remarks',
          'occassion',
          'http://resulturl.com',
          'http://timeouturl.com'
        )
      ).to.eventually.be.rejectedWith('Bad Request');
    });
  });
});
