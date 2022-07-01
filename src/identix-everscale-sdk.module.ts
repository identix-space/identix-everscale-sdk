import { DynamicModule, Module } from '@nestjs/common';

import { everscaleClientProviderFactory } from './providers/everscale-client.provider';
import { EverscaleClientConfiguration } from './types/everscale.types';
import { EverscaleClientDidManagementService } from './services/everscale-client.did-management.service';
import { EverscaleClientVcManagementService } from './services/everscale-client.vc-management.service';
import { EverscaleClientTransactionsService } from './services/everscale-client.transactions.service';
import { EverscaleClientTransfersService } from './services/everscale-client.transfers.service';

@Module({})
export class IdentixEverscaleSdkModule {
  public static forRoot(everscaleClientConfiguration: EverscaleClientConfiguration): DynamicModule {
    const EverscaleClientProvider = everscaleClientProviderFactory(everscaleClientConfiguration);

    return {
      module: IdentixEverscaleSdkModule,
      imports: [],
      providers: [
        EverscaleClientProvider,
        EverscaleClientDidManagementService,
        EverscaleClientVcManagementService,
        EverscaleClientTransfersService,
        EverscaleClientTransactionsService,
      ],
      controllers: [],
      exports: [EverscaleClientProvider],
    };
  }
}
