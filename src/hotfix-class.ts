export {}
console.log("------------------ hotfix-class ------------------")

class A
{
    private static readonly zero = 0
    public val: number
    public constructor(val: number)
    {
        this.val = val
    }
    public add(other: number)
    {
        this.val += other
    }
    public static addition(p: number, q: number)
    {
        return p + q
    }
    public static getZero()
    {
        return A.zero
    }
    private innerAdd(other: number)
    {
        this.val += other
    }
}

let a = new A(10)
a.add(3)
console.log(a.val)

let cb = a.add.bind(a)
cb(2)
console.log(a.val)
console.log(`zero: ${A.getZero()}`)
console.log(`addition: ${A.addition(6, 4)}`)

console.log(A.prototype.add)

function add2(this: A, other: number)
{
    this.val -= other
}

A.prototype.add = add2
A.addition = (p: number, q: number) =>
{
    return p - q
}
// 属性绕过private和const
(<any>A).zero = 100;
// 方法绕过private
(<any>(A.prototype)).innerAdd = add2;

a.add(3)
console.log(a.val)
cb(2)  // not working
console.log(a.val)
console.log(`zero: ${A.getZero()}`)
console.log(`addition: ${A.addition(6, 4)}`)

console.log(A.prototype.add)

