export {}
console.log("------------------ learn-typing-object ------------------")

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


/* WRONG
let wrongOpt: Opt = {
    name: "hello",
    wrong: "wrong",
}
f(opt)
*/

let extraOpt3 = {
    name: "hello",
    extra: "extra3",
}
let opt3 : Opt = extraOpt3
f(opt3)

/* output
{ name: 'hello' }
{ name: 'hello', oldname: 'oldname' }
{ name: 'hello', extra: 'extra1' }
{ name: 'hello', extra: 'extra2' }
{ name: 'hello', extra: 'extra3' }
*/