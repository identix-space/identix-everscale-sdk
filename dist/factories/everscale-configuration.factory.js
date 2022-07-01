"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (everscaleClientConfiguration) => {
    return (0, config_1.registerAs)('everscale-client-configuration', () => everscaleClientConfiguration);
};
//# sourceMappingURL=everscale-configuration.factory.js.map