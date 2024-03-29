// import { game, raidObjects, raidPlayers, throttle } from '../index.js';
import { raidObjects, raidPlayers, throttle } from '../index.js';
import { RaidObject } from '../raid_classes/RaidObject.js';
import { playerRateLimit, getCurrentTime, generateMask, checkSameEmojiSpace, findFrontPlayer, teleportForward, teleportSameEmoji } from '../raid_lib/raidLib';

export const raidPlayerTriggers = ((game) => {
  game.subscribeToEvent("playerTriggersObject", (data, context) => {
    let temp_key = data.playerTriggersObject.key;
    let object_id = Object.keys(raidObjects).find((key) => raidObjects[key].key === temp_key);

    // Cooldown Code
    if (playerRateLimit(raidPlayers[context.playerId])) return;

    // Store the coords of the space in front of the player
    let front = {
      x: raidPlayers[context.playerId].x,
      y: raidPlayers[context.playerId].y,
      direction: raidPlayers[context.playerId].direction
    }

    switch (front.direction) {
      case 3:
      case 4:
        front.y--;
        break;
      case 7:
      case 8:
        front.x++;
        break;
      case 1:
      case 2:
        front.y++;
        break;
      case 5:
      case 6:
        front.x--;
        break;
      default:
        console.log('invalid direction?');
    }

    // Check for any players in front of player
    let front_player = 'none';
    Object.keys(raidPlayers).every((key, index) => {
      if (raidPlayers[key].x == front.x && raidPlayers[key].y == front.y && key != context.playerId) {
        front_player = key;
        return false;
      }
      return true;
    });

    //Checks if the player is already holding an item
    if (raidPlayers[context.playerId].helditem != undefined) {
      if (raidObjects[raidPlayers[context.playerId].helditem] != undefined) {
        let player_obj = raidObjects[raidPlayers[context.playerId].helditem];

        // Determine how an object is placed/traded depending on their raid properties
        if (front_player != 'none' && player_obj.raid.tradeable) {
          if (raidPlayers[front_player].helditem != undefined) {
            // Tradeable property is true, trade another tradeable item with a player or give them your item if they don't have any items
            let front_player_obj = raidObjects[raidPlayers[front_player].helditem];

            if (front_player_obj.raid.tradeable) {
              let temp_obj = raidPlayers[context.playerId].helditem;

              throttle(() => {
                console.log('1')

                raidPlayers[context.playerId].helditem = raidPlayers[front_player].helditem;
                game.setItem("closestObjectTemplate", front_player_obj.gather.normal, context.playerId);
              });

              throttle(() => {
                raidPlayers[front_player].helditem = temp_obj;
                game.setItem("closestObjectTemplate", player_obj.gather.normal, front_player);

                console.log(`${raidPlayers[context.playerId].name} has traded with ${raidPlayers[front_player].name} (${raidPlayers[front_player].helditem} for ${raidPlayers[context.playerId].helditem})`);
                return;
              });
            }
          } else {
            throttle(() => {
              raidPlayers[front_player].helditem = raidPlayers[context.playerId].helditem;
              game.setItem("closestObjectTemplate", player_obj.gather.normal, front_player);

              delete raidPlayers[context.playerId].helditem;
              game.clearItem(context.playerId);

              console.log(`${raidPlayers[context.playerId].name} has given  ${raidPlayers[front_player].helditem} to ${raidPlayers[front_player].name}`)
              return;
            });
          }
        } else if (object_id != undefined) {

          if (raidObjects[object_id] != undefined && raidObjects[object_id].gather != undefined && raidObjects[object_id].gather.x != undefined && raidObjects[object_id].gather.y != undefined) {
            // swappable property
            if (player_obj.raid.swappable && raidObjects[object_id].raid.swappable) {
              console.log(`${context.player.name} has swapped ${raidPlayers[context.playerId].helditem} with ${object_id}`);

              swapItem(game, raidPlayers[context.playerId].helditem, object_id, { x: raidObjects[object_id].gather.x, y: raidObjects[object_id].gather.y }, context.playerId, context.player.name, context.player.map, raidObjects[raidPlayers[context.playerId].helditem].key);
            }

            if (player_obj.raid.stackable && raidObjects[object_id].raid.stackable) {
              console.log(`${context.player.name} has stacked ${raidPlayers[context.playerId].helditem} on top of ${object_id}`);
              placeItem(game, raidPlayers[context.playerId].helditem, { x: raidObjects[object_id].gather.x, y: raidObjects[object_id].gather.y }, context.playerId, context.player.name, context.player.map);
            }

            return;
          }
        }

        throttle(() => {
          if (raidPlayers[context.playerId].helditem != undefined) {
            console.log(`${context.player.name} has placed down ${raidPlayers[context.playerId].helditem}`);
            placeItem(game, raidPlayers[context.playerId].helditem, front, context.playerId, context.player.name, context.player.map);
          }
        })

      } else {
        console.log(`held item error`);
      }

      return;
    } else if (front_player != 'none' && raidPlayers[front_player].helditem != undefined) {
      // lootable property
      let temp_obj_id = raidPlayers[front_player].helditem;
      if (raidObjects[temp_obj_id].raid.lootable) {
        raidPlayers[context.playerId].helditem = raidPlayers[front_player].helditem;
        delete raidPlayers[front_player].helditem
        game.clearItem(front_player);
        game.setItem("closestObjectTemplate", raidObjects[temp_obj_id].gather.normal, context.playerId);
      }
    }

    if (raidObjects[object_id] != undefined) {
      if (raidObjects[object_id].raid.trigger) {
        if (raidPlayers[context.playerId] != undefined) {
          takeItem(game, object_id, context.playerId, context.player.name, context.player.map, temp_key);
          console.log(`${context.player.name} has taken ${object_id}`);
        }
      }
    }
  });
});

const takeItem = ((game: any, obj_id: string, player_id: string, player_name: string, map: string, key: string) => {
  raidPlayers[player_id].helditem = obj_id;

  throttle(() => {
    game.setItem("closestObjectTemplate", raidObjects[obj_id].gather.normal, player_id);
    game.deleteObjectByKey(map, key);
  });
})

const placeItem = ((game: any, obj_id: string, front: { x: number, y: number }, player_id: string, player_name: string, map: string) => {
  raidObjects[obj_id].gather.x = front.x;
  raidObjects[obj_id].gather.y = front.y;
  raidObjects[obj_id].raid.map_id = map;

  throttle(() => {
    game.clearItem(player_id);
    game.setObject(map, obj_id, raidObjects[obj_id].gather);
  });

  throttle(() => {
    raidObjects[obj_id].key = game.getObject(obj_id).key;
    delete raidPlayers[player_id].helditem;
  });
});

const swapItem = ((game: any, held_id: string, obj_id: string, swap: { x: number, y: number }, player_id: string, player_name: string, map: string, held_key: string) => {
  throttle(() => {
    raidObjects[held_id].gather.x = swap.x;
    raidObjects[held_id].gather.y = swap.y;
    raidObjects[held_id].raid.map_id = map;
    game.clearItem(player_id);
    game.setObject(map, held_id, raidObjects[held_id].gather);
  });

  throttle(() => {
    raidObjects[held_id].key = game.getObject(held_id).key;
    raidPlayers[player_id].helditem = obj_id;
    game.setItem("closestObjectTemplate", raidObjects[obj_id].gather.normal, player_id);
    game.deleteObject(map, obj_id); //deleteObjectByKey hates swappable
  });
});