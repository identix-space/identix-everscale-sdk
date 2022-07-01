import {
  EverscaleClient,
  IEverscaleClient,
  EverscaleClientConfiguration,
  ClaimsGroup,
  Did,
  IEverscaleTransactionsSearchParams,
  IEverscaleTransaction,
  CheckTokenTransactionType,
} from '../types/everscale.types';
import { EverscaleClientDidManagementService } from '../services/everscale-client.did-management.service';
import { EverscaleClientVcManagementService } from '../services/everscale-client.vc-management.service';
import { EverscaleClientTransfersService } from '../services/everscale-client.transfers.service';
import { EverscaleClientTransactionsService } from '../services/everscale-client.transactions.service';

export const everscaleClientProviderFactory = (
  everscaleClientConfig: EverscaleClientConfiguration,
) => {
  return {
    provide: EverscaleClient,
    useFactory: (
      everscaleClientDidService: EverscaleClientDidManagementService,
      everscaleClientVcService: EverscaleClientVcManagementService,
      everscaleClientTransfersService: EverscaleClientTransfersService,
      everscaleClientTransactionsService: EverscaleClientTransactionsService,
    ): IEverscaleClient =>
      everscaleClientFactory(
        everscaleClientConfig,
        everscaleClientDidService,
        everscaleClientVcService,
        everscaleClientTransfersService,
        everscaleClientTransactionsService,
      ),
    inject: [
      EverscaleClientDidManagementService,
      EverscaleClientVcManagementService,
      EverscaleClientTransfersService,
      EverscaleClientTransactionsService,
    ],
  };
};

function everscaleClientFactory(
  everscaleClientConfig: EverscaleClientConfiguration,
  everscaleClientDidService: EverscaleClientDidManagementService,
  everscaleClientVcService: EverscaleClientVcManagementService,
  everscaleClientTransfersService: EverscaleClientTransfersService,
  everscaleClientTransactionsService: EverscaleClientTransactionsService,
): IEverscaleClient {
  if (!everscaleClientConfig) {
    throw new Error(`Everscale client configuration is invalid!`);
  }

  everscaleClientDidService.init({ everscaleClientConfig });
  everscaleClientVcService.init({ everscaleClientConfig });
  everscaleClientTransfersService.init({ everscaleClientConfig });
  everscaleClientTransactionsService.init({ everscaleClientConfig });

  return {
    generateKeys: async (): Promise<{ public: string; secret: string }> => {
      return everscaleClientDidService.generateKeys();
    },
    signMessage: async (input: {
      message: string;
      keys: { public: string; secret: string };
    }): Promise<{ signed: string; signature: string }> => {
      return everscaleClientDidService.signMessage(input);
    },
    verifySignature: async (input: {
      signed: string;
      message: string;
      publicKey: string;
    }): Promise<boolean> => {
      return everscaleClientDidService.verifySignature(input);
    },
    issueDidDocument: async (publicKey: string): Promise<Did> => {
      return everscaleClientDidService.issueDidDocument(publicKey);
    },
    issuerVC: async (claims: ClaimsGroup[], issuerPubKey: string): Promise<Did> => {
      return everscaleClientVcService.issuerVC(claims, issuerPubKey);
    },
    transfer(address: string, amount: number): Promise<{ transactionHash: string }> {
      return everscaleClientTransfersService.transfer(address, amount);
    },
    getTransactions(params: IEverscaleTransactionsSearchParams): Promise<IEverscaleTransaction[]> {
      const { token, limit } = params;
      return everscaleClientTransactionsService.getTokenTransactions(token!, limit);
    },
    transferTip3Tokens(
      address: string,
      amount: number,
      token: string,
    ): Promise<{ transactionHash: string }> {
      return everscaleClientTransfersService.transferTip3Tokens(address, amount, token);
    },
    checkTokensTransactions(
      address: string,
      tokens: CheckTokenTransactionType[],
      lookLastTransactionsNumber = 1000,
      lookPeriodAgoInSec = 3600,
    ): Promise<boolean> {
      return everscaleClientTransactionsService.checkTokensTransactions(
        address,
        tokens,
        lookLastTransactionsNumber,
        lookPeriodAgoInSec,
      );
    },
  };
}
