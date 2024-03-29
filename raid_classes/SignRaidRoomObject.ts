import { WireObject, Player, MapObject, Game } from "@gathertown/gather-game-client";
import { raidObjects, raidRooms, throttle } from '../index.js';
import { RaidObject } from "./RaidObject.js";

export class SignRaidRoomObject extends RaidObject {
  raid: RaidLogic

  constructor(gather: MapObject, raid: RaidLogic, game: Game) {
    super(gather, raid, game)
  }

  interaction(player: Partial<Player>, json_data?: string) {
    throttle(() => {
      if (!json_data) return;

      let parsed_JSON = JSON.parse(json_data);
      let sign_in = parsed_JSON.radio_input;

      console.log('json parsed')

      if (raidRooms[this.raid.logic].isWaitingFull() == false && sign_in == "Yes") {

        console.log('user signed in');

        if (raidRooms[this.raid.logic].playersWaiting[player.id] == undefined) {
          raidRooms[this.raid.logic].addPlayerWaiting(player.id, player.name);

          this.game.chat(player.id, [], player.map, { contents: `${player.name} has signed up for ${this.raid.logic}` });

          let temp = '';

          if (raidRooms[this.raid.logic].numberOfPlayersWaiting() > 0) {
            Object.keys(raidRooms[this.raid.logic].playersWaiting).forEach((key, index) => {
              temp += raidRooms[this.raid.logic].playersWaiting[key] + '\n';
            });
          }

          this.game.setObject(this.raid.map_id, this.gather.id, {
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
                    value: temp,
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
          console.log('you are already registered');
        }

      } else {
        console.log(`${this.raid.logic} is full!`);
      }
    });
  }
}