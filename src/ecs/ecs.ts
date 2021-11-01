
import {createEvents, Emitter, EventHandler} from '../events2';
import {Tags, Entity, EntityView} from './entity';
import {System} from './system';

interface SystemEvents {
    onGameplayStart: null,
    tick: number,
}

interface EntityEvents {
    onAddItem: Entity,
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

export class ECS
{
    private systems: System[] = []
    private systemEmitter: Emitter<SystemEvents>
    private entityEmitter: Emitter<EntityEventsWrapper>

    public constructor()
    {
        this.systemEmitter = createEvents<SystemEvents>()
        this.entityEmitter = createEvents<EntityEventsWrapper>()
    }

    public addSystem(this: this, system: System)
    {
        this.systems.push(system)
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
        components: ReadonlyArray<keyof Entity>,
        tags: Tags[],
        handler: (entity: EntityView<typeof components[number]>,argument: EntityEvents[E]) => void)
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

    public emitEntityEvent<E extends keyof EntityEvents>(this: this, event: E, entity: Entity, argument: EntityEvents[E]): void
    {
        let argumentWrapper: EntityEventsWrapper[E] = { entity: entity, argument: argument } as EntityEventsWrapper[E]
        this.entityEmitter.emit(event, argumentWrapper)
    }
}