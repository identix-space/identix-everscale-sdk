"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const object_helpers_1 = require("./object.helpers");
describe('Object helpers', () => {
    it('get() should return object property by path', () => {
        const obj = {
            a: {
                b: ['val1', 'val2', 3],
                c: 4,
            },
            d: [
                {
                    e: { g: 5, s: 'val6' },
                    f: {
                        e: 6,
                        k: ['val3', 'val4'],
                    },
                },
                'val5',
            ],
        };
        expect((0, object_helpers_1.get)(obj, 'a.b.0')).toBe('val1');
        expect((0, object_helpers_1.get)(obj, 'a.c')).toBe(4);
        expect((0, object_helpers_1.get)(obj, 'd.0.e')).toMatchObject({ g: 5, s: 'val6' });
        expect((0, object_helpers_1.get)(obj, 'd.0.f.e')).toBe(6);
        expect((0, object_helpers_1.get)(obj, 'd.1')).toBe('val5');
        expect((0, object_helpers_1.get)(obj, 'd.0.f.k')).toMatchObject(['val3', 'val4']);
    });
    it('set() should set object property by path', () => {
        const obj = {
            a: {
                b: ['val1', 'val2', 3],
                c: 4,
            },
        };
        (0, object_helpers_1.set)(obj, 'd.e.1.f', 3);
        const expectedObj = {
            a: {
                b: ['val1', 'val2', 3],
                c: 4,
            },
            d: {
                e: [undefined, { f: 3 }],
            },
        };
        expect(obj).toMatchObject(expectedObj);
    });
});
//# sourceMappingURL=object.helpers.spec.js.map