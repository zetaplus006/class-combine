export declare type Constructor<T> = new (...args: any[]) => T;
export declare type Properties<T> = {
    [K in keyof T]: T[K];
};
export declare type Class<P, T> = Properties<P> & Constructor<T>;
export declare function mix<T, U>(superclass?: U & Constructor<T>): MixinBuilder<T, U>;
export declare class MixinBuilder<T, U> {
    private superclass;
    constructor(superclass: U & Constructor<T>);
    with<P1, C1, P2, C2, P3, C3, P4, C4, P5, C5>(m1: Class<P1, C1>, m2: Class<P2, C2>, m3: Class<P3, C3>, m4: Class<P4, C4>, m5: Class<P5, C5>): U & P1 & P2 & P3 & P4 & P5 & Constructor<T & C1 & C2 & C3 & C4 & C5>;
    with<P1, C1, P2, C2, P3, C3, P4, C4>(m1: Class<P1, C1>, m2: Class<P2, C2>, m3: Class<P3, C3>, m4: Class<P4, C4>): U & P1 & P2 & P3 & P4 & Constructor<T & C1 & C2 & C3 & C4>;
    with<P1, C1, P2, C2, P3, C3>(m1: Class<P1, C1>, m2: Class<P2, C2>, m3: Class<P3, C3>): U & P1 & P2 & P3 & Constructor<T & C1 & C2 & C3>;
    with<P1, C1, P2, C2>(m1: Class<P1, C1>, m2: Class<P2, C2>): U & P1 & P2 & Constructor<T & C1 & C2>;
    with<P1, C1>(m1: Class<P1, C1>): U & P1 & Constructor<T & C1>;
}
export default mix;
