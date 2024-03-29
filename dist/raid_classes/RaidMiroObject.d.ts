import { Player, MapObject, Game } from "@gathertown/gather-game-client";
import { RaidObject } from "./RaidObject.js";
export declare class RaidMiroObject extends RaidObject {
    raid: RaidMiroProperties;
    temp: string[];
    constructor(gather: MapObject, raid: RaidMiroProperties, game: Game);
    interaction(player: Partial<Player>, json_data?: string): void;
    getBoardItems(): void;
    addShapeItem(): void;
    addShapeItem2(): void;
    deleteFirstItem(): void;
    storeItems(): void;
}
