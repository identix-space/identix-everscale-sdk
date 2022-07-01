import { Test } from '@nestjs/testing';
import { ResultOfProcessMessage } from '@tonclient/core';
import { Account } from '@tonclient/appkit';

import { EverscaleClientVcManagementService } from './everscale-client.vc-management.service';
import { ClaimsGroup, EverscaleAvailableContracts } from '../types/everscale.types';

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

describe('EverscaleClientVcManagementService', () => {
  let service: EverscaleClientVcManagementService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [],
      providers: [ EverscaleClientVcManagementService ],
    }).compile();

    service = module.get<EverscaleClientVcManagementService>(EverscaleClientVcManagementService);
    service.init({ everscaleClientConfig: everscaleContractConfig });

    jest.clearAllMocks();
  });

  describe('services', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();

    });
  });

  describe('vc management', () => {
    it('issuerVC()', async () => {
      const newVcAddress = 'some-address';
      const issueVcResult = {
        decoded: {
          output: {
            vcAddress: newVcAddress,
          },
        },
      };

      const contractAccount = {} as Account;
      contractAccount.run = async (): Promise<ResultOfProcessMessage> => {
        return new Promise<ResultOfProcessMessage>((resolve) =>
          resolve({ ...issueVcResult } as ResultOfProcessMessage),
        );
      };
      contractAccount.free = async () => {};

      service.getContractAccount = async (): Promise<Account> => {
        return new Promise<Account>((resolve) => resolve(contractAccount));
      };

      const contractAccountRunSpy = jest.spyOn(contractAccount, 'run');
      const contractAccountFreeSpy = jest.spyOn(contractAccount, 'free');

      const result = await service.issuerVC([] as ClaimsGroup[], 'issuer-public-key');

      expect(contractAccountRunSpy).toBeCalled();
      expect(contractAccountFreeSpy).toBeCalled();
      expect(result).toBe(newVcAddress);
    });
  });
});
