const chai = require('chai');
const { Daraja } = require('../dist/lib/daraja');
const { DarajaConfigError } = require('../dist/lib/errors');

const expect = chai.expect;

describe('Daraja', () => {
  let daraja;

  beforeEach(() => {
    daraja = new Daraja();
  });

  describe('configureLipaNaMPesa()', () => {
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

    it('should return a new Daraja instance properly configured', () => {
      const passkey = 'passkey';
      const callbackUrl = 'callbackUrl';
      expect(
        daraja.configureLipaNaMPesa(passkey, callbackUrl).config.lipaNaMPesa
      ).to.deep.equal({ passkey, callbackUrl });
    });
  });

  describe('build()', () => {
    it('should set the correct environment for the MPesa instance', () => {
      expect(daraja.build('production').config.urls).to.have.property(
        'generateToken',
        'https://api.safaricom.co.ke/oauth/v1/generate'
      );
    });
  });
});
