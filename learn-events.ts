import {createEvents} from "./events";


interface Events {
    set: (name: string, count: number) => void,
    tick: () => void
}

const emitter = createEvents<Events>()

emitter.emit('set', 'prop', 1)

let unbind = emitter.on('set', (name, count)=>{console.log(`MONOTOR1 name = ${name}`)})

emitter.emit('set', 'prop', 1)

emitter.on('set', (name, count)=>{console.log(`MONOTOR2 name = ${name}`)})

emitter.emit('set', 'prop', 1)

unbind()

emitter.emit('set', 'prop', 1)

// MONOTOR1 name = prop
// MONOTOR1 name = prop
// MONOTOR2 name = prop
// MONOTOR1 name = prop
