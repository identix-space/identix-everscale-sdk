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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EverscaleClientTransactionsService = void 0;
const common_1 = require("@nestjs/common");
const everscale_client_base_service_1 = require("./everscale-client.base.service");
const object_helpers_1 = require("../helpers/object.helpers");
const axios_1 = require("axios");
let EverscaleClientTransactionsService = class EverscaleClientTransactionsService extends everscale_client_base_service_1.EverscaleClientBaseService {
    constructor() {
        super();
    }
    async getTokenTransactions(token, limit = 10) {
        var _a, _b, _c;
        const data = { offset: 0, limit, token };
        const everscaleTokensAPIUrl = (_c = (_b = (_a = this.everscaleClientConfig) === null || _a === void 0 ? void 0 : _a.api) === null || _b === void 0 ? void 0 : _b.tokens) === null || _c === void 0 ? void 0 : _c.url;
        if (!everscaleTokensAPIUrl) {
            throw new Error('Everscale tokens API url is undefined');
        }
        const response = await axios_1.default.post(`${everscaleTokensAPIUrl}/transactions`, data, {
            headers: { 'Content-Type': 'application/json' },
        });
        if (!response || !response.data) {
            return [];
        }
        const transactions = (0, object_helpers_1.get)(response.data, 'transactions');
        return Array.isArray(transactions) ? transactions : [];
    }
    async checkTokensTransactions(address, tokens, lookLastTransactionsNumber, lookPeriodAgoInSec) {
        var e_1, _a;
        var _b, _c, _d, _e, _f, _g;
        try {
            for (var tokens_1 = __asyncValues(tokens), tokens_1_1; tokens_1_1 = await tokens_1.next(), !tokens_1_1.done;) {
                const token = tokens_1_1.value;
                const { title: tokenTitle, ownerTransferType, operationKind } = token;
                const applyLookLastTransactionsNumber = lookLastTransactionsNumber ||
                    ((_d = (_c = (_b = this.everscaleClientConfig) === null || _b === void 0 ? void 0 : _b.api) === null || _c === void 0 ? void 0 : _c.tokens) === null || _d === void 0 ? void 0 : _d.lookLastTransactionsNumber) ||
                    1000;
                const applyLookPeriodAgoInSec = lookPeriodAgoInSec || ((_g = (_f = (_e = this.everscaleClientConfig) === null || _e === void 0 ? void 0 : _e.api) === null || _f === void 0 ? void 0 : _f.tokens) === null || _g === void 0 ? void 0 : _g.lookPeriodAgoInSec) || 600;
                const tokenTransactions = await this.getTokenTransactions(tokenTitle, applyLookLastTransactionsNumber);
                const userTokenTransactions = (Array.isArray(tokenTransactions) &&
                    tokenTransactions.filter((transaction) => {
                        var _a, _b;
                        const transactionOwnerAddress = ownerTransferType === 'send'
                            ? (_a = transaction.sender) === null || _a === void 0 ? void 0 : _a.ownerAddress
                            : (_b = transaction.receiver) === null || _b === void 0 ? void 0 : _b.ownerAddress;
                        const checkTransactionInSearchPeriod = new Date().getTime() - transaction.blockTime <
                            applyLookPeriodAgoInSec * 1000;
                        return (transactionOwnerAddress === address &&
                            transaction.kind === operationKind &&
                            checkTransactionInSearchPeriod);
                    })) ||
                    [];
                if (userTokenTransactions.length === 0) {
                    return false;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (tokens_1_1 && !tokens_1_1.done && (_a = tokens_1.return)) await _a.call(tokens_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return true;
    }
};
EverscaleClientTransactionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], EverscaleClientTransactionsService);
exports.EverscaleClientTransactionsService = EverscaleClientTransactionsService;
//# sourceMappingURL=everscale-client.transactions.service.js.map