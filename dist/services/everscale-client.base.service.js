"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EverscaleClientBaseService = void 0;
const appkit_1 = require("@tonclient/appkit");
const lib_node_1 = require("@tonclient/lib-node");
const core_1 = require("@tonclient/core");
const files_helpers_1 = require("../helpers/files.helpers");
const path_1 = require("path");
const contracts_paths_1 = require("../contracts/contracts-paths");
class EverscaleClientBaseService {
    constructor() {
        this.accounts = new Map();
    }
    init(params) {
        const { everscaleClientConfig, tonClient } = params;
        if (everscaleClientConfig) {
            const { defaultNetwork, networks } = everscaleClientConfig || {};
            if (!everscaleClientConfig || !defaultNetwork || !Array.isArray(networks[defaultNetwork])) {
                throw new Error(`Everscale client configuration is invalid!`);
            }
            this.everscaleClientConfig = everscaleClientConfig;
            core_1.TonClient.useBinaryLibrary(lib_node_1.libNode);
            this.tonClient = new core_1.TonClient({ network: { endpoints: networks[defaultNetwork] } });
        }
        if (tonClient) {
            this.tonClient = tonClient;
        }
    }
    async getContractAccount(contractTag) {
        var _a, _b, _c;
        if (this.accounts.has(contractTag)) {
            return this.accounts.get(contractTag);
        }
        try {
            if (!((_a = this.everscaleClientConfig) === null || _a === void 0 ? void 0 : _a.contracts) ||
                !((_c = (_b = this.everscaleClientConfig) === null || _b === void 0 ? void 0 : _b.contracts[contractTag]) === null || _c === void 0 ? void 0 : _c.address)) {
                throw new Error(`Everscale client configuration for contract ${contractTag} is invalid! `);
            }
            const { address, signerKeys: keys } = this.everscaleClientConfig.contracts[contractTag];
            const abiData = await (0, files_helpers_1.readFileAsUTF8)((0, path_1.join)(__dirname, `../contracts/${contracts_paths_1.contractsPaths[contractTag].abi}`));
            const abi = JSON.parse(abiData);
            const tvc = await (0, files_helpers_1.readFileAsBase64)((0, path_1.join)(__dirname, `../contracts/${contracts_paths_1.contractsPaths[contractTag].tvc}`));
            const contract = { abi, tvc };
            const account = new appkit_1.Account(contract, {
                address,
                signer: keys && (0, core_1.signerKeys)(keys),
                client: this.tonClient,
            });
            this.accounts.set(contractTag, account);
            return account;
        }
        catch (e) {
            throw new Error(`Everscale contract ${contractTag} account configuration failed: ${e.message}`);
        }
    }
}
exports.EverscaleClientBaseService = EverscaleClientBaseService;
//# sourceMappingURL=everscale-client.base.service.js.map