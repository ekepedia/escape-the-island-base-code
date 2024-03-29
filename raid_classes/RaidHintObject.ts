import { WireObject, Player, MapObject, Game } from "@gathertown/gather-game-client";
// import { game, raidObjects, raidRooms, throttle } from '../index.js';
import { raidObjects, raidRooms, throttle } from '../index.js';
import { RaidObject } from "./RaidObject.js";

export class RaidHintObject extends RaidObject {
  raid: RaidHintProperties
  tracker: number
  timer: number

  constructor(gather: MapObject, raid: RaidHintProperties, game: Game) {
    super(gather, raid, game);
    this.tracker = 0;
    this.timer = 0;
  }

  interaction(player: Partial<Player>, json_data?: string) {
    throttle(() => {
      console.log(`Hint ${this.gather.id} has been activated by ${player.name}`);

      let temp = Date.now();

      if (temp - this.timer >= this.raid.timers[this.tracker]) {
        if (this.tracker < this.raid.hints.length) {
          console.log(this.raid.hints[this.tracker]);

          this.tracker++;
          this.timer = temp;
        }
      } else {
        //Comment this line out if you don't want repeating hints
        console.log(this.raid.hints[this.tracker - 1]);

        //Time remaining - *FIXED*
        if (this.tracker == this.raid.hints.length) {
          console.log('There are no more hints available.')
        } else {
          let currentTimer = temp - this.timer;
          let timeDuration = this.raid.timers[this.tracker];
          console.log(timeDuration - currentTimer, 'ms left until your next hint');
        }
      }
    })
  }
}