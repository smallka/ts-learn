export {}
console.log("------------------ hotfix-class ------------------")

class Root
{
    public constructor()
    {
        this.initForHotfix()
    }
    public initForHotfix()
    {
        // wait subclass override for hotfix
    }
}

class A extends Root
{
    private static readonly zero = 0
    public val: number
    public constructor(val: number)
    {
        super()
        this.val = val
        console.log('A.constructor')
    }
    public add(other: number)
    {
        console.log('call A.add');
        this.val += other
    }
    public static addition(p: number, q: number)
    {
        console.log('call A.addition');
        return p + q
    }
    public static getZero()
    {
        return A.zero
    }
    private innerAdd(other: number)
    {
        console.log('call A.innerAdd');
        this.val += other
    }
    protected mul(other: number)
    {
        console.log('call A.mul');
        this.val *= other
    }
}

console.log(Root.prototype)
console.log(Object.getOwnPropertyNames(Root))
console.log(Object.getOwnPropertyNames(Root.prototype))
console.log(A.prototype)
console.log(Object.getOwnPropertyNames(A))
console.log(Object.getOwnPropertyNames(A.prototype))

console.log('------ create A')
let a = new A(10)
a.add(3)
console.log(a.val)

let cb = a.add.bind(a)
cb(2)
console.log(a.val)
console.log(`zero: ${A.getZero()}`)
console.log(`addition: ${A.addition(6, 4)}`)
console.log(a)

console.log('------ start hotfix')
// hotfix方法
function add2(this: A, other: number)
{
    this.val -= other
}
A.prototype.add = add2;
// hotfix私有方法
(<any>(A.prototype)).innerAdd = add2;
// hotfix静态函数
A.addition = (p: number, q: number) =>
{
    return p - q
}
// hotfix静态属性，绕过private和const
(<any>A).zero = 100;
// hotfix增加新变量
function initForHotfix(this: A)
{
    (<any>this)['newVal'] = 255
}
A.prototype.initForHotfix = initForHotfix

a.add(3)
console.log(a.val)
cb(2)  // not working
console.log(a.val)
console.log(`zero: ${A.getZero()}`)
console.log(`addition: ${A.addition(6, 4)}`)
console.log(A.prototype.add)

console.log(A === A.prototype.constructor)
console.log(A.prototype)
console.log(Object.getOwnPropertyNames(A))
console.log(new A(2))

class B extends A
{
    public mul(other: number)
    {
        console.log('call mul');
        super.mul(other+1)
    }
}

let b = new B(2)
b.mul(5)
console.log(b.val)

function mul2(this: B, other: number)
{
    console.log('call mul2');
    // 调用父类函数
    (<any>(A.prototype)).mul.call(this, other)
}
// hotfix重载函数
B.prototype.mul = mul2

b.mul(5)
console.log(b.val)
