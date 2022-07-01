"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readFileAsBase64 = exports.readFileAsUTF8 = exports.getDirectoryFilesList = void 0;
const fs_1 = require("fs");
const util_1 = require("util");
const path_1 = require("path");
const readdirAsync = (0, util_1.promisify)(fs_1.readdir);
const readFileAsync = (0, util_1.promisify)(fs_1.readFile);
async function getDirectoryFilesList(path) {
    const filepath = (0, path_1.resolve)(process.cwd(), `./${path}`);
    return await readdirAsync(filepath);
}
exports.getDirectoryFilesList = getDirectoryFilesList;
async function readFileAsUTF8(absFilePath) {
    return (await readFileAsync(absFilePath)).toString('utf-8');
}
exports.readFileAsUTF8 = readFileAsUTF8;
async function readFileAsBase64(absFilePath) {
    return (await readFileAsync(absFilePath)).toString('base64');
}
exports.readFileAsBase64 = readFileAsBase64;
//# sourceMappingURL=files.helpers.js.map