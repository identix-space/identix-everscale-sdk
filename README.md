<table align="center">
  <tr>
     <td align="center" width="9999"> <a href="https://identix.space/" target="blank"><img src="/logo.png" align="center" width="120" alt="Identix.Space"></a> </td>
  </tr>
</table>

# Everscale SDK

## Description

Nest.JS module which implements the basic functions for work with the Everscale blockchain (https://everscale.network/)

## Installation

```bash
$ npm i identix-everscale-sdk

```

## Test

```bash
# unit tests
$ npm run test
```
## API functions (Everscale SDK client interface) 

```
interface IEverscaleClient {
  generateKeys(): Promise<{ public: string; secret: string }>;
  
  verifySignature(input: { signed: string; message: string; publicKey: string }): Promise<boolean>;
  
  signMessage(input: {
    message: string;
    keys: { public: string; secret: string };
  }): Promise<{ signed: string; signature: string }>;
  
  transfer(
    address: string,
    amount: number,
    callback?: (transactionHash: string) => Promise<void>,
  ): Promise<{ transactionHash: string }>;
  
  getTransactions(params: TransactionsSearchParams): Promise<Transaction[]>;
  
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

```
## Usage example

custom-everscale.module.ts
```
import { Module } from '@nestjs/common';
import { IdentixEverscaleSdkModule } from 'identix-everscale-sdk';
import { everscaleClientSDKConfigurationFactory } from './everscale-configuration.factory';

@Module({
  imports: [
    IdentixEverscaleSdkModule.forRoot(everscaleClientSDKConfigurationFactory()),
  ],
  providers: [],
  exports: [],
})
export class CustomEverscaleModule {}

```

everscale-configuration.factory.ts
```
import { EverscaleClientConfiguration } from 'identix-everscale-sdk';

export const everscaleClientSDKConfigurationFactory = () => {
 
   // Configuration initialization according to EverscaleClientConfiguration type
   
   const everscaleDefaultNetwork = ...
   const everscaleNetworks = ...
   const everscaleWongoTokenAddress = ...
   const everscaleTokensApiUrl = ... 
   const everscaleLookLastTransactionsNumber = ...
   const everscaleLookPeriodAgoInSec = ...
   const contractsAddresses = ...
   
   return {
    defaultNetwork: everscaleDefaultNetwork,
    networks: everscaleNetworks,
    tokens: {
      wongo: everscaleWongoTokenAddress,
    },
    api: {
      tokens: {
        url: everscaleTokensApiUrl,
        lookLastTransactionsNumber: everscaleLookLastTransactionsNumber,
        lookPeriodAgoInSec: everscaleLookPeriodAgoInSec,
      },
    },
    contracts: contractsAddresses,
  } as EverscaleClientConfiguration;
};
```

custom-everscale.service.ts

```
import { Inject } from '@nestjs/common';
import { EverscaleClient, IEverscaleClient } from 'identix-everscale-sdk';

@Resolver()
export class CustomEverscaleService {
  constructor(@Inject(EverscaleClient) private everscaleSdkClient: IEverscaleClient) {}

  async transferEver(address: string, amount: number) {
    return this.everscaleSdkClient.transfer(address, amount);
  }
}
```
