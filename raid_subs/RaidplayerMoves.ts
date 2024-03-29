// import { game, player_cooldown, raidPlayersXY, raidObjects, raidPlayers, raidRaceTracks } from '../index.js';
import { player_cooldown, raidPlayersXY, raidRaceTracks } from '../index.js';

export const raidPlayerMoves = ((game, raidPlayers) => {
  game.subscribeToEvent("playerMoves", (data, context) => {
    if (raidPlayers[context.playerId] == undefined) {
      raidPlayers[context.playerId] = {
        id: context.playerId,
        name: context.player.name,
        map_id: context.player.map,
        x: data.playerMoves.x,
        y: data.playerMoves.y,
        direction: data.playerMoves.direction,
        steps: 0,
        rate_limit: {
          timer: player_cooldown.timer,
          counter: player_cooldown.counter,
          max_counter: player_cooldown.max_counter,
          cooldown: player_cooldown.cooldown,
          remaining: player_cooldown.remaining
        }
      }

    } else {
      raidPlayers[context.playerId].map_id = context.player.map;
      raidPlayers[context.playerId].x = data.playerMoves.x;
      raidPlayers[context.playerId].y = data.playerMoves.y;
      raidPlayers[context.playerId].direction = data.playerMoves.direction;
    }

    if (raidPlayersXY[context.playerId] == undefined) {
      raidPlayersXY[context.playerId.toString()] = {
        x: context.player.x,
        y: context.player.y,
        map_id: context.player.map,
        steps: data.playerMoves.lastInputId
      }
    } else {
      raidPlayersXY[context.playerId.toString()] = {
        x: context.player.x,
        y: context.player.y,
        map_id: context.player.map,
        steps: data.playerMoves.lastInputId
      }
    }

    //Raid Race checker
    // Object.keys(raidRaceTracks).forEach((key, value) => {
    //   raidRaceTracks[key].update(raidPlayers[context.playerId].id, raidPlayers[context.playerId].name, {x: raidPlayers[context.playerId].x, y: raidPlayers[context.playerId].y}, context.player.map);
    // })

    raidPlayers[context.playerId].steps++;
  });
});