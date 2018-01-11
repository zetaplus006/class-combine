export declare type Class<T> = {
    new (): T;
};
declare function compose<U, T1, T2, T3, T4, T5, T6>(target: Class<U>, trait1: Class<T1>, trait2: Class<T2>, trait3: Class<T3>, trait4: Class<T4>, trait5: Class<T5>, trait6: Class<T6>): Class<U & T1 & T2 & T3 & T4 & T5 & T6>;
declare function compose<U, T1, T2, T3, T4, T5>(target: Class<U>, trait1: Class<T1>, trait2: Class<T2>, trait3: Class<T3>, trait4: Class<T4>, trait5: Class<T5>): Class<U & T1 & T2 & T3 & T4 & T5>;
declare function compose<U, T1, T2, T3, T4>(target: Class<U>, trait1: Class<T1>, trait2: Class<T2>, trait3: Class<T3>, trait4: Class<T4>): Class<U & T1 & T2 & T3 & T4>;
declare function compose<U, T1, T2, T3>(target: Class<U>, trait1: Class<T1>, trait2: Class<T2>, trait3: Class<T3>): Class<U & T1 & T2 & T3>;
declare function compose<U, T1, T2>(target: Class<U>, trait1: Class<T1>, trait2: Class<T2>): Class<U & T1 & T2>;
declare function compose<U, T1>(target: Class<U>, trait1: Class<T1>): Class<U & T1>;
declare function compose<U>(target: Class<U>): Class<U>;
export default compose;
export { compose };
