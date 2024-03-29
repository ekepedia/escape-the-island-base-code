import { Player, MapObject, Game } from "@gathertown/gather-game-client";
import { RaidObject } from "./RaidObject.js";
export declare class RaidLightsOut extends RaidObject {
    raid: RaidLightsOutProperties;
    activated: boolean;
    constructor(gather: MapObject, raid: RaidLightsOutProperties, game: Game);
    interaction(player: Partial<Player>, json_data?: string): void;
    flip(): void;
}
