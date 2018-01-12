export type Class<T> = {
    new(...arg: any[]): T
    /* 找不到方法推断静态成员 */
    [key: string]: any
}
/* 
https://github.com/Microsoft/TypeScript/pull/13743
*/

/**
 * 不支持推断静态成员类型
 */
function compose<U, T1, T2, T3, T4, T5, T6>(target: Class<U>, trait1: Class<T1>, trait2: Class<T2>, trait3: Class<T3>, trait4: Class<T4>, trait5: Class<T5>, trait6: Class<T6>): Class<U & T1 & T2 & T3 & T4 & T5 & T6>;
function compose<U, T1, T2, T3, T4, T5>(target: Class<U>, trait1: Class<T1>, trait2: Class<T2>, trait3: Class<T3>, trait4: Class<T4>, trait5: Class<T5>): Class<U & T1 & T2 & T3 & T4 & T5>;
function compose<U, T1, T2, T3, T4>(target: Class<U>, trait1: Class<T1>, trait2: Class<T2>, trait3: Class<T3>, trait4: Class<T4>): Class<U & T1 & T2 & T3 & T4>;
function compose<U, T1, T2, T3>(target: Class<U>, trait1: Class<T1>, trait2: Class<T2>, trait3: Class<T3>): Class<U & T1 & T2 & T3>;
function compose<U, T1, T2>(target: Class<U>, trait1: Class<T1>, trait2: Class<T2>): Class<U & T1 & T2>;
function compose<U, T1>(target: Class<U>, trait1: Class<T1>): Class<U & T1>;
function compose<U>(target: Class<U>): Class<U>;
function compose (target: Class<any>, ...traits: Class<any>[]): any {
    const classes = [target].concat(traits);

    const superClass = function ComposeClass (this: any) {
        const arg = arguments;
        skipBabelClassCheck(() => {
            let len = classes.length;
            while (len--) {
                classes[len].apply(this, arg);
            }
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

    classes.forEach(baseCtor => {
        applyProtoMixins(superClass.prototype, baseCtor.prototype);
    });

    mixinStatic(superClass, classes)

    return superClass;
}

function applyProtoMixins (proto: any, baseProto: Class<any>) {
    if (baseProto !== Object.prototype && baseProto !== null) {
        mixins(proto, baseProto);
        const superProto = Object.getPrototypeOf(baseProto);
        applyProtoMixins(proto, superProto);
    }
}

function mixins (proto: Object, baseProto: any) {
    const keys = Object.getOwnPropertyNames(baseProto);
    let len = keys.length, key;
    while (len--) {
        key = keys[len];
        /*子类覆盖父类 ,前面参数的优先级大于后面的，可以视为多重继承*/
        if (proto.hasOwnProperty(key)) {
            return;
        }
        const desc = Object.getOwnPropertyDescriptor(baseProto, key);
        if (desc) {
            Object.defineProperty(proto, key, desc);
        }
    }
}

function mixinStatic (target: any, bases: Class<any>[]) {
    bases.forEach(base => {
        for (const key in base) {
            if (!target.hasOwnProperty(key)) {
                target[key] = base[key]
            }
        }
    })
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