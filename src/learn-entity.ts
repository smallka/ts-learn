export {}
console.log("------------------ learn-entity ------------------")

class ComponentHead { 
    name: string = 'head'
}
class ComponentLeg {
    count: number = 2
}

type Entity = {
    gocHead?: ComponentHead
    gocLeg?: ComponentLeg
}

type EntityViewHead = Required<Pick<Entity, "gocHead">> & Omit<Entity, "gocHead">

let gocHead = new ComponentHead()
let gocLeg = new ComponentLeg()

let headEntity: Entity = {
    gocHead: gocHead,
}
console.log(`headEntity, head=${headEntity.gocHead?.name}, leg=${headEntity.gocLeg?.count}`)

let headView: EntityViewHead = headEntity as EntityViewHead
console.log(`headView, head=${headView.gocHead.name}, leg=${headView.gocLeg}`)

let legEntity: Entity = {
    gocLeg: gocLeg,
}
console.log(`legEntity, head=${legEntity.gocHead?.name}, leg=${legEntity.gocLeg?.count}`)

let headViewMiss: EntityViewHead = legEntity as EntityViewHead
console.log(`headViewMiss, head=${headViewMiss.gocHead}, leg=${headViewMiss.gocLeg?.count}`)