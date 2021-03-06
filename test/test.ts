import test from 'ava'
import mix from '../index'

test((t) => {

    class A {
        text = 'A'

        get A () {
            return 'A'
        }

        method_A () {
            return 'A'
        }

        static a = 'a'
    }

    class B {
        text = 'B'

        get B () {
            return 'B'
        }

        method_B () {
            return 'B'
        }

        static b = 'b'
    }

    class C {
        text = 'C'

        get C () {
            return 'C'
        }

        method_C () {
            return 'C'
        }

        static c = 'c'
    }

    class S extends mix(A).with(B, C) {

    }

    const obj = new S();

    t.true(obj instanceof A)
    t.false(obj instanceof B)
    t.false(obj instanceof C)

    //property
    t.true(obj.text === 'A')
    t.false(obj.text === 'B')
    t.false(obj.text === 'C')

    //getter
    t.true(obj.A === 'A')
    t.true(obj.B === 'B')
    t.true(obj.C === 'C')

    //method
    t.true(obj.method_A() === 'A')
    t.true(obj.method_B() === 'B')
    t.true(obj.method_C() === 'C')

    //static
    t.true(S.a === 'a')
    t.true(S.b === 'b')
    t.true(S.c === 'c')

});


test((t) => {

    class A {
        text = 'A'

        A = 'A'

        constructor () {

        }

        get getter () {
            return 'A'
        }

        method_A () {
            return 'A'
        }
        static staticA = true
    }

    class B extends A {
        text = 'B'

        get getter () {
            return 'B'
        }

        method_B () {
            return 'B'
        }
        static staticB = true
    }

    class C {
        static staticC = true
    }

    class S extends mix(C).with(B) {

    }

    const obj = new S();

    t.true(obj instanceof C)
    t.false(obj instanceof B)

    //property
    t.true(obj.text === 'B')
    t.true(obj.A === 'A')

    //getter
    t.true(obj.getter === 'B')

    //method
    t.true(obj.method_A() === 'A')
    t.true(obj.method_B() === 'B')

    t.true(S.staticA)
    t.true(S.staticB)
    t.true(S.staticC)
});
