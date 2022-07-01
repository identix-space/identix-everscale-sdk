"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const everscale_types_1 = require("../types/everscale.types");
const everscale_client_transactions_service_1 = require("./everscale-client.transactions.service");
const axios_1 = require("axios");
const axios_mock_adapter_1 = require("axios-mock-adapter");
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
    api: {
        tokens: {
            url: 'some-url',
            lookLastTransactionsNumber: 1000,
            lookPeriodAgoInSec: 600,
        },
    },
};
describe('EverscaleClientTransactionsService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            imports: [],
            providers: [everscale_client_transactions_service_1.EverscaleClientTransactionsService],
        }).compile();
        service = module.get(everscale_client_transactions_service_1.EverscaleClientTransactionsService);
        service.init({ everscaleClientConfig: everscaleContractConfig });
        jest.clearAllMocks();
    });
    describe('services', () => {
        it('should be defined', () => {
            expect(service).toBeDefined();
        });
    });
    describe('transactions', () => {
        const transactions = (ownerAddress) => [
            {
                id: 'transactionHash1',
                kind: 'receiver',
                blockTime: new Date().getTime() - 100 * 1000,
                sender: {
                    ownerAddress: 'sender-address',
                },
                receiver: {
                    ownerAddress: ownerAddress,
                },
            },
            {
                id: 'transactionHash2',
                kind: 'send',
                blockTime: new Date().getTime() - 100 * 1000,
                sender: {
                    ownerAddress: ownerAddress,
                },
                receiver: {
                    ownerAddress: 'receiver-address',
                },
            },
            {
                id: 'transactionHash3',
                kind: 'send',
                blockTime: new Date().getTime() - 1000 * 1000,
                sender: {
                    ownerAddress: ownerAddress,
                },
                receiver: {
                    ownerAddress: 'receiver-address',
                },
            },
        ];
        let axiosMock;
        beforeEach(() => {
            axiosMock = new axios_mock_adapter_1.default(axios_1.default);
        });
        afterEach(() => {
            axiosMock.reset();
        });
        it('getTokenTransactions()', async () => {
            const transactions = [{ id: 'transactionHash1' }, { id: 'transactionHash2' }];
            const requestResult = { transactions };
            axiosMock.onPost().reply(200, requestResult);
            const token = 'token';
            const result = await service.getTokenTransactions(token);
            expect(result).toBeDefined();
            expect(result).toEqual(transactions);
        });
        it('checkTokensTransactions()=> success: there is at least one transaction with search params', async () => {
            const ownerAddress = 'wanted-address';
            const requestResult = { transactions: transactions(ownerAddress) };
            axiosMock.onPost().reply(200, requestResult);
            const token = 'token';
            const result = await service.checkTokensTransactions(ownerAddress, [
                {
                    title: token,
                    ownerTransferType: 'send',
                    operationKind: 'send',
                },
            ], 100, 300);
            expect(result).toBeDefined();
            expect(result).toBeTruthy();
        });
        it('checkTokensTransactions() => fail: there are no transactions with search params', async () => {
            const ownerAddress = 'wanted-address';
            const requestResult = { transactions: transactions('other-address') };
            axiosMock.onPost().reply(200, requestResult);
            const token = 'token';
            const result = await service.checkTokensTransactions(ownerAddress, [
                {
                    title: token,
                    ownerTransferType: 'send',
                    operationKind: 'send',
                },
            ], 100, 300);
            expect(result).toBeDefined();
            expect(result).toBeFalsy();
        });
    });
});
//# sourceMappingURL=everscale-client.transactions.service.spec.js.map