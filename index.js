"use strict";
/*
 change from  https://github.com/Microsoft/TypeScript/pull/13743#issuecomment-299540915
*/
Object.defineProperty(exports, "__esModule", { value: true });
/* 为了推断 typeof T ，防止tsc报错 */
function mix(superclass) {
    if (superclass === void 0) { superclass = /** @class */ (function () {
        function class_1() {
        }
        return class_1;
    }()); }
    return new MixinBuilder(superclass);
}
exports.mix = mix;
var MixinBuilder = /** @class */ (function () {
    function MixinBuilder(superclass) {
        this.superclass = superclass;
    }
    MixinBuilder.prototype.with = function () {
        var mixins = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            mixins[_i] = arguments[_i];
        }
        return compose.apply(void 0, [this.superclass].concat(mixins));
    };
    return MixinBuilder;
}());
exports.MixinBuilder = MixinBuilder;
function compose(target) {
    var traits = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        traits[_i - 1] = arguments[_i];
    }
    var classes = [target].concat(traits);
    var superClass = function ComposeClass() {
        var _this = this;
        var arg = arguments;
        skipBabelClassCheck(function () {
            var len = classes.length;
            while (len--) {
                classes[len].apply(_this, arg);
            }
        });
    };
    superClass.prototype = Object.create(target.prototype, {
        constructor: {
            value: target,
            writable: true,
            enumerable: false,
            configurable: false
        }
    });
    classes.forEach(function (baseCtor) {
        applyProtoMixins(superClass.prototype, baseCtor.prototype);
    });
    mixinsStatic(superClass, classes);
    return superClass;
}
function applyProtoMixins(proto, baseProto) {
    if (baseProto !== Object.prototype && baseProto !== null) {
        mixinsToProto(proto, baseProto);
        var superProto = Object.getPrototypeOf(baseProto);
        applyProtoMixins(proto, superProto);
    }
}
function mixinsToProto(proto, baseProto) {
    var keys = Object.getOwnPropertyNames(baseProto);
    var len = keys.length, key;
    while (len--) {
        key = keys[len];
        /*子类覆盖父类 ,前面参数的优先级大于后面的，可以视为多重继承*/
        if (proto.hasOwnProperty(key)) {
            return;
        }
        var desc = Object.getOwnPropertyDescriptor(baseProto, key);
        if (desc) {
            Object.defineProperty(proto, key, desc);
        }
    }
}
function mixinsStatic(target, bases) {
    bases.forEach(function (base) {
        for (var key in base) {
            if (!target.hasOwnProperty(key)) {
                target[key] = base[key];
            }
        }
    });
}
/**
 * 跳过babel编译器的instanceof检查
 * @param fn
 */
var skipBabelClassCheck = process.env.COMPOSE_ENV !== 'babel'
    ?
        function (fn) { return fn(); }
    :
        function (fn) {
            var babelCheck = require('babel-runtime/helpers/classCallCheck.js');
            var checkFn = babelCheck.default;
            try {
                // tslint:disable-next-line:no-empty
                babelCheck.default = function () { };
                return fn();
            }
            finally {
                babelCheck.default = checkFn;
            }
        };
exports.default = mix;
