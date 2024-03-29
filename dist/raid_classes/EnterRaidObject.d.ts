import { Player, MapObject, Game } from "@gathertown/gather-game-client";
import { RaidObject } from "./RaidObject.js";
export declare class EnterRaidRoomObject extends RaidObject {
    raid: RaidEnterProperties;
    game: Game;
    constructor(gather: MapObject, raid: RaidEnterProperties, game: Game);
    interaction(player: Partial<Player>, json_data?: string): void;
}
