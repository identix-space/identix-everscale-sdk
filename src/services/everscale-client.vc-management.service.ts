import { Injectable } from '@nestjs/common';

import { Did, ClaimsGroup, EverscaleAvailableContracts } from '../types/everscale.types';
import { EverscaleClientBaseService } from './everscale-client.base.service';

@Injectable()
export class EverscaleClientVcManagementService extends EverscaleClientBaseService {
  constructor() {
    super();
  }

  async issuerVC(claims: ClaimsGroup[], issuerPubKey: string): Promise<Did> {
    const contractAccount = await this.getContractAccount(EverscaleAvailableContracts.idxVcFabric);
    const vc = await contractAccount.run('issueVc', {
      claims: claims,
      issuerPubKey: issuerPubKey,
    });
    const vcDidAddress = vc.decoded?.output.vcAddress;
    await contractAccount.free();

    return vcDidAddress;
  }
}
