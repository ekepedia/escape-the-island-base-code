import { WireObject, Player, MapObject, Game } from "@gathertown/gather-game-client"; // add Game import
// import { game, raidObjects, raidRooms, throttle } from '../index.js';
import { raidObjects, raidRooms, throttle } from '../index.js'; // remove game import
import { RaidObject } from "./RaidObject.js";

export class ExitRaidRoomObject extends RaidObject {
  raid: RaidExitProperties

  constructor(gather: MapObject, raid: RaidProperties, game: Game) { // add game to constructor
    super(gather, raid, game); // pass game object to set internal game
  }

  interaction(player: Partial<Player>, json_data?: string) {
    throttle(() => {
      console.log(`Object ${this.gather.id} has teleported ${player}`);

      // Object.keys(raidRooms[this.LOGIC].playersInRoom).forEach((key, index) => {
      //   console.log(`Teleporting ${key}`)
      //   this.game.teleport(this.MAP, this.TELEPORT.x, this.TELEPORT.y, key);
      //   raidRooms[this.LOGIC].removePlayer(key);
      // });

      if (raidRooms[this.raid.logic].timer > 0) {
        raidRooms[this.raid.logic].cancel();
      }

      raidRooms[this.raid.logic].removeAllPlayers(this.raid.map, this.raid.teleport.x, this.raid.teleport.y);

      if (raidRooms[this.raid.logic].isEmpty()) {
        raidObjects[this.raid.doors].setSprite(raidObjects[this.raid.doors].gather.normal);
        raidRooms[this.raid.logic].occupied = false;

        if (raidRooms[this.raid.logic].numberOfPlayersWaiting() == 0) {
          this.game.setObject(raidObjects[this.raid.logic_two].raid.map_id, raidObjects[this.raid.logic_two].gather.id, {
            'properties': raidObjects[this.raid.logic_two].gather.properties
          });
        }
      }

    })
  }
}