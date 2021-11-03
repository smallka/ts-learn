export {}
console.log("------------------ test-ecs ------------------")

import {ECS} from './ecs/ecs';
import {createPlayer, createNpc, createItem } from './ecs/entity';
import {MovementSystem, BagSystem} from './ecs/system';

let ecs = new ECS()
ecs.addSystem(new MovementSystem(ecs, 0.8))
ecs.addSystem(new BagSystem(ecs))

ecs.emitSystemEvent('onGameplayStart', null)
ecs.emitSystemEvent('onGameplayEnd', true)

let player1 = createPlayer(1001)
ecs.addEntity(player1)
let npc1 = createNpc(2001)
ecs.addEntity(npc1)
let item1 = createItem(50001)
ecs.addEntity(item1)

ecs.emitEntityEvent('onAddItem', player1, item1)
ecs.emitEntityEvent('onAddItem', npc1, item1)

ecs.emitEntityEvent(`onMoveStop`, player1, true)
ecs.emitEntityEvent(`onMoveStop`, npc1, false)
ecs.emitEntityEvent(`onMoveStop`, item1, true)

ecs.tick(0.333)
