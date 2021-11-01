import {Tags, Entity, EntityView } from './entity';
import {ECS} from './ecs';

export abstract class System 
{
    protected ecs: ECS
    public constructor(ecs: ECS)
    {
        this.ecs = ecs
    }
}

const components = [ 'gocTransform', 'gocBag' ] as const

export class MovementSystem extends System
{
    public constructor(ecs: ECS)
    {
        super(ecs)

        ecs.onSystemEvent('onGameplayStart', this.onGameplayStart.bind(this))
        ecs.onEntityEvent('onAddItem', components, ['movable'], this.onAddItem.bind(this))
    }

    private onGameplayStart(this: this)
    {
        console.log(`Movemvent onGameplayStart`)
    }

    private onAddItem(this: this, entity: EntityView<typeof components[number]>, item: Entity)
    {
        console.log(`Movemvent onAddItem, item=${item.getGUID()}, entity=`)
        console.log(entity)
    }
}