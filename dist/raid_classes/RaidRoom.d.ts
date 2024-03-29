export declare class RaidRoom {
    room_name: string;
    map_id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    capacity: number;
    timer: number;
    interval: number;
    timeLeft: number;
    objects: {
        sign: string;
        enter: string;
        exit: string;
    };
    playersInRoom: {
        [id: string]: string;
    };
    playersWaiting: {
        [id: string]: string;
    };
    occupied: boolean;
    countdown: any;
    timeLimit: any;
    constructor(room_name: string, map_id: string, x: number, y: number, width: number, height: number, capacity: number, timer: number, interval: number, objects: {
        sign: string;
        enter: string;
        exit: string;
    });
    addPlayer(player: string, player_name: string): void;
    addPlayerWaiting(player: string, player_name: string): void;
    removePlayer(player: string): void;
    removeAllPlayers(map: string, x: number, y: number): void;
    removePlayerWaiting(player: string): void;
    numberOfPlayers(): number;
    numberOfPlayersWaiting(): number;
    isFull(): boolean;
    isWaitingFull(): boolean;
    isEmpty(): boolean;
    setUp(map: string, x: number, y: number): void;
    cancel(): void;
}
