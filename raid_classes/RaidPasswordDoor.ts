import { WireObject, Player, MapObject, Game } from "@gathertown/gather-game-client";
import { game, raidObjects } from '../index.js';
import { RaidObject } from "./RaidObject.js";

export class RaidPasswordDoor extends RaidObject {
  raid: RaidPasswordProperties
  json_entries: RaidPasswordEntry[]


  constructor(gather: MapObject, raid: RaidPasswordProperties, game: Game) {
    super(gather, raid, game);
    this.json_entries = gather.properties.extensionData.entries;
  }

  interaction(player: Partial<Player>, json_data?: string): void {
    if (!json_data) return;

    let parsed_JSON = JSON.parse(json_data);

    this.validate(parsed_JSON, player.id);
  }

  validate(parsed_JSON: {}, player_id: string) {
    const parsed_entries = Object.entries(parsed_JSON);

    let isValidated = true;

    for (let i = 0; i < this.json_entries.length; i++) {
      for (const [parsed_key, parsed_value] of Object.entries(parsed_JSON)) {
        if (parsed_key == this.json_entries[i].key) {
          switch (this.json_entries[i].type) {
            case 'text':
              if (this.raid.answers[parsed_key] instanceof Array) {
                if (this.raid.answers[parsed_key].includes(parsed_value.toString())) {
                  console.log(parsed_key, 'is correct');
                } else {
                  console.log(parsed_key, 'is incorrect');
                  isValidated = false;
                }
              } else {
                console.log('not array');
                isValidated = false;
              }
              break;
            case 'radio':
              if (parsed_value.toString() == this.raid.answers[parsed_key].toString()) {
                console.log(parsed_key, 'is correct');
              } else {
                console.log(parsed_key, 'is incorrect');
                isValidated = false;
              }

              break;
            case 'checkbox':
              let temp = <Array<any>>parsed_value;
              if (this.isEquals(temp, this.raid.answers[parsed_key])) {
                console.log(parsed_key, 'is correct');
              } else {
                console.log(parsed_key, 'is incorrect');
                isValidated = false;
              }

              break;
            default:
              console.log('unknown input');
              break;
          }
        }
      }
    }

    isValidated ? this.pass(player_id) : this.failed(player_id);
  }

  pass(player_id: string) {
    console.log('pass validation');
    if (this.raid.actions.pass != undefined) {
      switch (this.raid.actions.pass) {
        case 'TELEPORT':
          this.teleportPlayer(player_id);
          break;
        default:
          console.log('no pass behavior found, check ObjectData.ts');
          break;
      }
    }
  }

  failed(player_id: string) {
    console.log('fail validation');
    if (this.raid.actions.failed != undefined) {
      switch (this.raid.actions.failed) {
        case 'TELEPORT':
          this.teleportPlayer(player_id);
          break;
        default:
          console.log('no failed behavior found, check ObjectData.ts');
          break;
      }
    }
  }

  isEquals(a: any[], b: any[]) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;

    let temp_a = a.sort();
    let temp_b = b.sort();

    for (var i = 0; i < temp_a.length; ++i) {
      if (temp_a[i] !== temp_b[i]) return false;
    }

    return true;
  }

  teleportPlayer(player_id: string) {
    if (this.raid.teleport != undefined) {
      this.game.teleport(this.raid.teleport.map_id, this.raid.teleport.x, this.raid.teleport.y, player_id);
    } else {
      console.log('teleport property not found for', this.gather.id);
    }
  }
}