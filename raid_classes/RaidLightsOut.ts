import { WireObject, Player, MapObject, Game } from "@gathertown/gather-game-client";
import { raidObjects } from '../index.js';
import { RaidObject } from "./RaidObject.js";

export class RaidLightsOut extends RaidObject {
  raid: RaidLightsOutProperties
  activated: boolean

  constructor(gather: MapObject, raid: RaidLightsOutProperties, game: Game) {
    super(gather, raid, game);
    this.activated = false;
  }

  interaction(player: Partial<Player>, json_data?: string) {
    console.log('Lights out called', this.gather.id);

    this.flip();

    for (let i = 0; i < this.raid.linked.length; i++) {
      raidObjects[this.raid.linked[i]].flip();
    }

    let solved = true;
    for (let i = 0; i < this.raid.group.length; i++) {
      if (!raidObjects[this.raid.group[i]].activated) solved = false;
    }

    if (solved) {
      console.log('You win', player.name, '!');
    }
  }

  flip() {
    if (this.gather.normal == this.raid.state.off) {
      this.gather.normal = this.raid.state.on;
      this.gather.highlighted = this.raid.state.on;
      this.activated = true;
    } else {
      this.gather.normal = this.raid.state.off;
      this.gather.highlighted = this.raid.state.off;
      this.activated = false;
    }

    this.game.setObject(this.raid.map_id, this.gather.id, this.gather);
  }
}