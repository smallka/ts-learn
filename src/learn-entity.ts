export {}
console.log("------------------ learn-entity ------------------")

class ComponentHead { 
    name: string = 'head'
}
class ComponentLeg {
    count: number = 2
}

class ComponentTail {
    length: number = 3.14
}
type Entity = {
    gocHead?: ComponentHead
    gocLeg?: ComponentLeg
    gocTail?: ComponentTail
}

type EntityView<K extends keyof Entity> = Required<Pick<Entity, K>> & Omit<Entity, K>

let gocHead = new ComponentHead()
let gocLeg = new ComponentLeg()
let gocTail = new ComponentTail()

let headEntity: Entity = {
    gocHead: gocHead,
}
console.log(`headEntity, head=${headEntity.gocHead?.name}, leg=${headEntity.gocLeg?.count}`)

let headView: EntityView<"gocHead"> = headEntity as EntityView<"gocHead">
console.log(`headView, head=${headView.gocHead.name}, leg=${headView.gocLeg}`)

let legEntity: Entity = {
    gocLeg: gocLeg,
}
console.log(`legEntity, head=${legEntity.gocHead?.name}, leg=${legEntity.gocLeg?.count}`)

let headViewMiss: EntityView<"gocHead"> = legEntity as EntityView<"gocHead">
console.log(`headViewMiss, head=${headViewMiss.gocHead}, leg=${headViewMiss.gocLeg?.count}`)

let lowerEntity: Entity = {
    gocLeg: gocLeg,
    gocTail: gocTail,
}
console.log(`lowerEntity, leg=${lowerEntity.gocLeg?.count}, tail=${lowerEntity.gocTail?.length}`)

let lowerView: EntityView<"gocLeg"|"gocTail"> = lowerEntity as EntityView<"gocLeg"|"gocTail">
console.log(`lowerView, head=${lowerView.gocLeg.count}, leg=${lowerView.gocTail.length}`)