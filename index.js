"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function combine(target) {
    var traits = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        traits[_i - 1] = arguments[_i];
    }
    var classes = [target].concat(traits).reverse();
    var superClass = function Combine() {
        var _this = this;
        var arg = arguments;
        classes.forEach(function (mixinClass) {
            mixinClass.apply(_this, arg);
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
    applyMixins(superClass.prototype, classes);
    return superClass;
}
exports.combine = combine;
function applyMixins(superProto, baseCtors) {
    baseCtors.forEach(function (baseCtor) {
        applyProtoMixins(superProto, baseCtor.prototype);
    });
}
/* 深度优先 ，子类覆盖父类*/
function applyProtoMixins(proto, baseProto) {
    var superProto = Object.getPrototypeOf(baseProto);
    if (superProto === Object.prototype || superProto === null) {
        mixins(proto, baseProto);
    }
    else {
        applyProtoMixins(proto, superProto);
        mixins(proto, baseProto);
    }
}
function mixins(proto, baseProto) {
    var keys = Object.getOwnPropertyNames(baseProto);
    var len = keys.length, key;
    while (len--) {
        key = keys[len];
        if (key === 'constructor') {
            return;
        }
        var desc = Object.getOwnPropertyDescriptor(baseProto, key);
        if (desc) {
            Object.defineProperty(proto, key, desc);
        }
    }
}
exports.default = combine;
