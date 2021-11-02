export {}
console.log('------------------ learn-ecs2 ------------------')

import {createEvents, Emitter, EventHandler} from './ecs/events';

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
        ecs.onEntityEvent('onDamage', 'player', this.onDamage)
    }

    update(this: this, dt: number): void
    {
        console.log(`${this.ecs.name} call physics: update ${dt}`)
    }
    onDamage(this: this, entity: Entity, damage: number): void
    {
        console.log(`on damage, entity=${entity.tags}, damage=${damage}`)
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

    onAddEntity(this: this, entity: EntityInfo): number
    {
        console.log(`${this.ecs.name} call AOI: onAddEntity ${entity.name}`)
        return 2;
    }
}

type Tags = 'player' | 'npc' | 'item'
class Entity
{
    tags: Set<Tags> = new Set()
    constructor(tags_: Tags[])
    {
        tags_.forEach((tag) => this.tags.add(tag))
    }
}

type EntityEvents = {
    onDamage: number,
    onDie: EntityInfo,
}

type EntityEventsWrapper = {
    [K in keyof EntityEvents]: { entity: Entity, argument: EntityEvents[K] }
}
type EntityEventHandler<T = unknown> = (entity: Entity, argument: T) => void;

class ECS
{
    name: string
    systemEmitter: Emitter<SystemEvents>
    entityEmitter: Emitter<EntityEventsWrapper>

    constructor(givenName: string)
    {
        this.name = givenName
        this.systemEmitter = createEvents<SystemEvents>()
        this.entityEmitter = createEvents<EntityEventsWrapper>()
    }

    on<K extends keyof SystemEvents>(this: this, event: K, handler: EventHandler<SystemEvents[K]>)
    {
        return this.systemEmitter.on(event, handler)
    }

    emit<K extends keyof SystemEvents>(this: this, event: K, argument: SystemEvents[K]): void
    {
        this.systemEmitter.emit(event, argument)
    }

    public onEntityEvent<K extends keyof EntityEvents>(this: this, event: K, tags: Tags[] | Set<Tags> | Tags | ((t:Set<Tags>)=>boolean), handler: EntityEventHandler<EntityEvents[K]>)
    {
        return this.entityEmitter.on(event, (argumentWrapper: EntityEventsWrapper[K]) => {
            let entity = argumentWrapper.entity
            let match = true

            if (tags instanceof Function)
            {
                if (!tags(entity.tags))
                {
                    return
                }
            }
            else
            {
                // 这里能不能正向判断是Tags？
                if (!(tags instanceof Array) && !(tags instanceof Set))
                {
                    tags = [tags]
                }
                tags.forEach((tag) => { match = match && entity.tags.has(tag) })
            }

            if (match)
            {
                // 这个as是安全的，但是去不掉
                handler(entity, argumentWrapper.argument as EntityEvents[K])
            }
        })
    }

    public emitEntityEvent<K extends keyof EntityEvents>(this: this, event: K, entity: Entity, argument: EntityEvents[K]): void
    {
        // 这个as是安全的，但是去不掉
        let argumentWrapper: EntityEventsWrapper[K] = { entity: entity, argument: argument } as EntityEventsWrapper[K]
        this.entityEmitter.emit(event, argumentWrapper)
    }
}

let ecs = new ECS('ecs')
new PhysicsSystem(ecs)
new AOISystem(ecs, 2.5)

ecs.emit('update', 101)

let info: EntityInfo = {name: 'alice', typeId: 1001}
ecs.emit('onAddEntity', info)

let entSam = new Entity(['player'])
ecs.emitEntityEvent('onDamage', entSam, 102)

let entDog = new Entity(['npc'])
ecs.emitEntityEvent('onDamage', entDog, 103)

ecs.emitEntityEvent('onDie', entDog, info)
