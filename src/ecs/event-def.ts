import {Entity} from './entity';

export interface SystemEvents {
    onGameplayStart: null,
    onGameplayEnd: boolean,
}

export interface EntityEvents {
    onAddItem: Entity,
    onMoveStop: boolean,
    tickEntity: number,
}