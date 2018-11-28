const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const config = require('./config');
const { Daraja } = require('../dist/lib/daraja');
const { MPesaAPIError } = require('../dist/lib/errors');

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('MPesa', function() {
  this.timeout(0);

  describe('generateToken()', () => {
    const darajaValid = new Daraja(
      config.consumerKey,
      config.consumerSecret
    ).build();
    const darajaInvalid = new Daraja('invalidKey', 'invalidSecret').build();

    it('should throw an error when credentials are invalid', () =>
      expect(darajaInvalid.generateToken()).to.eventually.be.rejectedWith(
        MPesaAPIError,
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
          darajaValid.tokenExpiry = darajaValid.tokenExpiry.subtract(
            1,
            'hour'
          );
          return expect(darajaValid.generateToken()).to.not.eventually.equal(
            token
          );
        });
      });
    });
  });
});
