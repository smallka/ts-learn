import {Entity} from './entity';

abstract class Component
{
    protected readonly owner: Entity
    public constructor(owner: Entity)
    {
        this.owner = owner
    }
}

export class ComponentTransform extends Component
{
    public pos: [number, number, number]
    public constructor(entity: Entity, pos: [number, number, number])
    {
        super(entity)
        this.pos = pos
    }
}

export class ComponentBag extends Component
{
    public size = 10
}