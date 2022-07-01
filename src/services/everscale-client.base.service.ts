import { Account } from '@tonclient/appkit';
import { libNode } from '@tonclient/lib-node';
import { KeyPair, signerKeys, TonClient } from '@tonclient/core';

import {
  EverscaleAvailableContracts,
  EverscaleClientConfiguration,
} from '../types/everscale.types';
import { readFileAsBase64, readFileAsUTF8 } from '../helpers/files.helpers';
import { join } from 'path';
import { contractsPaths } from '../contracts/contracts-paths';

export type InitEverscaleClientParams = {
  everscaleClientConfig?: EverscaleClientConfiguration;
  tonClient?: TonClient;
};

export class EverscaleClientBaseService {
  protected everscaleClientConfig: EverscaleClientConfiguration | undefined;
  protected tonClient: TonClient | undefined;
  protected readonly accounts: Map<EverscaleAvailableContracts, Account>;

  constructor() {
    this.accounts = new Map<EverscaleAvailableContracts, Account>();
  }

  init(params: InitEverscaleClientParams) {
    const { everscaleClientConfig, tonClient } = params;

    if (everscaleClientConfig) {
      const { defaultNetwork, networks } = everscaleClientConfig || {};

      if (!everscaleClientConfig || !defaultNetwork || !Array.isArray(networks![defaultNetwork])) {
        throw new Error(`Everscale client configuration is invalid!`);
      }

      this.everscaleClientConfig = everscaleClientConfig;

      TonClient.useBinaryLibrary(libNode);
      this.tonClient = new TonClient({ network: { endpoints: networks![defaultNetwork] } });
    }
    if (tonClient) {
      this.tonClient = tonClient;
    }
  }

  async getContractAccount(contractTag: EverscaleAvailableContracts): Promise<Account> {
    if (this.accounts.has(contractTag)) {
      return this.accounts.get(contractTag)!;
    }

    try {
      if (
        !this.everscaleClientConfig?.contracts ||
        !this.everscaleClientConfig?.contracts[contractTag]?.address
      ) {
        throw new Error(`Everscale client configuration for contract ${contractTag} is invalid! `);
      }

      const { address, signerKeys: keys } = this.everscaleClientConfig.contracts[contractTag];

      const abiData = await readFileAsUTF8(
        join(__dirname, `../contracts/${contractsPaths[contractTag].abi}`),
      );
      const abi = JSON.parse(abiData);
      const tvc = await readFileAsBase64(
        join(__dirname, `../contracts/${contractsPaths[contractTag].tvc}`),
      );
      const contract = { abi, tvc };

      const account = new Account(contract, {
        address,
        signer: keys && signerKeys(keys as KeyPair),
        client: this.tonClient,
      });

      this.accounts.set(contractTag, account);

      return account;
    } catch (e) {
      throw new Error(
        `Everscale contract ${contractTag} account configuration failed: ${e.message}`,
      );
    }
  }
}
