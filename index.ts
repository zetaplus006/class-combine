export type Class<T> = {
    new(): T
}

function compose<U, T1, T2, T3, T4, T5, T6>(target: Class<U>, trait1: Class<T1>, trait2: Class<T2>, trait3: Class<T3>, trait4: Class<T4>, trait5: Class<T5>, trait6: Class<T6>): Class<U & T1 & T2 & T3 & T4 & T5 & T6>;
function compose<U, T1, T2, T3, T4, T5>(target: Class<U>, trait1: Class<T1>, trait2: Class<T2>, trait3: Class<T3>, trait4: Class<T4>, trait5: Class<T5>): Class<U & T1 & T2 & T3 & T4 & T5>;
function compose<U, T1, T2, T3, T4>(target: Class<U>, trait1: Class<T1>, trait2: Class<T2>, trait3: Class<T3>, trait4: Class<T4>): Class<U & T1 & T2 & T3 & T4>;
function compose<U, T1, T2, T3>(target: Class<U>, trait1: Class<T1>, trait2: Class<T2>, trait3: Class<T3>): Class<U & T1 & T2 & T3>;
function compose<U, T1, T2>(target: Class<U>, trait1: Class<T1>, trait2: Class<T2>): Class<U & T1 & T2>;
function compose<U, T1>(target: Class<U>, trait1: Class<T1>): Class<U & T1>;
function compose<U>(target: Class<U>): Class<U>;
function compose (target: Class<any>, ...traits: Class<any>[]): any {
    const classes = [target].concat(traits).reverse();

    const superClass = function ComposeClass (this: any) {
        const arg = arguments;
        skipBabelClassCheck(() => {
            classes.forEach(mixinClass => {
                mixinClass.apply(this, arg);
            });
        })
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

    //todo 静态方法    

    return superClass;
}

function applyMixins (superProto: any, baseCtors: Class<any>[]) {
    baseCtors.forEach(baseCtor => {
        applyProtoMixins(superProto, baseCtor.prototype);
    });
}

/* 深度优先 ，子类覆盖父类*/
function applyProtoMixins (proto: any, baseProto: Class<any>) {
    const superProto = Object.getPrototypeOf(baseProto);
    if (superProto === Object.prototype || superProto === null) {
        mixins(proto, baseProto);
    } else {
        applyProtoMixins(proto, superProto);
        mixins(proto, baseProto);
    }
}

function mixins (proto: any, baseProto: any) {
    const keys = Object.getOwnPropertyNames(baseProto);
    let len = keys.length, key;
    while (len--) {
        key = keys[len];
        if (key === 'constructor') {
            return;
        }
        const desc = Object.getOwnPropertyDescriptor(baseProto, key);
        if (desc) {
            Object.defineProperty(proto, key, desc);
        }
    }
}

function skipBabelClassCheck (fn: () => void) {
    if (process.env.COMPOSE_ENV !== 'babel') {
        fn()
        return
    }
    const babelCheck = require('babel-runtime/helpers/classCallCheck.js')
    const checkFn = babelCheck.default
    try {
        // tslint:disable-next-line:no-empty
        babelCheck.default = function () { }
        fn()
    } finally {
        babelCheck.default = checkFn
    }
}

export default compose;
export {
    compose
}
