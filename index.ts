/* 
 change from  https://github.com/Microsoft/TypeScript/pull/13743#issuecomment-299540915
*/

export type Constructor<T> = new (...args: any[]) => T
export type Properties<T> = {[K in keyof T]: T[K]}
/* 通过Properties<P>反推 T 中的静态成员集合P*/
export type Class<P, T> = Properties<P> & Constructor<T>

/* 为了推断 typeof T ，防止tsc报错 */
export function mix<T, U>(superclass: U & Constructor<T> = class { } as U & Constructor<T>) {
    return new MixinBuilder<T, U>(superclass)
}

export class MixinBuilder<T, U> {
    private superclass: U & Constructor<T>
    constructor (superclass: U & Constructor<T>) {
        this.superclass = superclass
    }

    with<P1, C1, P2, C2, P3, C3, P4, C4, P5, C5>(m1: Class<P1, C1>, m2: Class<P2, C2>, m3: Class<P3, C3>, m4: Class<P4, C4>, m5: Class<P5, C5>)
        : U & P1 & P2 & P3 & P4 & P5 & Constructor<T & C1 & C2 & C3 & C4 & C5>
    with<P1, C1, P2, C2, P3, C3, P4, C4>(m1: Class<P1, C1>, m2: Class<P2, C2>, m3: Class<P3, C3>, m4: Class<P4, C4>)
        : U & P1 & P2 & P3 & P4 & Constructor<T & C1 & C2 & C3 & C4>
    with<P1, C1, P2, C2, P3, C3>(m1: Class<P1, C1>, m2: Class<P2, C2>, m3: Class<P3, C3>)
        : U & P1 & P2 & P3 & Constructor<T & C1 & C2 & C3>
    with<P1, C1, P2, C2>(m1: Class<P1, C1>, m2: Class<P2, C2>)
        : U & P1 & P2 & Constructor<T & C1 & C2>
    with<P1, C1>(m1: Class<P1, C1>)
        : U & P1 & Constructor<T & C1>
    with (...mixins: any[]): any {
        return compose(this.superclass, ...mixins)
    }
}
type IClass<T> = {
    new(...arg: any[]): T
    /* 找不到方法推断静态成员 */
    [key: string]: any
}

/**
 * 不支持推断静态成员类型,弃用此推断
 */
function compose<U, T1, T2, T3, T4, T5, T6>(target: IClass<U>, trait1: IClass<T1>, trait2: IClass<T2>, trait3: IClass<T3>, trait4: IClass<T4>, trait5: IClass<T5>, trait6: IClass<T6>): IClass<U & T1 & T2 & T3 & T4 & T5 & T6>;
function compose<U, T1, T2, T3, T4, T5>(target: IClass<U>, trait1: IClass<T1>, trait2: IClass<T2>, trait3: IClass<T3>, trait4: IClass<T4>, trait5: IClass<T5>): IClass<U & T1 & T2 & T3 & T4 & T5>;
function compose<U, T1, T2, T3, T4>(target: IClass<U>, trait1: IClass<T1>, trait2: IClass<T2>, trait3: IClass<T3>, trait4: IClass<T4>): IClass<U & T1 & T2 & T3 & T4>;
function compose<U, T1, T2, T3>(target: IClass<U>, trait1: IClass<T1>, trait2: IClass<T2>, trait3: IClass<T3>): IClass<U & T1 & T2 & T3>;
function compose<U, T1, T2>(target: IClass<U>, trait1: IClass<T1>, trait2: IClass<T2>): IClass<U & T1 & T2>;
function compose<U, T1>(target: IClass<U>, trait1: IClass<T1>): IClass<U & T1>;
function compose<U>(target: IClass<U>): IClass<U>;
function compose (target: IClass<any>, ...traits: IClass<any>[]): any {
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

    mixinsStatic(superClass, classes)

    return superClass;
}

function applyProtoMixins (proto: any, baseProto: IClass<any>) {
    if (baseProto !== Object.prototype && baseProto !== null) {
        mixinsProto(proto, baseProto);
        const superProto = Object.getPrototypeOf(baseProto);
        applyProtoMixins(proto, superProto);
    }
}

function mixinsProto (proto: Object, baseProto: any) {
    const keys = Object.getOwnPropertyNames(baseProto);
    let len = keys.length, key;
    while (len--) {
        key = keys[len];
        /*前面参数的优先级大于后面的*/
        if (proto.hasOwnProperty(key)) {
            return;
        }
        const desc = Object.getOwnPropertyDescriptor(baseProto, key);
        if (desc) {
            Object.defineProperty(proto, key, desc);
        }
    }
}

function mixinsStatic (target: any, bases: IClass<any>[]) {
    bases.forEach(base => {
        for (const key in base) {
            if (!target.hasOwnProperty(key)) {
                target[key] = base[key]
            }
        }
    })
}

/**
 * 跳过babel编译器的instanceof检查
 * @param fn 
 */
const skipBabelClassCheck = process.env.MIX_ENV !== 'babel'
    ?
    (fn: () => void) => fn()
    :
    function (fn: () => void) {
        const babelCheck = require('babel-runtime/helpers/classCallCheck.js')
        const checkFn = babelCheck.default
        try {
            // tslint:disable-next-line:no-empty
            babelCheck.default = function () { }
            return fn()
        } finally {
            babelCheck.default = checkFn
        }
    }

export default mix;
