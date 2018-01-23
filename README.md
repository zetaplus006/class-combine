# 类型混合

change from  https://github.com/Microsoft/TypeScript/pull/13743#issuecomment-299540915

```typescript
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

    // B和C可以视为java中带有默认实现的接口
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
```