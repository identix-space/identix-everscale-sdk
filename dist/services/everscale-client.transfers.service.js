"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EverscaleClientTransfersService = void 0;
const common_1 = require("@nestjs/common");
const path_1 = require("path");
const everscale_types_1 = require("../types/everscale.types");
const everscale_client_base_service_1 = require("./everscale-client.base.service");
const files_helpers_1 = require("../helpers/files.helpers");
const contracts_paths_1 = require("../contracts/contracts-paths");
let EverscaleClientTransfersService = class EverscaleClientTransfersService extends everscale_client_base_service_1.EverscaleClientBaseService {
    constructor() {
        super();
    }
    async transfer(recipientAddress, amount) {
        var _a;
        const safeMultisigAccount = await this.getContractAccount(everscale_types_1.EverscaleAvailableContracts.safeMultisig);
        const value = parseInt(String(amount * 1000000000));
        const sentTransactionInfo = await safeMultisigAccount.run('submitTransaction', {
            dest: recipientAddress,
            value,
            bounce: false,
            allBalance: false,
            payload: '',
        });
        if (!sentTransactionInfo || !((_a = sentTransactionInfo === null || sentTransactionInfo === void 0 ? void 0 : sentTransactionInfo.transaction) === null || _a === void 0 ? void 0 : _a.id)) {
            throw new Error(`Everscale transfer EVER error. Recipient address: ${recipientAddress}, amount: ${amount}`);
        }
        return { transactionHash: sentTransactionInfo.transaction.id };
    }
    async transferTip3Tokens(recipientAddress, amount, token) {
        var _a, _b, _c, _d;
        if (!((_a = this.everscaleClientConfig) === null || _a === void 0 ? void 0 : _a.tokens) ||
            !((_b = this.everscaleClientConfig) === null || _b === void 0 ? void 0 : _b.tokens[token.toLowerCase()])) {
            throw new Error(`Everscale transfer ${token.toUpperCase()} error. Token is not supported`);
        }
        const everValue = 510000000;
        const Tip3WalletAbi = JSON.parse(await (0, files_helpers_1.readFileAsUTF8)((0, path_1.join)(__dirname, `../contracts/${contracts_paths_1.contractsPaths[everscale_types_1.EverscaleAvailableContracts.tokenWallet].abi}`)));
        const tip3value = amount * 100000;
        const adminSafeMultisigAccount = await this.getContractAccount(everscale_types_1.EverscaleAvailableContracts.safeMultisig);
        const payload = (await this.tonClient.abi.encode_message_body({
            abi: {
                type: 'Contract',
                value: Tip3WalletAbi,
            },
            call_set: {
                function_name: 'transfer',
                input: {
                    amount: tip3value,
                    recipient: recipientAddress,
                    deployWalletValue: 100000000,
                    remainingGasTo: recipientAddress,
                    notify: false,
                    payload: '',
                },
            },
            is_internal: true,
            signer: adminSafeMultisigAccount.signer
        })).body;
        const tokenOwnerSafeMultisigAddress = (_c = this.everscaleClientConfig) === null || _c === void 0 ? void 0 : _c.tokens[token.toLowerCase()];
        const sentTransactionInfo = await adminSafeMultisigAccount.run('submitTransaction', {
            dest: tokenOwnerSafeMultisigAddress,
            value: everValue,
            bounce: false,
            allBalance: false,
            payload,
        });
        if (!sentTransactionInfo || !((_d = sentTransactionInfo === null || sentTransactionInfo === void 0 ? void 0 : sentTransactionInfo.transaction) === null || _d === void 0 ? void 0 : _d.id)) {
            throw new Error(`Everscale transfer EVER error. Recipient address: ${recipientAddress}, amount: ${amount}`);
        }
        return { transactionHash: sentTransactionInfo.transaction.id };
    }
};
EverscaleClientTransfersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], EverscaleClientTransfersService);
exports.EverscaleClientTransfersService = EverscaleClientTransfersService;
//# sourceMappingURL=everscale-client.transfers.service.js.map