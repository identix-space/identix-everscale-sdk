import { Injectable } from '@nestjs/common';

import { join } from 'path';

import { EverscaleAvailableContracts } from '../types/everscale.types';
import { EverscaleClientBaseService } from './everscale-client.base.service';
import {readFileAsBase64, readFileAsUTF8} from '../helpers/files.helpers';
import { contractsPaths } from '../contracts/contracts-paths';

@Injectable()
export class EverscaleClientTransfersService extends EverscaleClientBaseService {
  constructor() {
    super();
  }

  async transfer(recipientAddress: string, amount: number): Promise<{ transactionHash: string }> {
    const safeMultisigAccount = await this.getContractAccount(
      EverscaleAvailableContracts.safeMultisig,
    );

    const value = parseInt(String(amount * 1_000_000_000));
    const sentTransactionInfo = await safeMultisigAccount.run('submitTransaction', {
      dest: recipientAddress,
      value,
      bounce: false,
      allBalance: false,
      payload: '',
    });

    if (!sentTransactionInfo || !sentTransactionInfo?.transaction?.id) {
      throw new Error(
        `Everscale transfer EVER error. Recipient address: ${recipientAddress}, amount: ${amount}`,
      );
    }

    return { transactionHash: sentTransactionInfo.transaction.id };
  }

  async transferTip3Tokens(
    recipientAddress: string,
    amount: number,
    token: string,
  ): Promise<{ transactionHash: string }> {
    if (
      !this.everscaleClientConfig?.tokens ||
      !this.everscaleClientConfig?.tokens[token.toLowerCase()]
    ) {
      throw new Error(`Everscale transfer ${token.toUpperCase()} error. Token is not supported`);
    }

    const everValue = 5_100_000_00;

    const Tip3WalletAbi = JSON.parse(
      await readFileAsUTF8(
        join(
          __dirname,
          `../contracts/${contractsPaths[EverscaleAvailableContracts.tokenWallet].abi}`,
        ),
      ),
    );

    const tip3value = amount * 100_000;

    const adminSafeMultisigAccount = await this.getContractAccount(
      EverscaleAvailableContracts.safeMultisig,
    );

    const payload = (
      await this.tonClient!.abi.encode_message_body({
        abi: {
          type: 'Contract',
          value: Tip3WalletAbi,
        },
      call_set: { // eslint-disable-line
        function_name: 'transfer', // eslint-disable-line
          input: {
            amount: tip3value,
            recipient: recipientAddress,
            deployWalletValue: 100000000,
            remainingGasTo: recipientAddress,
            notify: false,
            payload: '',
          },
        },
      is_internal: true, // eslint-disable-line
      signer: adminSafeMultisigAccount.signer // eslint-disable-line
      })
    ).body;

    const tokenOwnerSafeMultisigAddress = this.everscaleClientConfig?.tokens[token.toLowerCase()];

    const sentTransactionInfo = await adminSafeMultisigAccount.run('submitTransaction', {
      dest: tokenOwnerSafeMultisigAddress,
      value: everValue,
      bounce: false,
      allBalance: false,
      payload,
    });

    if (!sentTransactionInfo || !sentTransactionInfo?.transaction?.id) {
      throw new Error(
        `Everscale transfer EVER error. Recipient address: ${recipientAddress}, amount: ${amount}`,
      );
    }

    return { transactionHash: sentTransactionInfo.transaction.id };
  }
}
