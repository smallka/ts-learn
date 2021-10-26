export {}
console.log("------------------ learn-events2 ------------------")

import {createEvents} from "./events2";


type Events = {
    set: {name: string, count: number},
    tick: number,
    tupl: [number, string],
    bar: null,
}

const emitter = createEvents<Events>()


emitter.on('set', (event)=>{console.log(`alice recv object, count = ${event.count}`)})

// WRONG emitter.emit('set', {name: 'prop'})
// WRONG emitter.emit('set', {name: 'prop', count: 1, more: 5})
emitter.emit('set', {name: 'prop', count: 1})

emitter.on('set', (event)=>{console.log(`bob recv object, count = ${event.count}`)})
emitter.on('set', ()=>{console.log(`sad recv object without arguments`)})

emitter.emit('set', {name: 'prop', count: 2})

emitter.on('tupl', ([num, str])=>{console.log(`foo recv tuple, count = ${num}`)})
emitter.emit('tupl', [3, 'apple'])


function onTick(dt: number)
{
    console.log(`tick dt = ${dt}`)
}
emitter.on('tick', onTick)
emitter.emit('tick', 3.14)
emitter.off('tick', onTick)
emitter.emit('tick', 6.28)

emitter.on('bar', (val)=>{console.log(`mike recv bar val=${val}`)})
emitter.emit('bar', null)
// WRONG emitter.emit('bar')

/* output
alice recv object, count = 1
alice recv object, count = 2
bob recv object, count = 2
sad recv object without arguments
foo recv tuple, count = 3
tick dt = 3.14
mike recv bar, count = 6.28
mike recv bar, count = undefined
*/