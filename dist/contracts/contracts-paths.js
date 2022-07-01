"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contractsPaths = void 0;
const everscale_types_1 = require("../types/everscale.types");
exports.contractsPaths = {
    [everscale_types_1.EverscaleAvailableContracts.idxVcFabric]: {
        abi: 'vc-management/IdxVcFabric.abi.json',
        tvc: 'vc-management/IdxVcFabric.tvc',
    },
    [everscale_types_1.EverscaleAvailableContracts.idxDidRegistry]: {
        abi: 'did-management/IdxDidRegistry.abi.json',
        tvc: 'did-management/IdxDidRegistry.tvc',
    },
    [everscale_types_1.EverscaleAvailableContracts.idxDidDocument]: {
        abi: 'did-management/IdxDidDocument.abi.json',
        tvc: 'did-management/IdxDidDocument.tvc',
    },
    [everscale_types_1.EverscaleAvailableContracts.safeMultisig]: {
        abi: 'safe-multisig/SafeMultisig.abi.json',
        tvc: 'safe-multisig/SafeMultisig.tvc',
    },
    [everscale_types_1.EverscaleAvailableContracts.tip3TokenRoot]: {
        abi: 'tip3-tokens/Tip3TokenRoot.abi.json',
        tvc: 'tip3-tokens/Tip3TokenRoot.tvc',
    },
    [everscale_types_1.EverscaleAvailableContracts.tokenWallet]: {
        abi: 'tip3-tokens/TokenWallet.abi.json',
        tvc: 'tip3-tokens/TokenWallet.tvc',
    },
};
//# sourceMappingURL=contracts-paths.js.map