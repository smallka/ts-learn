export {}

let a : 5 = 5
console.log("a = " + typeof(a))
const b = 5
console.log("b = " + typeof(b))
let c = 5
console.log("c = " + typeof(c))

type Opt = {
    name: string
    oldname?: string
}

function f(opt : Opt) {
    console.log(opt)
}

f({
    name: "hello",
})

f({
     name: "hello",
     oldname: "oldname",
})

f({
    name: "hello",
    extra: "extra1",
} as Opt)

let extraOpt = {
    name: "hello",
    extra: "extra2",
}
f(extraOpt)


/*
let wrongOpt: Opt = {
    name: "hello",
    extta: "wrong",
}
f(opt)
*/

let extraOpt3 = {
    name: "hello",
    extra: "extra3",
}
let opt3 : Opt = extraOpt3
f(opt3)