import { Game } from "@gathertown/gather-game-client";
export declare let team_start_time: number;
export declare let team_end_time: number;
export declare let team_duration: number;
export declare let cumulative_time: number;
import { RaidObject } from "./raid_classes/RaidObject";
import { RaidRace } from "./raid_classes/RaidRace";
import { RaidRoom } from "./raid_classes/RaidRoom";
import { RaidSpawnZone } from "./raid_classes/RaidSpawnZone";
export declare const raidPlayers: {
    [id: string]: RaidPlayer;
};
export declare const raidObjects: {
    [id: string]: RaidObject;
};
export declare const raidPlayersXY: {
    [id: string]: {
        x: number;
        y: number;
        map_id: string;
        steps: number;
    };
};
export declare const raidConfetti: {
    [id: string]: number;
};
export declare const raidPlayerOutfit: {
    [id: string]: {};
};
export declare const raidEmote: {
    [id: string]: number;
};
export declare const raidHand: {
    [id: string]: number;
};
export declare const raidRaceTracks: {
    [track_name: string]: RaidRace;
};
export declare const raidRaceMaps: any[];
export declare const raidRaceMapsTemp: {
    [map_id: string]: string;
};
export declare const raidPlayerRaceTimer: {
    [id: string]: number;
};
export declare const raidRooms: {
    [id: string]: RaidRoom;
};
export declare const raidSpawnRooms: {
    [id: string]: RaidSpawnZone;
};
export declare const raidPermissions: {
    [id: string]: {
        DEFAULT_MOD: boolean;
        DEFAULT_BUILDER: boolean;
        OWNER: boolean;
    };
};
export declare const modOrGreaterUids: string[];
export declare const owners: Set<unknown>;
export declare const mods: Set<unknown>;
export declare const builders: Set<unknown>;
export declare const raidTeamMaps: {
    [team_group: string]: RaidTeamGroup;
};
export declare const raidTeams: {
    [team_name: string]: {
        map_id: string;
        x: number;
        y: number;
        players?: string[];
        max_count?: number;
    };
};
export declare const raidPlayerSpokeOnExit: {
    [id: string]: number;
};
export declare const raidPlayerTimeSpent: {
    [id: string]: number;
};
export declare const throttle: any;
export declare const throttle_100: any;
export declare const _: any;
export declare const miro_sdk: any;
export declare const player_cooldown: {
    timer: number;
    counter: number;
    max_counter: number;
    cooldown: number;
    remaining: number;
};
export declare const game: Game;
