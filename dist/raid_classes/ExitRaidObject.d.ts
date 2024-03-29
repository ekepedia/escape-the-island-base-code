import { Player, MapObject, Game } from "@gathertown/gather-game-client";
import { RaidObject } from "./RaidObject.js";
export declare class ExitRaidRoomObject extends RaidObject {
    raid: RaidExitProperties;
    constructor(gather: MapObject, raid: RaidProperties, game: Game);
    interaction(player: Partial<Player>, json_data?: string): void;
}
