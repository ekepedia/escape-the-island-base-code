"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.raidPlayerExits = void 0;
// import { game, raidPlayerSpokeOnExit, raidPlayerTimeSpent, raidPlayersXY, raidConfetti, raidObjects, raidPlayers, raidSpawnRooms, throttle } from '../index.js';
var index_js_1 = require("../index.js");
var raidLib_1 = require("../raid_lib/raidLib");
var axios_1 = __importDefault(require("axios"));
exports.raidPlayerExits = (function (game) {
    game.subscribeToEvent("playerExits", function (data, context) {
        var TotalSessionTime = ((Date.now() - index_js_1.raidPlayerTimeSpent[context.playerId]) / 1000);
        // let temp_key = (game.getObject(someObject.id.toString(), map) || {}).key || {};";
        // if (temp_key == undefined) {
        //   continue;
        // }
        (0, index_js_1.throttle)(function () {
            // Log Player Joins
            var payload = {
                "version": "1",
                "display_name": context.player.name,
                "space_id": game.spaceId,
                "map_id": context.player.map,
                "player_id": context.playerId,
                "player_xy": context.player.x + ", " + context.player.y,
                "field_1": data.playerExits.encId,
                "field_2": game.partialMaps[context.player.map].name,
                "field_3": index_js_1.raidPlayersXY[context.playerId] != undefined ? (index_js_1.raidPlayersXY[context.playerId].steps || 0) : "undefined",
                "field_4": index_js_1.raidPlayerSpokeOnExit[context.playerId] != undefined ? index_js_1.raidPlayerSpokeOnExit[context.playerId] : 0,
                "field_5": index_js_1.raidConfetti[context.playerId] != undefined ? index_js_1.raidConfetti[context.playerId] : 0,
                "field_6": TotalSessionTime != undefined ? TotalSessionTime : 0,
                "field_7": index_js_1.raidPlayerTimeSpent[context.playerId] || 0,
                // "field_8": raidGroupChatTotal[context.playerId] || 0,
                // "field_9": raidTaggedOther[context.playerId] != undefined ? raidTaggedOther[context.playerId]: 0,
                //  "field_9": raidTaggedOther[context.playerId] || 0,
                // "field_10": raidGotTagged[context.playerId] != undefined ? raidGotTagged[context.playerId]: 0,
                "timestamp": Date.now()
            };
            axios_1.default.post("https://rtr-web.herokuapp.com/api/gather-tracker/luan-migration-playerExits", payload).then(function (res) {
                // console.log(res.data);
                console.log("playerExits " + (0, raidLib_1.getCurrentTime)());
            }).catch(function (error) {
                console.log(error);
            });
            console.log(context.player.name, "spent", TotalSessionTime != undefined ? TotalSessionTime : 0), "seconds this session";
            console.log(context.player.name, "took", index_js_1.raidPlayersXY[context.playerId] != undefined ? (index_js_1.raidPlayersXY[context.playerId].steps || 0) : "undefined" + " steps");
            console.log(context.player.name, "spoke for", index_js_1.raidPlayerSpokeOnExit[context.playerId] != undefined ? index_js_1.raidPlayerSpokeOnExit[context.playerId] : 0);
            console.log(context.player.name, "threw confetti", index_js_1.raidConfetti[context.playerId] != undefined ? index_js_1.raidConfetti[context.playerId] : 0);
            // console.log(context.player.name, "group conversations", raidGroupChatTotal[context.playerId] != undefined ? raidGroupChatTotal[context.playerId]: 0);
            // console.log(context.player.name, "tagged other players", raidTaggedOther[context.playerId] != undefined ? raidTaggedOther[context.playerId]: 0);
            // console.log(context.player.name, "got tagged", raidGotTagged[context.playerId] != undefined ? raidGotTagged[context.playerId]: 0);
        });
        (0, index_js_1.throttle)(function () {
            delete index_js_1.raidPlayersXY[context.playerId];
            // delete raidInventoryKarts[context.playerId];
        });
    });
});
//# sourceMappingURL=RaidplayerExits.js.map