"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortCBA = exports.sortABC = exports.set = exports.get = void 0;
function get(obj, path) {
    if (typeof path === 'string')
        path = path.split('.').filter((key) => key.length);
    return path.reduce((dive, key) => dive && dive[key], obj);
}
exports.get = get;
function set(obj, path, value) {
    if (Object(obj) !== obj)
        return obj;
    if (!Array.isArray(path))
        path = path.toString().match(/[^.[\]]+/g) || [];
    path.slice(0, -1).reduce((a, c, i) => Object(a[c]) === a[c] ? a[c] : (a[c] = Math.abs(path[i + 1]) >> 0 === +path[i + 1] ? [] : {}), obj)[path[path.length - 1]] = value;
    return obj;
}
exports.set = set;
async function sortABC(obj, field) {
    return obj.sort((a, b) => (a[field] > b[field] ? 1 : -1));
}
exports.sortABC = sortABC;
async function sortCBA(obj, field) {
    return obj.sort((a, b) => (a[field] < b[field] ? 1 : -1));
}
exports.sortCBA = sortCBA;
//# sourceMappingURL=object.helpers.js.map