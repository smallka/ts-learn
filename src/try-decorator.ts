export {}
console.log('------------------ try-decorator ------------------')

import {createEvents, EventHandler} from './ecs/events';

type SystemEvents = {
    foo: number,
    bar: string,
}

function event(event: keyof SystemEvents)
{
    return function(target: any, propertyKey: string, descriptor: PropertyDescriptor)
    {
        console.log(`collect event ${event} ${propertyKey}`)
        target.constructor.eventHandlers[event] = descriptor.value
    }
}

let systemEmitter = createEvents<SystemEvents>()

class A
{
    static eventHandlers: { [E in keyof SystemEvents]?: EventHandler<SystemEvents[E]> } = {}

    public name: string
    public constructor(name: string)
    {
        this.name = name
        
        let event: keyof SystemEvents
        for (event in A.eventHandlers)
        {
            console.log(`${this.name} register ${event}`)
            systemEmitter.on(event, A.eventHandlers[event]?.bind(this) as EventHandler<SystemEvents[typeof event]>)
        }
    }

    @event('foo')
    public foo(num: number)
    {
        console.log(`${this.name}.foo ${num}`)
    }

    @event('bar')
    public bar(wrong: boolean, more: string)
    {
        console.log(`${this.name}.bar ${wrong}<${typeof wrong}>`)
    }
}

console.log(A.eventHandlers)

let a = new A('alice')
let b = new A('bob')

systemEmitter.emit('foo', 10)
systemEmitter.emit('bar', 'hello')