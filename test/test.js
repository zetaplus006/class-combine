"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var ava_1 = require("ava");
var index_1 = require("../index");
ava_1.default(function (t) {
    var A = /** @class */ (function () {
        function A() {
            this.text = 'A';
        }
        Object.defineProperty(A.prototype, "A", {
            get: function () {
                return 'A';
            },
            enumerable: true,
            configurable: true
        });
        A.prototype.method_A = function () {
            return 'A';
        };
        return A;
    }());
    var B = /** @class */ (function () {
        function B() {
            this.text = 'B';
        }
        Object.defineProperty(B.prototype, "B", {
            get: function () {
                return 'B';
            },
            enumerable: true,
            configurable: true
        });
        B.prototype.method_B = function () {
            return 'B';
        };
        return B;
    }());
    var C = /** @class */ (function () {
        function C() {
            this.text = 'C';
        }
        Object.defineProperty(C.prototype, "C", {
            get: function () {
                return 'C';
            },
            enumerable: true,
            configurable: true
        });
        C.prototype.method_C = function () {
            return 'C';
        };
        return C;
    }());
    var S = index_1.default(A, B, C);
    var obj = new S();
    t.true(obj instanceof A);
    t.false(obj instanceof B);
    t.false(obj instanceof C);
    //property
    t.true(obj.text === 'A');
    t.false(obj.text === 'B');
    t.false(obj.text === 'C');
    //getter
    t.true(obj.A === 'A');
    t.true(obj.B === 'B');
    t.true(obj.C === 'C');
    //method
    t.true(obj.method_A() === 'A');
    t.true(obj.method_B() === 'B');
    t.true(obj.method_C() === 'C');
});
ava_1.default(function (t) {
    var A = /** @class */ (function () {
        function A() {
            this.text = 'A';
            this.A = 'A';
        }
        Object.defineProperty(A.prototype, "getter", {
            get: function () {
                return 'A';
            },
            enumerable: true,
            configurable: true
        });
        A.prototype.method_A = function () {
            return 'A';
        };
        return A;
    }());
    var B = /** @class */ (function (_super) {
        __extends(B, _super);
        function B() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.text = 'B';
            return _this;
        }
        Object.defineProperty(B.prototype, "getter", {
            get: function () {
                return 'B';
            },
            enumerable: true,
            configurable: true
        });
        B.prototype.method_B = function () {
            return 'B';
        };
        return B;
    }(A));
    var C = /** @class */ (function () {
        function C() {
        }
        return C;
    }());
    var S = /** @class */ (function (_super) {
        __extends(S, _super);
        function S() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return S;
    }(index_1.default(C, B)));
    var obj = new S();
    t.true(obj instanceof C);
    t.false(obj instanceof B);
    //property
    t.true(obj.text === 'B');
    t.true(obj.A === 'A');
    //getter
    t.true(obj.getter === 'B');
    //method
    t.true(obj.method_A() === 'A');
    t.true(obj.method_B() === 'B');
});
