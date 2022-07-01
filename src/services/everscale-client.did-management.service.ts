import { Injectable } from '@nestjs/common';

import { Did, EverscaleAvailableContracts } from '../types/everscale.types';
import { EverscaleClientBaseService } from './everscale-client.base.service';

@Injectable()
export class EverscaleClientDidManagementService extends EverscaleClientBaseService {
  constructor() {
    super();
  }

  async generateKeys(): Promise<{ public: string; secret: string }> {
    return await this.tonClient!.crypto.generate_random_sign_keys();
  }

  /**
   * https://github.com/tonlabs/ever-sdk-js/blob/c2ebf34ebb5e58d0b531baab322a3bb358502055/packages/tests/src/tests/crypto.ts
   *
   * @param input
   */
  async signMessage(input: {
    message: string;
    keys: { public: string; secret: string };
  }): Promise<{ signed: string; signature: string }> {
    const { message, keys } = input;

    return this.tonClient!.crypto.sign({ keys, unsigned: this.text2base64(message) });
  }

  /**
   * https://github.com/tonlabs/ever-sdk-js/blob/c2ebf34ebb5e58d0b531baab322a3bb358502055/packages/tests/src/tests/crypto.ts
   *
   * @param input
   */
  async verifySignature(input: {
    signed: string;
    message: string;
    publicKey: string;
  }): Promise<boolean> {
    const { signed, message, publicKey } = input;

    const result = await this.tonClient!.crypto.verify_signature({
      public: publicKey,
      signed,
    });

    return result.unsigned === this.text2base64(message);
  }

  async getDidDocumentPublicKey(): Promise<string> {
    const contractAccount = await this.getContractAccount(
      EverscaleAvailableContracts.idxDidDocument,
    );
    const res = await contractAccount.runLocal('getSubjectPubKey', {});
    await contractAccount.free();
    return res.decoded?.output.value0;
  }

  async issueDidDocument(publicKey: string): Promise<Did> {
    const contractAccount = await this.getContractAccount(
      EverscaleAvailableContracts.idxDidRegistry,
    );
    const newDidDoc = await contractAccount.run('issueDidDoc', {
      answerId: 0,
      subjectPubKey: `0x${publicKey}`,
      salt: '0',
      didController: '0:0000000000000000000000000000000000000000000000000000000000000000',
    });
    const newDidAddress = newDidDoc.decoded?.output.didDocAddr;
    await contractAccount.free();

    return newDidAddress;
  }

  private text2base64(text: string): string {
    return Buffer.from(text, 'utf8').toString('base64');
  }
}
