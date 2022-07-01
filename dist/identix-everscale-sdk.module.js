"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var IdentixEverscaleSdkModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdentixEverscaleSdkModule = void 0;
const common_1 = require("@nestjs/common");
const everscale_client_provider_1 = require("./providers/everscale-client.provider");
const everscale_client_did_management_service_1 = require("./services/everscale-client.did-management.service");
const everscale_client_vc_management_service_1 = require("./services/everscale-client.vc-management.service");
const everscale_client_transactions_service_1 = require("./services/everscale-client.transactions.service");
const everscale_client_transfers_service_1 = require("./services/everscale-client.transfers.service");
let IdentixEverscaleSdkModule = IdentixEverscaleSdkModule_1 = class IdentixEverscaleSdkModule {
    static forRoot(everscaleClientConfiguration) {
        const EverscaleClientProvider = (0, everscale_client_provider_1.everscaleClientProviderFactory)(everscaleClientConfiguration);
        return {
            module: IdentixEverscaleSdkModule_1,
            imports: [],
            providers: [
                EverscaleClientProvider,
                everscale_client_did_management_service_1.EverscaleClientDidManagementService,
                everscale_client_vc_management_service_1.EverscaleClientVcManagementService,
                everscale_client_transfers_service_1.EverscaleClientTransfersService,
                everscale_client_transactions_service_1.EverscaleClientTransactionsService,
            ],
            controllers: [],
            exports: [EverscaleClientProvider],
        };
    }
};
IdentixEverscaleSdkModule = IdentixEverscaleSdkModule_1 = __decorate([
    (0, common_1.Module)({})
], IdentixEverscaleSdkModule);
exports.IdentixEverscaleSdkModule = IdentixEverscaleSdkModule;
//# sourceMappingURL=identix-everscale-sdk.module.js.map