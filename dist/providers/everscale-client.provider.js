"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.everscaleClientProviderFactory = void 0;
const everscale_types_1 = require("../types/everscale.types");
const everscale_client_did_management_service_1 = require("../services/everscale-client.did-management.service");
const everscale_client_vc_management_service_1 = require("../services/everscale-client.vc-management.service");
const everscale_client_transfers_service_1 = require("../services/everscale-client.transfers.service");
const everscale_client_transactions_service_1 = require("../services/everscale-client.transactions.service");
const everscaleClientProviderFactory = (everscaleClientConfig) => {
    return {
        provide: everscale_types_1.EverscaleClient,
        useFactory: (everscaleClientDidService, everscaleClientVcService, everscaleClientTransfersService, everscaleClientTransactionsService) => everscaleClientFactory(everscaleClientConfig, everscaleClientDidService, everscaleClientVcService, everscaleClientTransfersService, everscaleClientTransactionsService),
        inject: [
            everscale_client_did_management_service_1.EverscaleClientDidManagementService,
            everscale_client_vc_management_service_1.EverscaleClientVcManagementService,
            everscale_client_transfers_service_1.EverscaleClientTransfersService,
            everscale_client_transactions_service_1.EverscaleClientTransactionsService,
        ],
    };
};
exports.everscaleClientProviderFactory = everscaleClientProviderFactory;
function everscaleClientFactory(everscaleClientConfig, everscaleClientDidService, everscaleClientVcService, everscaleClientTransfersService, everscaleClientTransactionsService) {
    if (!everscaleClientConfig) {
        throw new Error(`Everscale client configuration is invalid!`);
    }
    everscaleClientDidService.init({ everscaleClientConfig });
    everscaleClientVcService.init({ everscaleClientConfig });
    everscaleClientTransfersService.init({ everscaleClientConfig });
    everscaleClientTransactionsService.init({ everscaleClientConfig });
    return {
        generateKeys: async () => {
            return everscaleClientDidService.generateKeys();
        },
        signMessage: async (input) => {
            return everscaleClientDidService.signMessage(input);
        },
        verifySignature: async (input) => {
            return everscaleClientDidService.verifySignature(input);
        },
        issueDidDocument: async (publicKey) => {
            return everscaleClientDidService.issueDidDocument(publicKey);
        },
        issuerVC: async (claims, issuerPubKey) => {
            return everscaleClientVcService.issuerVC(claims, issuerPubKey);
        },
        transfer(address, amount) {
            return everscaleClientTransfersService.transfer(address, amount);
        },
        getTransactions(params) {
            const { token, limit } = params;
            return everscaleClientTransactionsService.getTokenTransactions(token, limit);
        },
        transferTip3Tokens(address, amount, token) {
            return everscaleClientTransfersService.transferTip3Tokens(address, amount, token);
        },
        checkTokensTransactions(address, tokens, lookLastTransactionsNumber = 1000, lookPeriodAgoInSec = 3600) {
            return everscaleClientTransactionsService.checkTokensTransactions(address, tokens, lookLastTransactionsNumber, lookPeriodAgoInSec);
        },
    };
}
//# sourceMappingURL=everscale-client.provider.js.map