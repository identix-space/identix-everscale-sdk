import {
  IBaseBlockchainClient,
  IBaseTransaction,
  IBaseTransactionsSearchParams,
} from './base-blockchains.types';

export type Did = string;

/**
 * Everscale Client Configuration
 *
 * Example:
 *
 *  {
 *    defaultNetwork: 'mainnet',
 *    networks: {
 *      mainnet: [
 *         'https://eri01.main.everos.dev',
 *         'https://gra01.main.everos.dev',
 *         'https://gra02.main.everos.dev'
 *      ],
 *      testnet: [
 *         'https://net1.ton.dev',
 *         'https://net5.ton.dev'
 *      ]
 *    },
 *    tokens: {
 *      wongo: '0:c270f0cb38f70856fe756fbbddb811782bc5e9e9bdfadbababf81a81da6fba27'
 *    },
 *    api: {
 *      tokens: {
 *        url: 'https://token-indexer.broxus.com/v1'
 *        lookLastTransactionsNumber: 1000,
 *        lookPeriodAgoInSec: 600
 *      }
 *    },
 *    contracts: {
 *      IDX_VC_FABRIC: {
 *         address: '0:6c33236486c501865c88a67c59f50a74568ef7492c22db400bccf179483c0880',
 *         signerKeys:  {
 *           public: 'bf20f5318 .......................................... 1f2360fea8f',
 *           secret: '729da8540a ......................................... 796062f305d2'
 *         }
 *      },
 *      IDX_DOC_DOCUMENT: {
 *         address: '0:8605f78a57589aa6c0edde0a3a1073faffc76f6da74594ff16237a7c4f145b34',
 *         signerKeys:  {
 *           public: 'bf20f5318 .......................................... 1f2360fea8f',
 *           secret: '729da8540a ......................................... 796062f305d2'
 *         }
 *      },
 *      IDX_DID_REGISTRY: {
 *         address: '0:fc8ca01354b618a10d91a2d6dce88596eadb06a9143e8696b63fa5fb582d0eb1',
 *         signerKeys:  {
 *           public: 'bf20f5318 .......................................... 1f2360fea8f',
 *           secret: '729da8540a ......................................... 796062f305d2'
 *         }
 *      },
 *      SAFE_MULTISIG: {
 *         address: '0:b60107b56215dca1cfaaf7cfb486cc49c2655aa28a181b0e9dbab0dcb78ea1cd',
 *         signerKeys:  {
 *           public: 'bf20f5318 .......................................... 1f2360fea8f',
 *           secret: '729da8540a ......................................... 796062f305d2'
 *         }
 *      },
 *      tip3TokenRoot: {
 *         address: '0:fc8ca01354b618a10d91a2d6dce88596eadb06a9143e8696b63fa5fb582d0eb1',
 *         signerKeys:  {
 *           public: 'bf20f5318 .......................................... 1f2360fea8f',
 *           secret: '729da8540a ......................................... 796062f305d2'
 *         }
 *      },
 *      TOKEN_WALLET: {
 *         address: '0:fc8ca01354b618a10d91a2d6dce88596eadb06a9143e8696b63fa5fb582d0eb1',
 *         signerKeys:  {
 *           public: 'bf20f5318 .......................................... 1f2360fea8f',
 *           secret: '729da8540a ......................................... 796062f305d2'
 *         }
 *      }
 *    }
 *  }
 *
 */
export type EverscaleClientConfiguration = {
  defaultNetwork: string;
  networks: {
    mainnet: string[];
    testnet?: string[];
  };
  tokens?: { [key: string]: string };
  api?: {
    tokens?: {
      url: string;
      lookLastTransactionsNumber: number;
      lookPeriodAgoInSec: number;
    };
  };
  contracts?: {
    [key: string]: { address: string; signerKeys?: { public: string; secret: string } };
  };
};

export const EverscaleClient = 'EVERSCALE_CLIENT';

export interface IEverscaleTransaction extends IBaseTransaction {
  transactionHash: string;
  sender: {
    ownerAddress: string;
    tokenWalletAddress: string;
  };
  receiver: {
    ownerAddress: string;
    tokenWalletAddress: string;
  };
  amount: string;
  rootAddress: string;
  token: string;
  kind: string;
  standard: string;
  blockTime: number;
}

export type CheckTokenTransactionType = {
  title: string;
  ownerTransferType: 'send' | 'receive';
  operationKind: 'send' | 'receive' | 'mint';
  contragent?: string;
};

export interface IEverscaleTransactionsSearchParams extends IBaseTransactionsSearchParams {
  token?: string;
}

export interface IEverscaleClient
  extends IBaseBlockchainClient<IEverscaleTransactionsSearchParams, IEverscaleTransaction> {
  generateKeys(): Promise<{ public: string; secret: string }>;
  verifySignature(input: { signed: string; message: string; publicKey: string }): Promise<boolean>;
  signMessage(input: {
    message: string;
    keys: { public: string; secret: string };
  }): Promise<{ signed: string; signature: string }>;
  issuerVC(claims: ClaimsGroup[], issuerPubKey: string): Promise<Did>;
  issueDidDocument(publicKey: string): Promise<Did>;
  transferTip3Tokens(
    address: string,
    amount: number,
    token: string,
  ): Promise<{ transactionHash: string }>;
  checkTokensTransactions(
    address: string,
    tokens: CheckTokenTransactionType[],
    lookLastTransactionsNumber: number,
    lookPeriodAgoInSec: number,
  ): Promise<boolean>;
}

export class ClaimsGroup {
  hmacHigh_claimGroup: string | undefined;
  hmacHigh_groupDid: string | undefined;
  signHighPart: string | undefined;
  signLowPart: string | undefined;
}

export enum EverscaleAvailableContracts {
  idxVcFabric = 'IDX_VC_FABRIC',
  idxDidDocument = 'IDX_DOC_DOCUMENT',
  idxDidRegistry = 'IDX_DID_REGISTRY',
  safeMultisig = 'SAFE_MULTISIG',
  tip3TokenRoot = 'TIP3_TOKEN_ROOT',
  tokenWallet = 'TOKEN_WALLET',
}
