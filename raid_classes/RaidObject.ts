import { WireObject, Player, MapObject, Game } from "@gathertown/gather-game-client"; // add Game import
// import { game, raidObjects } from '../index.js'; // remove game import

export class RaidObject {
  gather: MapObject
  game: Game // add game declaration
  raid: RaidProperties
  key?: string
  activated?: boolean

  constructor(gather: MapObject, raid: RaidProperties, game: Game) { // add game to constructor
    this.gather = gather;
    this.raid = raid;
    this.game = game; // set internal game
  }

  interaction(player: Partial<Player>, json_data?: string) {
    console.log(`base class called for interaction`)
  }

  flip() {
    throw new Error("Method not implemented.");
  }

  setSprite(normal: string) {
    this.game.setObject(this.raid.map_id, this.gather.id, { // replace game. with this.game.
      normal: normal,
      highlighted: normal
    });
  }
}