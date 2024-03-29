import { Player, MapObject, Game } from "@gathertown/gather-game-client";
import { RaidObject } from "./RaidObject.js";
export declare class RaidPasswordDoor extends RaidObject {
    raid: RaidPasswordProperties;
    json_entries: RaidPasswordEntry[];
    constructor(gather: MapObject, raid: RaidPasswordProperties, game: Game);
    interaction(player: Partial<Player>, json_data?: string): void;
    validate(parsed_JSON: {}, player_id: string): void;
    pass(player_id: string): void;
    failed(player_id: string): void;
    isEquals(a: any[], b: any[]): boolean;
    teleportPlayer(player_id: string): void;
}
