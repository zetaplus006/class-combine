import test from 'ava'
import compose from '../index'

test((t) => {

    class A {
        text = 'A'

        get A () {
            return 'A'
        }

        method_A () {
            return 'A'
        }
    }

    class B {
        text = 'B'

        get B () {
            return 'B'
        }

        method_B () {
            return 'B'
        }
    }

    class C {
        text = 'C'

        get C () {
            return 'C'
        }

        method_C () {
            return 'C'
        }
    }

    const S = compose(A, B, C)

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

    class S extends compose(C, B) {

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

    t.true(S['staticA'])
    t.true(S['staticB'])
    t.true(S['staticC'])
});