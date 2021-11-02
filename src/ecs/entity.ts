import {ComponentTransform, ComponentBag} from './component';

export type EntityTag = 'player' | 'npc' | 'item' | 'movable'
export class Entity
{
    public gocTransform?: ComponentTransform
    public gocBag?: ComponentBag

    protected readonly guid: number
    protected tags: Set<EntityTag> = new Set()

    public constructor(guid: number, tags: EntityTag[] = [])
    {
        this.guid = guid
        tags.forEach((tag) => this.tags.add(tag))
    }

    public hasTag(tag: EntityTag)
    {
        return this.tags.has(tag)
    }

    public hasAllTags(tags: EntityTag[])
    {
        for (const tag of tags)
        {
            if (!this.tags.has(tag))
            {
                return false
            }
        }
        return true
    }

    public getGUID()
    {
        return this.guid
    }
}

export type EntityView<K extends keyof Entity> = Required<Pick<Entity, K>> & Omit<Entity, K>

export function createPlayer(guid: number)
{
    let entity = new Entity(guid, ['player', 'movable'])
    
    entity.gocTransform = new ComponentTransform(entity, [1, 2, 3])
    entity.gocBag = new ComponentBag(entity)

    return entity
}

export function createNpc(guid: number)
{
    let entity = new Entity(guid, ['npc', 'movable'])
    
    entity.gocTransform = new ComponentTransform(entity, [4, 5, 6])

    return entity
}

export function createItem(guid: number)
{
    let entity = new Entity(guid, ['item'])
    
    entity.gocTransform = new ComponentTransform(entity, [7, 8, 9])

    return entity
}
