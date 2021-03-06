export {}
console.log('------------------ try-ecs2 ------------------')

import {createEvents, Emitter, EventHandler} from './ecs/events';

type EntityInfo = {name: string, typeId: number}

type SystemEvents = {
    update: number,
    onAddEntity: EntityInfo,
}

class BaseSystem
{
    protected ecs: ECS

    constructor(ecs_: ECS)
    {
        this.ecs = ecs_
    }

    protected registerEvent<K extends keyof SystemEvents>(event: K, func: EventHandler<SystemEvents[K]>)
    {        
        let funcName = func.name
        ecs.on(event, (...args) => {
            let realFunc: any = this[funcName as keyof typeof this]
            realFunc.call(this, ...args) 
        })
    }

    protected registerEntityEvent<K extends keyof EntityEvents>(event: K, tags: Tags[] | Set<Tags> | Tags | ((t:Set<Tags>)=>boolean), handler: EntityEventHandler<EntityEvents[K]>)
    {
        ecs.onEntityEvent(event, tags, handler.bind(this))        
    }
}

class PhysicsSystem extends BaseSystem
{
    constructor(ecs_: ECS)
    {
        super(ecs_)
        this.registerEvent('update', this.update)
        this.registerEntityEvent('onDamage', 'player', this.onDamage)
    }

    update(dt: number): void
    {
        console.log(`${this.ecs.name} call physics: update ${dt}`)
    }
    onDamage(entity: Entity, damage: number): void
    {
        console.log(`on damage, entity=${entity.tags}, damage=${damage}`)
    }
}

class AOISystem extends BaseSystem
{
    private radius: number
    constructor(ecs_: ECS, radius_: number)
    {
        super(ecs_)
        this.radius = radius_
        this.registerEvent('update', this.update)
        this.registerEvent('onAddEntity', this.onAddEntity)
    }

    update(dt: number): void
    {
        console.log(`${this.ecs.name} call AOI: update ${dt} radius=${this.radius}`)
    }

    onAddEntity(entity: EntityInfo): number
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

    on<K extends keyof SystemEvents>(event: K, handler: EventHandler<SystemEvents[K]>)
    {
        return this.systemEmitter.on(event, handler)
    }

    emit<K extends keyof SystemEvents>(event: K, argument: SystemEvents[K]): void
    {
        this.systemEmitter.emit(event, argument)
    }

    public onEntityEvent<K extends keyof EntityEvents>(event: K, tags: Tags[] | Set<Tags> | Tags | ((t:Set<Tags>)=>boolean), handler: EntityEventHandler<EntityEvents[K]>)
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
                // ??????????????????????????????Tags???
                if (!(tags instanceof Array) && !(tags instanceof Set))
                {
                    tags = [tags]
                }
                tags.forEach((tag) => { match = match && entity.tags.has(tag) })
            }

            if (match)
            {
                // ??????as??????????????????????????????
                handler(entity, argumentWrapper.argument as EntityEvents[K])
            }
        })
    }

    public emitEntityEvent<K extends keyof EntityEvents>(event: K, entity: Entity, argument: EntityEvents[K]): void
    {
        // ??????as??????????????????????????????
        let argumentWrapper: EntityEventsWrapper[K] = { entity: entity, argument: argument } as EntityEventsWrapper[K]
        this.entityEmitter.emit(event, argumentWrapper)
    }
}

let ecs = new ECS('ecs')
new PhysicsSystem(ecs)
new AOISystem(ecs, 2.5)

ecs.emit('update', 101)

let alice: EntityInfo = {name: 'alice', typeId: 1001}
ecs.emit('onAddEntity', alice)

let entSam = new Entity(['player'])
ecs.emitEntityEvent('onDamage', entSam, 102)

let entDog = new Entity(['npc'])
ecs.emitEntityEvent('onDamage', entDog, 103)

ecs.emitEntityEvent('onDie', entDog, alice)

console.log('----------- try-hotfix')
function onAddEntity(this: AOISystem, entity: EntityInfo): number
{
    console.log(`${this.ecs.name} call AOI: onAddEntity2 ${entity.name}`)
    return 0
}
AOISystem.prototype.onAddEntity = onAddEntity

let bob: EntityInfo = {name: 'bob', typeId: 1002}
ecs.emit('onAddEntity', bob)

