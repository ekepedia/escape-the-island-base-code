// import { game, raidObjects } from '../index.js';
import { MapObject, Game } from '@gathertown/gather-game-client';
import { RaidObject } from './RaidObject.js';

export class RaidTextObject extends RaidObject {
  raid: RaidText

  constructor(gather: MapObject, raid: RaidText, game: Game) {
    super(gather, raid, game);
  }

  display(time?: number) {
    this.game.setObject(this.raid.map_id, this.gather.id, this.gather);

    if (!this.raid.persist) setTimeout(() => { this.removeText() }, time);
  }

  removeText() {
    this.game.deleteObject(this.raid.map_id, this.gather.id);
  }

  changeText(new_text: string, size?: number, font?: string, color?: string) {
    // this.gather.text.text = new_text;

    // if (size != undefined) this.gather.text.size = size;
    // if (font != undefined) this.gather.text.font = font;
    // if (color != undefined) this.gather.text.color = color;
  }
}