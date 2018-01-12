"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
    mixinStatic(superClass, classes);
    return superClass;
}
exports.compose = compose;
function applyProtoMixins(proto, baseProto) {
    if (baseProto !== Object.prototype && baseProto !== null) {
        mixins(proto, baseProto);
        var superProto = Object.getPrototypeOf(baseProto);
        applyProtoMixins(proto, superProto);
    }
}
function mixins(proto, baseProto) {
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
function mixinStatic(target, bases) {
    bases.forEach(function (base) {
        for (var key in base) {
            if (!target.hasOwnProperty(key)) {
                target[key] = base[key];
            }
        }
    });
}
function skipBabelClassCheck(fn) {
    if (process.env.COMPOSE_ENV !== 'babel') {
        fn();
        return;
    }
    var babelCheck = require('babel-runtime/helpers/classCallCheck.js');
    var checkFn = babelCheck.default;
    try {
        // tslint:disable-next-line:no-empty
        babelCheck.default = function () { };
        fn();
    }
    finally {
        babelCheck.default = checkFn;
    }
}
exports.default = compose;
