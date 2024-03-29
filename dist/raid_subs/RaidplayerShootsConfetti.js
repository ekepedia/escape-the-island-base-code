"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.raidPlayerShootsConfetti = void 0;
// import { game, raidConfetti, raidHand, raidObjects, raidPlayers, throttle, mods, builders, owners, raidPermissions } from '../index.js';
var index_js_1 = require("../index.js");
var raidLib_1 = require("../raid_lib/raidLib");
var axios_1 = __importDefault(require("axios"));
exports.raidPlayerShootsConfetti = (function (game) {
    game.subscribeToEvent("playerShootsConfetti", function (data, context) {
        if (index_js_1.raidConfetti[context.playerId] == undefined) {
            index_js_1.raidConfetti[context.playerId] = 1;
        }
        else {
            index_js_1.raidConfetti[context.playerId]++;
        }
        // Non-Admins will have their raidPermissions all set to False
        if (index_js_1.raidPermissions[context.playerId] === undefined) {
            index_js_1.raidPermissions[context.playerId] = {
                DEFAULT_MOD: false,
                DEFAULT_BUILDER: false,
                OWNER: false
            };
        }
        console.log(context.player.name + " threw confetti total = " + index_js_1.raidConfetti[context.playerId]);
        // teleport player in front of player
        // let front_player = findFrontPlayer(context.playerId, context.player.map);
        // if ( front_player != 'none' && context.player.textStatus == '/tp') {
        //   game.teleport(context.player.map, 5, 5, front_player);
        // }
        // ADMIN ONLY COMMANDS
        // #region
        if (index_js_1.raidPermissions[context.playerId].OWNER == true || index_js_1.raidPermissions[context.playerId].DEFAULT_MOD == true) {
            // teleport forward if mod with correct emoji
            if (context.player.emojiStatus == "▶️") {
                (0, raidLib_1.teleportForward)(context.playerId, context.player.map, 1);
                if (context.player.direction == 9) {
                    game.setItem("", "", context.playerId);
                }
            }
            // ETI Map Teleportation
            if (context.player.textStatus.includes("/eti")) {
                if (context.player.textStatus.includes("1") || context.player.textStatus.includes("beach")) {
                    game.teleport("kayF_GdniUHiAXJ6NhLHT", 32, 41, context.playerId);
                }
                if (context.player.textStatus.includes("2") || context.player.textStatus.includes("maze")) {
                    game.teleport("7bY0bQ5t5-M_yaLoZf-OA", 42, 37, context.playerId);
                }
                if (context.player.textStatus.includes("3") || context.player.textStatus.includes("jungle")) {
                    game.teleport("4S6s6mZv9wsUtmTjV34Eg", 59, 66, context.playerId);
                }
                if (context.player.textStatus.includes("4") || context.player.textStatus.includes("cliff")) {
                    game.teleport("w96F336TUBnQyxVXD35DP", 33, 45, context.playerId);
                }
                if (context.player.textStatus.includes("5") || context.player.textStatus.includes("finale")) {
                    game.teleport("escape-the-island-demo-4", 24, 28, context.playerId);
                }
            }
            // Teleport everyone in the space to me
            if (context.player.textStatus === "/tptome") {
                try {
                    var tpArray_1 = [];
                    tpArray_1 = game.filterUidsInSpace(function (playerId) { return playerId != context.playerId; });
                    var _loop_1 = function (i) {
                        (0, index_js_1.throttle)(function () {
                            game.teleport(context.player.map, context.player.x, context.player.y, tpArray_1[i]);
                            console.log("TP to me " + (tpArray_1.length - 1) + " players");
                            // if (game.players[tpArray[i]].spotlighted == 1){
                            //   game.setSpotlight(tpArray[i], false);
                            //   console.log("Un-Spotlighted " + game.players[tpArray[i]].name);
                            // }
                        });
                    };
                    for (var i = 0; i < tpArray_1.length; i++) {
                        _loop_1(i);
                    }
                }
                catch (error) {
                    console.error(error);
                }
            }
            // Add a collision tile in front of me
            if (context.player.textStatus === "/addblock") {
                var front_x = context.player.x, front_y = context.player.y;
                var direction = context.player.direction;
                switch (context.player.direction) {
                    case 3:
                    case 4:
                        front_y--;
                        break;
                    case 7:
                    case 8:
                        front_x++;
                        break;
                    case 1:
                    case 2:
                        front_y++;
                        break;
                    case 5:
                    case 6:
                        front_x--;
                    case 9:
                        console.log("Dancing");
                        break;
                    default:
                        console.log('invalid direction??');
                }
                game.setImpassable(context.player.map, front_x, front_y, true);
            }
            // Remove a collision tile in front of me
            if (context.player.textStatus === "/removeblock") {
                var front_x = context.player.x, front_y = context.player.y;
                var direction = context.player.direction;
                switch (context.player.direction) {
                    case 3:
                    case 4:
                        front_y--;
                        break;
                    case 7:
                    case 8:
                        front_x++;
                        break;
                    case 1:
                    case 2:
                        front_y++;
                        break;
                    case 5:
                    case 6:
                        front_x--;
                    case 9:
                        console.log("Dancing");
                        break;
                    default:
                        console.log('invalid direction??');
                }
                game.setImpassable(context.player.map, front_x, front_y, false);
            }
        }
        // #endregion
        // NON ADMIN COMMANDS
        if (context.player.emote == "🆘") {
            (0, index_js_1.throttle)(function () {
                game.setEmote("", context.playerId);
            });
            (0, index_js_1.throttle)(function () {
                game.setEmojiStatus("", context.playerId);
            });
            var handDuration_1 = (Date.now() - index_js_1.raidHand[context.playerId]) / 1000;
            console.log("Support completed in: " + handDuration_1 + " seconds");
            // game.chat("vYYichOiLcSq6LWPn5eUtccp5lH2", [], game.players["vYYichOiLcSq6LWPn5eUtccp5lH2"].map, { contents: getCurrentTime() + '\n' + context.player.name + " ✅ LOWERED their hand" + '\n' + "Completed in: " + handDuration + '\n' + '\n'});
            // Slack Lower Hand
            (0, index_js_1.throttle)(function () {
                var payload = {
                    "text": (0, raidLib_1.getCurrentTime)() + '\n' + context.player.name + " ✅ LOWERED their hand" + '\n' + "Completed in: " + handDuration_1 + '\n' + '\n'
                };
                axios_1.default.post("https://hooks.slack.com/services/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", payload).then(function (res) {
                    // console.log(res.data);
                    console.log("Lowered Hand Sent to Slack " + (0, raidLib_1.getCurrentTime)());
                }).catch(function (error) {
                    console.log(error);
                });
            });
            (0, index_js_1.throttle)(function () {
                var payload = {
                    "space_id": game.spaceId,
                    "map_id": context.player.map,
                    "player_id": context.playerId,
                    "display_name": context.player.name,
                    "increment": 1,
                    "field_1": index_js_1.raidHand[context.playerId],
                    "field_2": "Lowered hand",
                    "field_3": handDuration_1,
                    "timestamp": (0, raidLib_1.getCurrentTime)()
                };
                axios_1.default.post("https://rtr-web.herokuapp.com/api/gather-tracker/luan-migration-raised-hand", payload).then(function (res) {
                    // console.log(res.data);
                    console.log("lowered hand " + (0, raidLib_1.getCurrentTime)());
                }).catch(function (error) {
                    console.log(error);
                });
            });
            (0, index_js_1.throttle)(function () {
                delete index_js_1.raidHand[context.playerId];
                console.log(index_js_1.raidHand[context.playerId]);
            });
        }
        if (context.player.itemString != "") {
            if (context.player.emojiStatus != "▶️") {
                game.setItem("", "", context.playerId);
            }
        }
    });
});
//# sourceMappingURL=RaidplayerShootsConfetti.js.map