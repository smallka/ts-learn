
import {createEvents, Emitter, EventHandler} from '../events2';
import {Tags, Entity, EntityView} from './entity';
import {System} from './system';

interface SystemEvents {
    onGameplayStart: null,
    onGameplayEnd: boolean,
}

interface EntityEvents {
    onAddItem: Entity,
    onMoveStop: boolean,
    tickEntity: number,
}

type EntityEventsWrapper = {
    [K in keyof EntityEvents]: { entity: Entity, argument: EntityEvents[K] }
}

function isEntityInView(entity: Entity, coms: ReadonlyArray<keyof Entity>)
{
    for (const idx in coms)
    {
        if (entity[coms[idx]] === undefined)
        {
            return false
        }
    }
    return true
}

interface TickEntityView {
    entities: Entity[]
    components: ReadonlyArray<keyof Entity>
    handler: (deltaTime: number, entity: Entity) => void
}

export class ECS
{
    private entities: Map<number, Entity>
    private systems: System[] = []
    private systemEmitter: Emitter<SystemEvents>
    private entityEmitter: Emitter<EntityEventsWrapper>
    private tickEntityViews: TickEntityView[] = []

    public constructor()
    {
        this.entities = new Map
        this.systemEmitter = createEvents<SystemEvents>()
        this.entityEmitter = createEvents<EntityEventsWrapper>()
    }

    public addSystem(this: this, system: System)
    {
        this.systems.push(system)
    }

    public addEntity(this: this, entity: Entity)
    {
        this.entities.set(entity.getGUID(), entity)
        for (let view of this.tickEntityViews)
        {
            if (isEntityInView(entity, view.components))
            {
                view.entities.push(entity)
            }
        }
    }

    public tick(this: this, deltaTime: number)
    {
        for (let system of this.systems)
        {
            if (system.tick)
            {
                system.tick(deltaTime)
            }
        }

        for (let view of this.tickEntityViews)
        {
            for (let entity of view.entities)
            {
                view.handler(deltaTime, entity)
            }
        }
    }

    public onTickEntity(
        handler: (deltaTime: number, entity: EntityView<typeof components[number]>) => void,
        components: ReadonlyArray<keyof Entity>)
    {
        this.tickEntityViews.push({
            entities: [],
            components: components,
            handler: (deltaTime, entity) => handler(deltaTime, entity as EntityView<typeof components[number]>),
        })
    }

    public onSystemEvent<K extends keyof SystemEvents>(this: this, event: K, handler: EventHandler<SystemEvents[K]>)
    {
        return this.systemEmitter.on(event, handler)
    }

    public emitSystemEvent<K extends keyof SystemEvents>(this: this, event: K, argument: SystemEvents[K]): void
    {
        this.systemEmitter.emit(event, argument)
    }

    public onEntityEvent<E extends keyof EntityEvents>(
        this: this,
        event: E,
        handler: (entity: EntityView<typeof components[number]>, argument: EntityEvents[E]) => void,
        components: ReadonlyArray<keyof Entity> = [],
        tags: Tags[] = [])
    {
        return this.entityEmitter.on(event, (argumentWrapper: EntityEventsWrapper[E]) => {
            const entity = argumentWrapper.entity
            if (!isEntityInView(entity, components))
            {
                return
            }
            let match = true
            tags.forEach((tag) => { match = match && entity.hasTag(tag) })
            if (match)
            {
                handler(entity as EntityView<typeof components[number]>, argumentWrapper.argument as EntityEvents[E])
            }
        })
    }

    public emitEntityEvent<E extends keyof EntityEvents>(
        this: this,
        event: E,
        entity: Entity,
        argument: EntityEvents[E])
    {
        let argumentWrapper: EntityEventsWrapper[E] = { entity: entity, argument: argument } as EntityEventsWrapper[E]
        this.entityEmitter.emit(event, argumentWrapper)
    }
}