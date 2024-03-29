import { MapObject, Game } from "@gathertown/gather-game-client";
export declare class RaidSpawnZone {
    name: string;
    map_id: string;
    spawn_rate: number;
    id_prefix: string;
    id_suffix_counter: number;
    item_id_list: string[];
    item_max: number;
    items: Object;
    zones: Object;
    game: Game;
    constructor(name: string, map_id: string, spawn_rate: number, id_prefix: string, id_suffix_counter: number, item_max: number, items: Object, zones: Object, game: Game);
    spawn(): void;
    mesh_spawns(): any[];
    findSpawn(obj_list: Object, mesh_array: {
        x: number;
        y: number;
        biome: string;
    }[]): {
        x: number;
        y: number;
        biome: string;
    };
    delete_objects(): void;
    delete_object(key: string, obj: MapObject): void;
}
