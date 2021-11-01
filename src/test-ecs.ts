export {}
console.log("------------------ test-ecs ------------------")

import {ECS} from './ecs/ecs';
import {Tags, Entity, createPlayer, createNpc, createItem } from './ecs/entity';
import {MovementSystem} from './ecs/system';

let ecs = new ECS()
ecs.addSystem(new MovementSystem(ecs))

ecs.emitSystemEvent('onGameplayStart', null)

let p1 = createPlayer(1001)
let n1 = createNpc(2001)
let i1 = createItem(50001)

ecs.emitEntityEvent('onAddItem', p1, i1)
ecs.emitEntityEvent('onAddItem', n1, i1)