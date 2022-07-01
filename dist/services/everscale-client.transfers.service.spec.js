"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const everscale_types_1 = require("../types/everscale.types");
const everscale_client_transfers_service_1 = require("./everscale-client.transfers.service");
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
jest.mock('../helpers/files.helpers', () => {
    const originalFilesHelper = jest.requireActual('../helpers/files.helpers');
    return Object.assign(Object.assign({ __esModule: true }, originalFilesHelper), { readFileAsBase64: jest.fn(() => '{"abi": "mocked readFileAsBase64"}') });
});
describe('EverscaleClientTransfersService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            imports: [],
            providers: [everscale_client_transfers_service_1.EverscaleClientTransfersService],
        }).compile();
        service = module.get(everscale_client_transfers_service_1.EverscaleClientTransfersService);
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
            const contractAccount = {};
            contractAccount.run = async () => {
                return new Promise((resolve) => resolve(Object.assign({}, transactionResult)));
            };
            service.getContractAccount = async () => {
                return new Promise((resolve) => resolve(contractAccount));
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
            const contractAccount = {};
            contractAccount.run = async () => {
                return new Promise((resolve) => resolve(Object.assign({}, wrongTransactionResult)));
            };
            service.getContractAccount = async () => {
                return new Promise((resolve) => resolve(contractAccount));
            };
            const contractAccountRunSpy = jest.spyOn(contractAccount, 'run');
            try {
                await service.transfer('recipient-address', 5);
                expect(true).toBeFalsy();
            }
            catch (e) {
                expect(contractAccountRunSpy).toBeCalled();
                expect(e.message).toMatch('Everscale transfer EVER error');
            }
        });
    });
    describe('transfers Tip3 tokens', () => {
        it('transferTip3Tokens() => success', async () => {
            const token = 'some-token';
            const everscaleTip3ContractConfig = Object.assign(Object.assign({}, everscaleContractConfig), { tokens: {
                    [token]: 'some-token-address',
                } });
            const abiMock = {};
            abiMock.encode_message_body = async () => {
                return new Promise((resolve) => resolve({ body: {} }));
            };
            const abiEncodeMessageBodySpy = jest.spyOn(abiMock, 'encode_message_body');
            const tonClientMock = { abi: abiMock };
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
            const contractAccount = {};
            contractAccount.run = async () => {
                return new Promise((resolve) => resolve(Object.assign({}, transactionResult)));
            };
            service.getContractAccount = async () => {
                return new Promise((resolve) => resolve(contractAccount));
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
//# sourceMappingURL=everscale-client.transfers.service.spec.js.map