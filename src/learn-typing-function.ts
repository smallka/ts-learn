export {}
console.log("------------------ learn-typing-function ------------------")


// ------------ 函数子类型
type Mixed = number | string

type Number2String = (v: number) => string
type Mixed2String = (v: Mixed) => string
type Number2Mixed = (v: number) => Mixed 

let number2String: Number2String = (v: number) => {
    return v.toString()
}

let mixed2String: Mixed2String = (v: Mixed) => {
    if (typeof v == "number") {
        return number2String(v)
    }
    return v
}

let number2Mixed: Number2Mixed = (v: number) => {
    if (v > 0) {
        return number2String(v)
    }
    return v
}

// 函数子类型的条件1：参数必须是父类型
let good1: Number2String = mixed2String
// WRONG let bad1: Mixed2String = number2String

// 函数子类型的条件2：返回值必须是子类型
let good2: Number2Mixed = number2String
// WRONG let bad2: Number2String = number2Mixed

// ---------- 剩余参数的类型推导
function tuple<T extends unknown[]>(...ts: T) : T {
	return ts
}

let a = [1, true]  // (number|boolean)[]
let b = tuple(1, true)  // [number, boolean]

function callFunction<T extends unknown[]>(
    f: (...args: T) => void,
    ...args: T
): void {
    f(...args)
}

function test(num: number, str: string) {
    console.log(num + str)
}
callFunction(test, 2, "haha")
// WRONG callFunction(test, 2)
// WRONG callFunction(test, 2, 3)