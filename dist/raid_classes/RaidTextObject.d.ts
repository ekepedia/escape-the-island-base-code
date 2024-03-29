import { MapObject, Game } from '@gathertown/gather-game-client';
import { RaidObject } from './RaidObject.js';
export declare class RaidTextObject extends RaidObject {
    raid: RaidText;
    constructor(gather: MapObject, raid: RaidText, game: Game);
    display(time?: number): void;
    removeText(): void;
    changeText(new_text: string, size?: number, font?: string, color?: string): void;
}
