"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const everscale_client_vc_management_service_1 = require("./everscale-client.vc-management.service");
const everscale_types_1 = require("../types/everscale.types");
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
describe('EverscaleClientVcManagementService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            imports: [],
            providers: [everscale_client_vc_management_service_1.EverscaleClientVcManagementService],
        }).compile();
        service = module.get(everscale_client_vc_management_service_1.EverscaleClientVcManagementService);
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
            const contractAccount = {};
            contractAccount.run = async () => {
                return new Promise((resolve) => resolve(Object.assign({}, issueVcResult)));
            };
            contractAccount.free = async () => { };
            service.getContractAccount = async () => {
                return new Promise((resolve) => resolve(contractAccount));
            };
            const contractAccountRunSpy = jest.spyOn(contractAccount, 'run');
            const contractAccountFreeSpy = jest.spyOn(contractAccount, 'free');
            const result = await service.issuerVC([], 'issuer-public-key');
            expect(contractAccountRunSpy).toBeCalled();
            expect(contractAccountFreeSpy).toBeCalled();
            expect(result).toBe(newVcAddress);
        });
    });
});
//# sourceMappingURL=everscale-client.vc-management.service.spec.js.map