import { EverscaleAvailableContracts } from '../types/everscale.types';

export const contractsPaths = {
  [EverscaleAvailableContracts.idxVcFabric]: {
    abi: 'vc-management/IdxVcFabric.abi.json',
    tvc: 'vc-management/IdxVcFabric.tvc',
  },
  [EverscaleAvailableContracts.idxDidRegistry]: {
    abi: 'did-management/IdxDidRegistry.abi.json',
    tvc: 'did-management/IdxDidRegistry.tvc',
  },
  [EverscaleAvailableContracts.idxDidDocument]: {
    abi: 'did-management/IdxDidDocument.abi.json',
    tvc: 'did-management/IdxDidDocument.tvc',
  },
  [EverscaleAvailableContracts.safeMultisig]: {
    abi: 'safe-multisig/SafeMultisig.abi.json',
    tvc: 'safe-multisig/SafeMultisig.tvc',
  },
  [EverscaleAvailableContracts.tip3TokenRoot]: {
    abi: 'tip3-tokens/Tip3TokenRoot.abi.json',
    tvc: 'tip3-tokens/Tip3TokenRoot.tvc',
  },
  [EverscaleAvailableContracts.tokenWallet]: {
    abi: 'tip3-tokens/TokenWallet.abi.json',
    tvc: 'tip3-tokens/TokenWallet.tvc',
  },
};
