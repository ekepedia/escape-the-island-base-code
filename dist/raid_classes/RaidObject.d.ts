import { Player, MapObject, Game } from "@gathertown/gather-game-client";
export declare class RaidObject {
    gather: MapObject;
    game: Game;
    raid: RaidProperties;
    key?: string;
    activated?: boolean;
    constructor(gather: MapObject, raid: RaidProperties, game: Game);
    interaction(player: Partial<Player>, json_data?: string): void;
    flip(): void;
    setSprite(normal: string): void;
}
