"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const everscale_client_did_management_service_1 = require("./everscale-client.did-management.service");
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
describe('EverscaleClientDidManagementService', () => {
    let service;
    let cryptoMock;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            imports: [],
            providers: [everscale_client_did_management_service_1.EverscaleClientDidManagementService],
        }).compile();
        service = module.get(everscale_client_did_management_service_1.EverscaleClientDidManagementService);
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
            cryptoMock = {};
            cryptoMock.generate_random_sign_keys = async () => {
                return new Promise((resolve) => resolve({ public: 'public', secret: 'secret' }));
            };
            const cryptoGenerateRandomSignKeysSpy = jest.spyOn(cryptoMock, 'generate_random_sign_keys');
            const tonClientMock = { crypto: cryptoMock };
            service.init({ tonClient: tonClientMock });
            const keys = await service.generateKeys();
            expect(cryptoGenerateRandomSignKeysSpy).toBeCalled();
            expect(keys).toBeDefined();
        });
        it('check signMessage()', async () => {
            cryptoMock = {};
            cryptoMock.sign = async () => {
                return new Promise((resolve) => resolve({ signed: 'signed', signature: 'secret' }));
            };
            const cryptoSignSpy = jest.spyOn(cryptoMock, 'sign');
            const tonClientMock = { crypto: cryptoMock };
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
            cryptoMock = {};
            cryptoMock.verify_signature = async () => {
                return new Promise((resolve) => resolve({ unsigned: 'wrong signature unsigned' }));
            };
            const cryptoVerifySignatureSpy = jest.spyOn(cryptoMock, 'verify_signature');
            const tonClientMock = { crypto: cryptoMock };
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
            cryptoMock = {};
            cryptoMock.verify_signature = async () => {
                return new Promise((resolve) => resolve({ unsigned: text2base64Message }));
            };
            const cryptoVerifySignatureSpy = jest.spyOn(cryptoMock, 'verify_signature');
            const tonClientMock = { crypto: cryptoMock };
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
            const contractAccount = {};
            contractAccount.run = async () => {
                return new Promise((resolve) => resolve(Object.assign({}, issueDidDocumentResult)));
            };
            contractAccount.free = async () => { };
            service.getContractAccount = async () => {
                return new Promise((resolve) => resolve(contractAccount));
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
            const contractAccount = {};
            contractAccount.runLocal = async () => {
                return new Promise((resolve) => resolve(Object.assign({}, getSubjectPubKeyResult)));
            };
            contractAccount.free = async () => { };
            service.getContractAccount = async () => {
                return new Promise((resolve) => resolve(contractAccount));
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
//# sourceMappingURL=everscale-client.did-management.service.spec.js.map