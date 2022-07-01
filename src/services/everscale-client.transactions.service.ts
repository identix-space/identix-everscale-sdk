import { Injectable } from '@nestjs/common';
import { CheckTokenTransactionType, IEverscaleTransaction } from '../types/everscale.types';
import { EverscaleClientBaseService } from './everscale-client.base.service';
import { get } from '../helpers/object.helpers';
import axios from 'axios';

@Injectable()
export class EverscaleClientTransactionsService extends EverscaleClientBaseService {
  constructor() {
    super();
  }

  async getTokenTransactions(token: string, limit = 10): Promise<IEverscaleTransaction[]> {
    const data = { offset: 0, limit, token };

    const everscaleTokensAPIUrl = this.everscaleClientConfig?.api?.tokens?.url;
    if (!everscaleTokensAPIUrl) {
      throw new Error('Everscale tokens API url is undefined');
    }

    const response = await axios.post(`${everscaleTokensAPIUrl}/transactions`, data, {
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response || !response.data) {
      return [];
    }

    const transactions = get(response.data, 'transactions');
    return Array.isArray(transactions) ? transactions : [];
  }

  async checkTokensTransactions(
    address: string,
    tokens: CheckTokenTransactionType[],
    lookLastTransactionsNumber = 1000,
    lookPeriodAgoInSec = 3600,
  ): Promise<boolean> {
    for await (const token of tokens) {
      const { title: tokenTitle, ownerTransferType, operationKind } = token;

      const defaultLookLastTransactionsNumber =
        this.everscaleClientConfig?.api?.tokens?.lookLastTransactionsNumber || 1000;
      const defaultLookPeriodAgoInSec =
        this.everscaleClientConfig?.api?.tokens?.lookPeriodAgoInSec || 600;

      const tokenTransactions = await this.getTokenTransactions(
        tokenTitle,
        lookLastTransactionsNumber || defaultLookLastTransactionsNumber,
      );

      const userTokenTransactions =
        (Array.isArray(tokenTransactions) &&
          tokenTransactions.filter((transaction: IEverscaleTransaction) => {
            const transactionOwnerAddress =
              ownerTransferType === 'send'
                ? transaction.sender?.ownerAddress
                : transaction.receiver?.ownerAddress;

            const checkTransactionInSearchPeriod =
              new Date().getTime() - transaction.blockTime <
              (lookPeriodAgoInSec || defaultLookPeriodAgoInSec) * 1000;

            return (
              transactionOwnerAddress === address &&
              transaction.kind === operationKind &&
              checkTransactionInSearchPeriod
            );
          })) ||
        [];

      if (userTokenTransactions.length === 0) {
        return false;
      }
    }

    return true;
  }
}
