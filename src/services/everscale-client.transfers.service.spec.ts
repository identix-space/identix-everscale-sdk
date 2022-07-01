import { Test } from '@nestjs/testing';
import {
  AbiModule,
  ResultOfEncodeMessageBody,
  ResultOfProcessMessage,
  TonClient,
} from '@tonclient/core';
import { Account } from '@tonclient/appkit';

import {
  EverscaleAvailableContracts,
  EverscaleClientConfiguration,
} from '../types/everscale.types';
import { EverscaleClientTransfersService } from './everscale-client.transfers.service';

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

jest.mock('../helpers/files.helpers', () => {
  const originalFilesHelper = jest.requireActual('../helpers/files.helpers');

  return {
    __esModule: true,
    ...originalFilesHelper,
    readFileAsBase64: jest.fn(() => '{"abi": "mocked readFileAsBase64"}'),
  };
});

describe('EverscaleClientTransfersService', () => {
  let service: EverscaleClientTransfersService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [],
      providers: [ EverscaleClientTransfersService ],
    }).compile();

    service = module.get<EverscaleClientTransfersService>(EverscaleClientTransfersService);
    service.init({ everscaleClientConfig: everscaleContractConfig });

    jest.clearAllMocks();
  });

  describe('services', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });
  });

  describe('transfers EVERs', () => {
    it('transfer() => success', async () => {
      const transactionHash = 'transaction-hash';
      const transactionResult = {
        transaction: {
          id: transactionHash,
        },
      };

      const contractAccount = {} as Account;
      contractAccount.run = async (): Promise<ResultOfProcessMessage> => {
        return new Promise<ResultOfProcessMessage>((resolve) =>
          resolve({ ...transactionResult } as ResultOfProcessMessage),
        );
      };

      service.getContractAccount = async (): Promise<Account> => {
        return new Promise<Account>((resolve) => resolve(contractAccount));
      };

      const contractAccountRunSpy = jest.spyOn(contractAccount, 'run');

      const result = await service.transfer('recipient-address', 5);

      expect(contractAccountRunSpy).toBeCalled();
      expect(result.transactionHash).toBe(transactionHash);
    });

    it('transfer() => fail', async () => {
      const wrongTransactionResult = {
        transaction: undefined,
      };

      const contractAccount = {} as Account;
      contractAccount.run = async (): Promise<ResultOfProcessMessage> => {
        return new Promise<ResultOfProcessMessage>((resolve) =>
          resolve({ ...wrongTransactionResult } as ResultOfProcessMessage),
        );
      };

      service.getContractAccount = async (): Promise<Account> => {
        return new Promise<Account>((resolve) => resolve(contractAccount));
      };

      const contractAccountRunSpy = jest.spyOn(contractAccount, 'run');

      try {
        await service.transfer('recipient-address', 5);
        expect(true).toBeFalsy(); // should not processed
      } catch (e) {
        expect(contractAccountRunSpy).toBeCalled();
        expect(e.message).toMatch('Everscale transfer EVER error');
      }
    });
  });

  describe('transfers Tip3 tokens', () => {
    it('transferTip3Tokens() => success', async () => {
      const token = 'some-token';
      const everscaleTip3ContractConfig = {
        ...everscaleContractConfig,
        tokens: {
          [token]: 'some-token-address',
        },
      } as EverscaleClientConfiguration;

      const abiMock = {} as AbiModule;
      abiMock.encode_message_body = async (): Promise<ResultOfEncodeMessageBody> => {
        return new Promise<ResultOfEncodeMessageBody>((resolve) =>
          resolve({ body: {} } as ResultOfEncodeMessageBody),
        );
      };

      const abiEncodeMessageBodySpy = jest.spyOn(abiMock, 'encode_message_body');

      const tonClientMock = { abi: abiMock } as TonClient;

      service.init({
        tonClient: tonClientMock,
        everscaleClientConfig: everscaleTip3ContractConfig,
      });

      const transactionHash = 'transaction-hash';
      const transactionResult = {
        transaction: {
          id: transactionHash,
        },
      };

      const contractAccount = {} as Account;
      contractAccount.run = async (): Promise<ResultOfProcessMessage> => {
        return new Promise<ResultOfProcessMessage>((resolve) =>
          resolve({ ...transactionResult } as ResultOfProcessMessage),
        );
      };

      service.getContractAccount = async (): Promise<Account> => {
        return new Promise<Account>((resolve) => resolve(contractAccount));
      };

      const contractAccountRunSpy = jest.spyOn(contractAccount, 'run');

      const result = await service.transferTip3Tokens('recipient-address', 5, token);

      expect(contractAccountRunSpy).toBeCalled();
      expect(result.transactionHash).toBe(transactionHash);
      expect(abiEncodeMessageBodySpy).toBeCalled();

      const payloadShouldBe = {
        abi: {
          type: 'Contract',
          value: {
            abi: 'mocked readFileAsBase64',
          },
        },
        call_set: {
          function_name: 'transfer',
          input: {
            amount: 500000,
            recipient: 'recipient-address',
            deployWalletValue: 100000000,
            remainingGasTo: 'recipient-address',
            notify: false,
            payload: '',
          },
        },
        is_internal: true,
      };

      expect(abiEncodeMessageBodySpy.mock.calls[0][0]).toEqual(payloadShouldBe);
    });
  });
});
