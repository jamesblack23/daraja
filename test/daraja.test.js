const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const { Daraja } = require('../dist/lib/daraja');
const { DarajaConfigError } = require('../dist/lib/errors');

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('The Daraja instance\'s', () => {
  let daraja;

  before(() => {
    daraja = new Daraja();
  });

  describe('configureLipaNaMPesa() method is called with', () => {
    describe('an invalid number of parameters', () => {
      it('should throw an error when fewer than the required arguments are passed', () => {
        expect(() => daraja.configureLipaNaMPesa('first')).to.throw(
          DarajaConfigError,
          'Expected 2 arguments but got 1'
        );
      });

      it('should throw an error when more than the required arguments are passed', () => {
        expect(() =>
          daraja.configureLipaNaMPesa('first', 'second', 'third')
        ).to.throw(DarajaConfigError, 'Expected 2 arguments but got 3');
      });
    });

    describe('a valid number of parameters', () => {
      it('should return a new Daraja instance properly configured', () => {
        const passkey = 'passkey';
        const callbackUrl = 'callbackUrl';
        expect(
          daraja.configureLipaNaMPesa(passkey, callbackUrl).config.lipaNaMPesa
        ).to.deep.equal({ passkey, callbackUrl });
      });
    });
  });
});
