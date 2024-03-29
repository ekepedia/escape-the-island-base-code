"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.raidPlayerSetsEmoteV2 = void 0;
// import { game, raidConfetti, raidEmote, raidHand, raidObjects, raidPlayers, throttle, mods, builders, owners, raidPermissions } from '../index.js';
// import { formatDateTime, checkSameEmojiSpace, getCurrentTime, findFrontPlayer, teleportForward, teleportSameEmoji } from '../raid_lib/raidLib';
var index_js_1 = require("../index.js");
var raidLib_1 = require("../raid_lib/raidLib");
var axios_1 = __importDefault(require("axios"));
exports.raidPlayerSetsEmoteV2 = (function (game) {
    game.subscribeToEvent("playerSetsEmoteV2", function (data, context) {
        if (data.playerSetsEmoteV2.emote != "") {
            if (index_js_1.raidEmote[context.playerId] == undefined) {
                index_js_1.raidEmote[context.playerId] = 1;
            }
            else {
                index_js_1.raidEmote[context.playerId]++;
            }
        }
        console.log(data.playerSetsEmoteV2.emote);
        if (data.playerSetsEmoteV2.emote == "🤚") {
            // game.chat("vYYichOiLcSq6LWPn5eUtccp5lH2", [], game.players["vYYichOiLcSq6LWPn5eUtccp5lH2"].map, { contents: "🆕" + getCurrentTime() + '\n' + context.player.name + " 🤚 RAISED their hand" + '\n' + "🚀" + '\n' + "game.teleport(" + "game.players[" + '"' + context.playerId + '"' + "].map" + ", " + "game.players[" + '"' + context.playerId + '"' + "].x" + ", " + "game.players[" + '"' + context.playerId + '"' + "].y"  + ", " + "game.getMyPlayer().id" + ")" + '\n' + '\n'});
            if (context.player.emote != "🆘") {
                (0, index_js_1.throttle)(function () {
                    game.setEmote("🆘", context.playerId);
                });
                (0, index_js_1.throttle)(function () {
                    game.setEmojiStatus("🆘", context.playerId);
                });
            }
            if (index_js_1.raidHand[context.playerId] == undefined) {
                index_js_1.raidHand[context.playerId] = Date.now();
                console.log("Hand raised at " + index_js_1.raidHand[context.playerId]);
                // Slack Raise Hand
                // https://hooks.slack.com/services/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
                (0, index_js_1.throttle)(function () {
                    var payload = {
                        "text": "🆕" + (0, raidLib_1.getCurrentTime)() + '\n' + context.player.name + " 🆘 RAISED their hand" + '\n' + "🚀" + '\n' + "game.teleport(" + "game.players[" + '"' + context.playerId + '"' + "].map" + ", " + "game.players[" + '"' + context.playerId + '"' + "].x" + ", " + "game.players[" + '"' + context.playerId + '"' + "].y" + ", " + "game.getMyPlayer().id" + ")" + '\n' + '\n'
                    };
                    axios_1.default.post("https://hooks.slack.com/services/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", payload).then(function (res) {
                        // console.log(res.data);
                        console.log("Raised Hand Sent to Slack" + (0, raidLib_1.getCurrentTime)());
                    }).catch(function (error) {
                        console.log(error.data);
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
                        "field_2": "Raised hand",
                        "timestamp": (0, raidLib_1.getCurrentTime)()
                    };
                    axios_1.default.post("https://rtr-web.herokuapp.com/api/gather-tracker/hijinx-staging-raised-hand", payload).then(function (res) {
                        // console.log(res.data);
                        console.log("raised hand " + (0, raidLib_1.getCurrentTime)());
                    }).catch(function (error) {
                        console.log(error);
                    });
                });
            }
            else {
                console.log("Hand raised at " + (0, raidLib_1.formatDateTime)(index_js_1.raidHand[context.playerId]) + " for " + (Date.now() - index_js_1.raidHand[context.playerId]) / 1000 + "seconds");
            }
        }
    });
});
//# sourceMappingURL=RaidplayerSetsEmoteV2.js.map