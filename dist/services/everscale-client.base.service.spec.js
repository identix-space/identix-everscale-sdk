"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const everscale_client_base_service_1 = require("./everscale-client.base.service");
const everscale_types_1 = require("../types/everscale.types");
jest.mock('../helpers/files.helpers', () => {
    const originalFilesHelper = jest.requireActual('../helpers/files.helpers');
    return Object.assign(Object.assign({ __esModule: true }, originalFilesHelper), { readFileAsBase64: jest.fn(() => '{"abi": "mocked readFileAsBase64"}') });
});
describe('EverscaleClientBaseService', () => {
    it('getContractAccount()', async () => {
        const everscaleContractConfig = {
            defaultNetwork: 'mainnet',
            networks: {
                mainnet: ['https://some-url'],
            },
            contracts: {
                [everscale_types_1.EverscaleAvailableContracts.safeMultisig]: {
                    address: 'some-address',
                    signerKeys: {
                        public: 'public',
                        secret: 'secret',
                    },
                },
            },
        };
        const service = new everscale_client_base_service_1.EverscaleClientBaseService();
        service.init({ everscaleClientConfig: everscaleContractConfig });
        const contractAccount = await service.getContractAccount(everscale_types_1.EverscaleAvailableContracts.safeMultisig);
        expect(contractAccount).toBeDefined();
        expect(typeof contractAccount).toBe('object');
    });
});
//# sourceMappingURL=everscale-client.base.service.spec.js.map