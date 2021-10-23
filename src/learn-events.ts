export {}
console.log("------------------ learn-events ------------------")

import {createEvents} from "./events";


interface Events {
    set: (name: string, count: number) => void,
    tick: () => void
}

const emitter = createEvents<Events>()

emitter.emit('set', 'prop', 1)

let handler = emitter.on('set', (name, count)=>{console.log(`alice recv count = ${count}`)})

emitter.emit('set', 'prop', 2)

emitter.on('set', (name, count)=>{console.log(`bob recv count = ${count}`)})

emitter.emit('set', 'prop', 3)

emitter.off('set', handler)

emitter.emit('set', 'prop', 4)

emitter.emit('tick')

/* output
alice recv count = 2
alice recv count = 3
bob recv count = 3
bob recv count = 4
*/