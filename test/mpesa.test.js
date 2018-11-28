const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const config = require('./config');
const { Daraja } = require('../dist/lib/daraja');
const {
  DarajaAPIError,
  DarajaConfigError,
  MPesaExpressError
} = require('../dist/lib/errors');

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('MPesa', function() {
  this.timeout(0);

  describe('generateToken()', () => {
    const darajaValid = new Daraja(
      config.shortcode,
      config.consumerKey,
      config.consumerSecret
    ).build();
    const darajaInvalid = new Daraja(
      12345,
      'invalidKey',
      'invalidSecret'
    ).build();

    it('should throw an error when credentials are invalid', () =>
      expect(darajaInvalid.generateToken()).to.eventually.be.rejectedWith(
        DarajaAPIError,
        'Bad Request: Invalid Credentials'
      ));

    it('should return a string when credentials are valid', () =>
      expect(darajaValid.generateToken()).to.eventually.be.a('string'));

    describe('and', () => {
      let token = darajaValid.accessToken;

      it('should return the same token if it has not expired', () => {
        token = darajaValid.accessToken;
        return expect(darajaValid.generateToken()).to.eventually.equal(token);
      });

      describe('but', () => {
        it('should return a different token if it has expired', () => {
          darajaValid.tokenExpiry = darajaValid.tokenExpiry.subtract(1, 'hour');
          return expect(darajaValid.generateToken()).to.not.eventually.equal(
            token
          );
        });
      });
    });
  });

  describe('MPesaExpressRequest()', () => {
    let mpesa;

    before(() => {
      mpesa = new Daraja(
        config.mPesaExpress.shortcode,
        config.consumerKey,
        config.consumerSecret
      )
        .configureMPesaExpress(
          config.mPesaExpress.passkey,
          config.mPesaExpress.callbackUrl
        )
        .build();
    });

    it('should throw an error when fewer than the required arguments are passed', () =>
      expect(mpesa.mPesaExpressRequest()).to.eventually.be.rejectedWith(
        MPesaExpressError,
        'Expected 6 arguments but got 0'
      ));

    it('should throw an error when more than the required arguments are passed', () =>
      expect(
        mpesa.mPesaExpressRequest(
          1,
          config.mPesaExpress.msisdn,
          config.mPesaExpress.shortcode,
          'CustomerPayBillOnline',
          'TEST REF',
          'TEST DESC',
          'extra argument'
        )
      ).to.eventually.be.rejectedWith(
        MPesaExpressError,
        'Expected 6 arguments but got 7'
      ));
    it('should throw an error when mPesaExpress is not configured', () =>
      expect(
        new Daraja(
          config.mPesaExpress.shortcode,
          config.consumerKey,
          config.consumerSecret
        )
          .build()
          .mPesaExpressRequest(
            1,
            config.mPesaExpress.msisdn,
            config.mPesaExpress.shortcode,
            'CustomerPayBillOnline',
            'TEST REF',
            'TEST DESC'
          )
      ).to.eventually.be.rejectedWith(
        DarajaConfigError,
        'Missing mPesaExpress configuration'
      ));

    it('should throw an error when invalid arguments are passed', () =>
      expect(
        mpesa.mPesaExpressRequest(
          undefined,
          config.mPesaExpress.msisdn,
          config.mPesaExpress.shortcode,
          'CustomerPayBillOnline',
          'TEST REF',
          'TEST DESC'
        )
      ).to.eventually.be.rejectedWith(DarajaAPIError));

    it('should return a string when the right arguments are passed', () =>
      expect(
        mpesa.mPesaExpressRequest(
          1,
          config.mPesaExpress.msisdn,
          config.mPesaExpress.shortcode,
          'CustomerPayBillOnline',
          'TEST REF',
          'TEST DESC'
        )
      ).to.eventually.be.a('string'));
  });
});
