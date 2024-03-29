import { Player, MapObject, Game } from "@gathertown/gather-game-client";
import { RaidObject } from "./RaidObject.js";
export declare class SignRaidRoomObject extends RaidObject {
    raid: RaidLogic;
    constructor(gather: MapObject, raid: RaidLogic, game: Game);
    interaction(player: Partial<Player>, json_data?: string): void;
}
