export interface IBaseTransaction {
  transactionHash: string;
}

export interface IBaseTransactionsSearchParams {
  address?: string;
  limit?: number;
}

export interface IBaseBlockchainClient<TransactionsSearchParams, Transaction> {
  transfer(
    address: string,
    amount: number,
    callback?: (transactionHash: string) => Promise<void>,
  ): Promise<{ transactionHash: string }>;
  getTransactions(params: TransactionsSearchParams): Promise<Transaction[]>;
}
