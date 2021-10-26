export {}
console.log('------------------ learn-ecs2 ------------------')

import {createEvents, Emitter, EventHandler} from './events2';

type EntityInfo = {name: string, typeId: number}
type SystemEvents = {
    update: number,
    onAddEntity: EntityInfo,
}

class PhysicsSystem
{
    private ecs: ECS
    constructor(ecs_: ECS)
    {
        this.ecs = ecs_
        ecs.on('update', this.update.bind(this))
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
        ecs.on('update', this.update.bind(this))
        ecs.on('onAddEntity', this.onAddEntity.bind(this))
    }

    update(this: this, dt: number): void
    {
        console.log(`${this.ecs.name} call AOI: update ${dt} radius=${this.radius}`)
    }

    onAddEntity(this: this, entity: EntityInfo): void
    {
        console.log(`${this.ecs.name} call AOI: onAddEntity ${entity.name}`)
    }
}

class ECS
{
    name: string
    emitter: Emitter<SystemEvents>

    constructor(givenName: string)
    {
        this.name = givenName
        this.emitter = createEvents<SystemEvents>()
    }

    on<K extends keyof SystemEvents>(this: this, eventType: K, handler: EventHandler<SystemEvents[K]>)
    {
        return this.emitter.on(eventType, handler)
    }

    emit<K extends keyof SystemEvents>(this: this, eventType: K, event: SystemEvents[K]): void
    {
        this.emitter.emit(eventType, event)
    }
}

let ecs = new ECS('ecs')
new PhysicsSystem(ecs)
new AOISystem(ecs, 2.5)

ecs.emit('update', 101)

ecs.emit('onAddEntity', {name: 'alice', typeId: 1001})

console.log(ecs.emitter.events)
