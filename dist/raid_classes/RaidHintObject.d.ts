import { Player, MapObject, Game } from "@gathertown/gather-game-client";
import { RaidObject } from "./RaidObject.js";
export declare class RaidHintObject extends RaidObject {
    raid: RaidHintProperties;
    tracker: number;
    timer: number;
    constructor(gather: MapObject, raid: RaidHintProperties, game: Game);
    interaction(player: Partial<Player>, json_data?: string): void;
}
