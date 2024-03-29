export declare class RaidRace {
    race_name: string;
    map_id: string;
    start_line: [];
    end_line: [];
    checkpoints: [];
    laps: number;
    raidPlayerRaceTracker: {
        [id: string]: {
            lap: number;
            start_time: number;
            end_time: number;
            lap_time: number;
            cp_counter: number;
        };
    };
    constructor(race_name: string, map_id: string, start_line: [], end_line: [], checkpoints: [], laps: number);
    update(player_id: string, player_name: string, current_pos: {
        x: number;
        y: number;
    }, current_map: string): void;
}
