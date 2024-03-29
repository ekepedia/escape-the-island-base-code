"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.raidPlayerSetsAffiliation = void 0;
// import { game, raidPlayerSpokeOnExit, raidPlayerTimeSpent, raidPlayersXY, raidConfetti, raidObjects, raidPlayers, raidSpawnRooms, throttle } from '../index.js';
var index_js_1 = require("../index.js");
var raidLib_js_1 = require("../raid_lib/raidLib.js");
var axios_1 = __importDefault(require("axios"));
exports.raidPlayerSetsAffiliation = (function (game) {
    game.subscribeToEvent("playerSetsAffiliation", function (data, context) {
        (0, index_js_1.throttle)(function () {
            if (!game.players[context.playerId])
                return;
            var dynamicAvatar = "https://dynamic-assets.gather.town/v2/sprite-profile/avatar-";
            var usedAvatar = [];
            // Get an array of all values from the JSON object
            var allValues = Object.values(game.players[context.playerId].currentlyEquippedWearables);
            // Filter out the values that are not blank or empty strings
            var nonBlankValues = allValues.filter(function (value) {
                return value !== '';
            });
            usedAvatar = nonBlankValues;
            // console.log(usedAvatar);
            // Create a new string with each value followed by a period
            var concatenatedString = nonBlankValues.join('.');
            dynamicAvatar = dynamicAvatar + concatenatedString + ".png";
            // console.log(dynamicAvatar);
            // Log Player Joins
            var payload = {
                "version": "1",
                "display_name": context.player.name,
                "space_id": game.spaceId,
                "map_id": context.player.map,
                "player_id": context.playerId,
                "player_xy": context.player.x + ", " + context.player.y,
                "field_1": game.partialMaps[context.player.map].name,
                // "field_2": JSON.parse(game.players[context.playerId].outfitString).other.previewUrl,
                "field_2": dynamicAvatar != undefined ? (dynamicAvatar || 0) : "undefined",
                "timestamp": Date.now()
            };
            axios_1.default.post("https://rtr-web.herokuapp.com/api/gather-tracker/luan-migration-playerSetsAffiliation", payload).then(function (res) {
                // console.log(res.data);
                console.log("playerSetsAffiliation " + (0, raidLib_js_1.getCurrentTime)());
            }).catch(function (error) {
                console.log(error);
            });
            index_js_1.raidPlayerTimeSpent[context.playerId] = Date.now();
        });
    });
});
//# sourceMappingURL=RaidplayerSetsAffiliation.js.map