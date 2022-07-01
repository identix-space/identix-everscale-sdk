import { EverscaleClientBaseService } from './everscale-client.base.service';
import { EverscaleAvailableContracts } from '../types/everscale.types';

jest.mock('../helpers/files.helpers', () => {
  const originalFilesHelper = jest.requireActual('../helpers/files.helpers');

  return {
    __esModule: true,
    ...originalFilesHelper,
    readFileAsBase64: jest.fn(() => '{"abi": "mocked readFileAsBase64"}'),
  };
});

describe('EverscaleClientBaseService', () => {
  it('getContractAccount()', async () => {
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

    const service = new EverscaleClientBaseService();
    service.init({ everscaleClientConfig: everscaleContractConfig });
    const contractAccount = await service.getContractAccount(
      EverscaleAvailableContracts.safeMultisig,
    );

    expect(contractAccount).toBeDefined();
    expect(typeof contractAccount).toBe('object');
  });
});
