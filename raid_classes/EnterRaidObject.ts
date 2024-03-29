import { WireObject, Player, MapObject, Game } from "@gathertown/gather-game-client";
import { raidObjects, raidRooms, throttle } from '../index.js';
import { RaidObject } from "./RaidObject.js";

export class EnterRaidRoomObject extends RaidObject {
  raid: RaidEnterProperties
  game: Game

  constructor(gather: MapObject, raid: RaidEnterProperties, game: Game) {
    super(gather, raid, game);
  }

  interaction(player: Partial<Player>, json_data?: string) {

    throttle(() => {
      if (raidRooms[this.raid.logic].occupied == false) {
        if (raidRooms[this.raid.logic].playersWaiting[player.id] != undefined) {
          Object.keys(raidRooms[this.raid.logic].playersWaiting).forEach((key, index) => {
            console.log(`Teleporting ${key} to ${this.raid.logic}`)
            this.game.teleport(this.raid.map, this.raid.teleport.x, this.raid.teleport.y, key);
            let temp = raidRooms[this.raid.logic].timer / 1000;
            this.game.setTextStatus(temp.toString(), key);
            raidRooms[this.raid.logic].addPlayer(key, raidRooms[this.raid.logic].playersWaiting[key]);
            raidRooms[this.raid.logic].removePlayerWaiting(key);
          });
          raidRooms[this.raid.logic].occupied = true;
          this.setSprite(this.raid.closed);

          this.game.setObject(this.raid.map_id, this.raid.logic_three, {
            "properties": {
              extensionData: {
                entries: [
                  {
                    type: "header",
                    value: "Raid Room Instance One Waiting List",
                    key: "mainHeader1",
                  },
                  {
                    type: "header",
                    value: "Currently occupied, but you can still join the wait list for the next session.",
                    key: "mainHeader2",
                  },
                  {
                    type: "radio",
                    key: "radio_input",
                    options: [
                      {
                        label: "No",
                        key: "No",
                      },
                      {
                        label: "Yes",
                        key: "Yes",
                      },
                    ],
                  },
                ]
              }
            }
          });
        } else {
          console.log('you are not registered');
        }
      } else {
        console.log('room is occupied');
      }
    });

    if (raidRooms[this.raid.logic].timer > 0) {
      raidRooms[this.raid.logic].setUp(this.raid.logic_two.map, this.raid.logic_two.x, this.raid.logic_two.y);

    }
  }
}