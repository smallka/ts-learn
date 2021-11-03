import {Entity, EntityView } from './entity';
import {ECS} from './ecs';

export interface System
{
    tick?: (deltaTime: number) => void
}

export abstract class System 
{
    protected readonly ecs: ECS
    public constructor(ecs: ECS)
    {
        this.ecs = ecs
    }
}

export class BagSystem extends System
{
    private static readonly components = [ 'gocBag' ] as const
    public constructor(ecs: ECS)
    {
        super(ecs)

        ecs.onSystemEvent('onGameplayStart', this.onGameplayStart.bind(this))
        ecs.onEntityEvent('onAddItem', this.onAddItem.bind(this), BagSystem.components)
    }

    private onGameplayStart(this: this)
    {
        console.log(`BagSystem onGameplayStart`)
    }

    private onAddItem(this: this, entity: EntityView<typeof BagSystem.components[number]>, item: Entity)
    {
        console.log(`BagSystem onAddItem, item=${item.guid}, entity=${entity.guid}`)
    }
}

export class MovementSystem extends System
{
    private static readonly components = [ 'gocTransform' ] as const
    private speed: number

    public constructor(ecs: ECS, speed: number)
    {
        super(ecs)
        this.speed = speed

        ecs.onSystemEvent('onGameplayStart', this.onGameplayStart.bind(this))
        ecs.onSystemEvent('onGameplayEnd', this.onGameplayEnd.bind(this))
        ecs.onEntityEvent('onMoveStop', this.onMoveStop.bind(this), MovementSystem.components, ['movable'])
        ecs.onTickEntity(this.tickEntity.bind(this), MovementSystem.components, ['npc'])
    }

    public tick = (deltaTime: number) =>
    {
        console.log(`MovementSystem tick, deltaTime=${deltaTime}, speed=${this.speed}`)
    }

    public tickEntity(this: this, deltaTime: number, entity: EntityView<typeof MovementSystem.components[number]>)
    {
        console.log(`MovementSystem tickEntity, deltaTime=${deltaTime}, entity=${entity.guid}`)
    }

    private onGameplayStart(this: this)
    {
        console.log(`MovementSystem onGameplayStart`)
    }

    private onGameplayEnd(this: this)
    {
        console.log(`MovementSystem onGameplaEnd`)
    }

    private onMoveStop(this: this, entity: EntityView<typeof MovementSystem.components[number]>, isImme: boolean)
    {
        console.log(`MovementSystem onMoveStop, isImme=${isImme}, entity=${entity.guid}`)
    }
}