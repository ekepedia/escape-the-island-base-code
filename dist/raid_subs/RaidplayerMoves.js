"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.raidPlayerMoves = void 0;
// import { game, player_cooldown, raidPlayersXY, raidObjects, raidPlayers, raidRaceTracks } from '../index.js';
var index_js_1 = require("../index.js");
exports.raidPlayerMoves = (function (game, raidPlayers) {
    game.subscribeToEvent("playerMoves", function (data, context) {
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
                    timer: index_js_1.player_cooldown.timer,
                    counter: index_js_1.player_cooldown.counter,
                    max_counter: index_js_1.player_cooldown.max_counter,
                    cooldown: index_js_1.player_cooldown.cooldown,
                    remaining: index_js_1.player_cooldown.remaining
                }
            };
        }
        else {
            raidPlayers[context.playerId].map_id = context.player.map;
            raidPlayers[context.playerId].x = data.playerMoves.x;
            raidPlayers[context.playerId].y = data.playerMoves.y;
            raidPlayers[context.playerId].direction = data.playerMoves.direction;
        }
        if (index_js_1.raidPlayersXY[context.playerId] == undefined) {
            index_js_1.raidPlayersXY[context.playerId.toString()] = {
                x: context.player.x,
                y: context.player.y,
                map_id: context.player.map,
                steps: data.playerMoves.lastInputId
            };
        }
        else {
            index_js_1.raidPlayersXY[context.playerId.toString()] = {
                x: context.player.x,
                y: context.player.y,
                map_id: context.player.map,
                steps: data.playerMoves.lastInputId
            };
        }
        //Raid Race checker
        // Object.keys(raidRaceTracks).forEach((key, value) => {
        //   raidRaceTracks[key].update(raidPlayers[context.playerId].id, raidPlayers[context.playerId].name, {x: raidPlayers[context.playerId].x, y: raidPlayers[context.playerId].y}, context.player.map);
        // })
        raidPlayers[context.playerId].steps++;
    });
});
//# sourceMappingURL=RaidplayerMoves.js.map