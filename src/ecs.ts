export {}
console.log('------------------ learn-ecs ------------------')

import {createEvents, Emitter} from './events';

type SystemEvents = {
    update?: (dt: number) => void,
    onAddEntity?: (entity: string) => void,
}

class PhysicsSystem
{
    private ecs: ECS
    constructor(ecs_: ECS)
    {
        this.ecs = ecs_
        ecs.registerEvent('update', this.update.bind(this))
    }

    update(this: this, dt: number): void
    {
        console.log(`${this.ecs.name} call physics: update ${dt}`)
    }
}

class AOISystem
{
    private ecs: ECS
    private radius: number
    constructor(ecs_: ECS, radius_: number)
    {
        this.ecs = ecs_
        this.radius = radius_
        ecs.registerEvent('update', this.update.bind(this))
        ecs.registerEvent('onAddEntity', this.onAddEntity.bind(this))
    }

    update(this: this, dt: number): void
    {
        console.log(`${this.ecs.name} call AOI: update ${dt} radius=${this.radius}`)
    }

    onAddEntity(this: this, entity: string): void
    {
        console.log(`${this.ecs.name} call AOI: onAddEntity ${entity}`)
    }
}

class ECS
{
    name: string
    emitter: Emitter<SystemEvents>
    private systems: SystemEvents[] = []

    constructor(givenName: string)
    {
        this.name = givenName
        this.emitter = createEvents<SystemEvents>()
    }

    registerEvent<K extends keyof SystemEvents>(this: this, event: K, handler: SystemEvents[K]): void
    {
        this.emitter.on(event, handler)
    }
}

let ecs = new ECS('ecs')
new PhysicsSystem(ecs)
new AOISystem(ecs, 2.5)

ecs.emitter.emit('update', 101)

ecs.emitter.emit('onAddEntity', 'alice')

console.log(ecs.emitter.events)
