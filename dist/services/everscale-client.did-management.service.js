"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EverscaleClientDidManagementService = void 0;
const common_1 = require("@nestjs/common");
const everscale_types_1 = require("../types/everscale.types");
const everscale_client_base_service_1 = require("./everscale-client.base.service");
let EverscaleClientDidManagementService = class EverscaleClientDidManagementService extends everscale_client_base_service_1.EverscaleClientBaseService {
    constructor() {
        super();
    }
    async generateKeys() {
        return await this.tonClient.crypto.generate_random_sign_keys();
    }
    async signMessage(input) {
        const { message, keys } = input;
        return this.tonClient.crypto.sign({ keys, unsigned: this.text2base64(message) });
    }
    async verifySignature(input) {
        const { signed, message, publicKey } = input;
        const result = await this.tonClient.crypto.verify_signature({
            public: publicKey,
            signed,
        });
        return result.unsigned === this.text2base64(message);
    }
    async getDidDocumentPublicKey() {
        var _a;
        const contractAccount = await this.getContractAccount(everscale_types_1.EverscaleAvailableContracts.idxDidDocument);
        const res = await contractAccount.runLocal('getSubjectPubKey', {});
        await contractAccount.free();
        return (_a = res.decoded) === null || _a === void 0 ? void 0 : _a.output.value0;
    }
    async issueDidDocument(publicKey) {
        var _a;
        const contractAccount = await this.getContractAccount(everscale_types_1.EverscaleAvailableContracts.idxDidRegistry);
        const newDidDoc = await contractAccount.run('issueDidDoc', {
            answerId: 0,
            subjectPubKey: `0x${publicKey}`,
            salt: '0',
            didController: '0:0000000000000000000000000000000000000000000000000000000000000000',
        });
        const newDidAddress = (_a = newDidDoc.decoded) === null || _a === void 0 ? void 0 : _a.output.didDocAddr;
        await contractAccount.free();
        return newDidAddress;
    }
    text2base64(text) {
        return Buffer.from(text, 'utf8').toString('base64');
    }
};
EverscaleClientDidManagementService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], EverscaleClientDidManagementService);
exports.EverscaleClientDidManagementService = EverscaleClientDidManagementService;
//# sourceMappingURL=everscale-client.did-management.service.js.map