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
exports.EverscaleClientVcManagementService = void 0;
const common_1 = require("@nestjs/common");
const everscale_types_1 = require("../types/everscale.types");
const everscale_client_base_service_1 = require("./everscale-client.base.service");
let EverscaleClientVcManagementService = class EverscaleClientVcManagementService extends everscale_client_base_service_1.EverscaleClientBaseService {
    constructor() {
        super();
    }
    async issuerVC(claims, issuerPubKey) {
        var _a;
        const contractAccount = await this.getContractAccount(everscale_types_1.EverscaleAvailableContracts.idxVcFabric);
        const vc = await contractAccount.run('issueVc', {
            claims: claims,
            issuerPubKey: issuerPubKey,
        });
        const vcDidAddress = (_a = vc.decoded) === null || _a === void 0 ? void 0 : _a.output.vcAddress;
        await contractAccount.free();
        return vcDidAddress;
    }
};
EverscaleClientVcManagementService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], EverscaleClientVcManagementService);
exports.EverscaleClientVcManagementService = EverscaleClientVcManagementService;
//# sourceMappingURL=everscale-client.vc-management.service.js.map