import { Test } from '@nestjs/testing';
import {
  CryptoModule,
  KeyPair,
  TonClient,
  ResultOfSign,
  ResultOfVerifySignature,
  ResultOfProcessMessage,
  ResultOfRunExecutor,
} from '@tonclient/core';
import { Account } from '@tonclient/appkit';

import { EverscaleClientDidManagementService } from './everscale-client.did-management.service';
import { EverscaleAvailableContracts } from '../types/everscale.types';

const everscaleContractConfig = {
  defaultNetwork: 'mainnet',
  networks: {
    mainnet: ['https://some-url'],
  },
  contracts: {
    [EverscaleAvailableContracts.safeMultisig]: {
      address: 'some-address',
      signerKeys: {
        public: 'public',
        secret: 'secret',
      },
    },
  },
};

describe('EverscaleClientDidManagementService', () => {
  let service: EverscaleClientDidManagementService;
  let cryptoMock: CryptoModule;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [],
      providers: [EverscaleClientDidManagementService],
    }).compile();

    service = module.get<EverscaleClientDidManagementService>(EverscaleClientDidManagementService);
    service.init({ everscaleClientConfig: everscaleContractConfig });

    jest.clearAllMocks();
  });

  describe('services', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });
  });

  describe('cryptography', () => {
    it('check generateKeys()', async () => {
      cryptoMock = {} as CryptoModule;
      cryptoMock.generate_random_sign_keys = async (): Promise<KeyPair> => {
        return new Promise<KeyPair>((resolve) =>
          resolve({ public: 'public', secret: 'secret' } as KeyPair),
        );
      };

      const cryptoGenerateRandomSignKeysSpy = jest.spyOn(cryptoMock, 'generate_random_sign_keys');

      const tonClientMock = { crypto: cryptoMock } as TonClient;

      service.init({ tonClient: tonClientMock });

      const keys = await service.generateKeys();

      expect(cryptoGenerateRandomSignKeysSpy).toBeCalled();
      expect(keys).toBeDefined();
    });

    it('check signMessage()', async () => {
      cryptoMock = {} as CryptoModule;
      cryptoMock.sign = async (): Promise<ResultOfSign> => {
        return new Promise((resolve) => resolve({ signed: 'signed', signature: 'secret' }));
      };

      const cryptoSignSpy = jest.spyOn(cryptoMock, 'sign');

      const tonClientMock = { crypto: cryptoMock } as TonClient;

      service.init({ tonClient: tonClientMock });

      const { signed, signature } = await service.signMessage({
        message: 'text',
        keys: { public: 'public', secret: 'secret' },
      });

      expect(cryptoSignSpy).toBeCalled();
      expect(signed).toBeDefined();
      expect(signature).toBeDefined();
    });

    it('check verifySignature() => fail', async () => {
      cryptoMock = {} as CryptoModule;
      cryptoMock.verify_signature = async (): Promise<ResultOfVerifySignature> => {
        return new Promise<ResultOfVerifySignature>((resolve) =>
          resolve({ unsigned: 'wrong signature unsigned' } as ResultOfVerifySignature),
        );
      };

      const cryptoVerifySignatureSpy = jest.spyOn(cryptoMock, 'verify_signature');

      const tonClientMock = { crypto: cryptoMock } as TonClient;

      service.init({ tonClient: tonClientMock });

      const result = await service.verifySignature({
        signed: 'signed_message',
        message: 'text',
        publicKey: 'public',
      });

      expect(cryptoVerifySignatureSpy).toBeCalled();
      expect(result).toBeFalsy();
    });

    it('check verifySignature() => success', async () => {
      const message = 'some text';
      const text2base64Message = Buffer.from(message, 'utf8').toString('base64');

      cryptoMock = {} as CryptoModule;
      cryptoMock.verify_signature = async (): Promise<ResultOfVerifySignature> => {
        return new Promise<ResultOfVerifySignature>((resolve) =>
          resolve({ unsigned: text2base64Message } as ResultOfVerifySignature),
        );
      };

      const cryptoVerifySignatureSpy = jest.spyOn(cryptoMock, 'verify_signature');

      const tonClientMock = { crypto: cryptoMock } as TonClient;

      service.init({ tonClient: tonClientMock });

      const result = await service.verifySignature({
        signed: 'signed_message',
        message,
        publicKey: 'public',
      });

      expect(cryptoVerifySignatureSpy).toBeCalled();
      expect(result).toBeTruthy();
    });
  });

  describe('did management', () => {
    it('issueDidDocument()', async () => {
      const newDidDocumentAddress = 'some-address';
      const issueDidDocumentResult = {
        decoded: {
          output: {
            didDocAddr: newDidDocumentAddress,
          },
        },
      };

      const contractAccount = {} as Account;
      contractAccount.run = async (): Promise<ResultOfProcessMessage> => {
        return new Promise<ResultOfProcessMessage>((resolve) =>
          resolve({ ...issueDidDocumentResult } as ResultOfProcessMessage),
        );
      };
      contractAccount.free = async () => {};

      service.getContractAccount = async (): Promise<Account> => {
        return new Promise<Account>((resolve) => resolve(contractAccount));
      };

      const contractAccountRunSpy = jest.spyOn(contractAccount, 'run');
      const contractAccountFreeSpy = jest.spyOn(contractAccount, 'free');

      const result = await service.issueDidDocument('public-key');

      expect(contractAccountRunSpy).toBeCalled();
      expect(contractAccountFreeSpy).toBeCalled();
      expect(result).toBe(newDidDocumentAddress);
    });

    it('getDidDocumentPublicKey()', async () => {
      const addressPublicKey = 'some-public-key';
      const getSubjectPubKeyResult = {
        decoded: {
          output: {
            value0: addressPublicKey,
          },
        },
      };

      const contractAccount = {} as Account;
      contractAccount.runLocal = async (): Promise<ResultOfRunExecutor> => {
        return new Promise<ResultOfRunExecutor>((resolve) =>
          resolve({ ...getSubjectPubKeyResult } as ResultOfRunExecutor),
        );
      };
      contractAccount.free = async () => {};

      service.getContractAccount = async (): Promise<Account> => {
        return new Promise<Account>((resolve) => resolve(contractAccount));
      };

      const contractAccountRunLocalSpy = jest.spyOn(contractAccount, 'runLocal');
      const contractAccountFreeSpy = jest.spyOn(contractAccount, 'free');

      const result = await service.getDidDocumentPublicKey();

      expect(contractAccountRunLocalSpy).toBeCalled();
      expect(contractAccountFreeSpy).toBeCalled();
      expect(result).toBe(addressPublicKey);
    });
  });
});
