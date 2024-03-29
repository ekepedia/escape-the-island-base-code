"use strict";
// import { game, raidObjects, raidPlayers } from '../index.js';
Object.defineProperty(exports, "__esModule", { value: true });
exports.raidPlayerSetsVehicleId = void 0;
exports.raidPlayerSetsVehicleId = (function (game) {
    game.subscribeToEvent("playerSetsVehicleId", function (data, context) {
        // // When a player dismounts a kart
        // if ((context.player.vehicleId == '' || context.player.vehicleId == undefined) && raidPlayers[context.playerId].kart != undefined) {
        //   // game.setObject(context.player.map, raidPlayers[context.playerId].kart.id, {
        //   //   distThreshold: 1,
        //   //   height: 1,
        //   //   id: raidPlayers[context.playerId].kart.id,
        //   //   normal: raidPlayers[context.playerId].kart.vehicleNormal,
        //   //   objectPlacerId: "EnDN0AD9oSXG8cgfpW5gGHPwIYJ3",
        //   //   previewMessage: "Press x to ride go-kart!",
        //   //   properties: {
        //   //     vehicleSpritesheet: raidPlayers[context.playerId].kart.vehicleSpritesheet,
        //   //     vehicleNormal: raidPlayers[context.playerId].kart.vehicleNormal
        //   //   },
        //   //   templateId: "GOKART",
        //   //   type: 5,
        //   //   width: 1,
        //   //   x: context.player.x,
        //   //   y: context.player.y,
        //   //   zIndex: 4,
        //   //   _name: "Go-kart",
        //   //   _tags: [],
        //   // });
        //   console.log(`${context.player.name} has dismounted ${raidPlayers[context.playerId].kart.id}`);
        //   // delete raidPlayers[context.playerId].kart;
        //   // game.setSpeedModifier(1, context.playerId);
        //   return;
        // }
        // // When player mounts a kart
        // if (context.player.vehicleId != '' && context.player.vehicleId != undefined) {
        //   // // Retrieve kart information from player
        //   // let temp_obj = JSON.parse(data.playerSetsVehicleId.vehicleId);
        //   // raidPlayers[context.playerId].kart = temp_obj;
        //   // // Set kart speed
        //   // game.setSpeedModifier(2, context.playerId);
        //   //console.log(raidPlayers[context.playerId].kart );
        //   console.log(`${context.player.name} has mounted ${raidPlayers[context.playerId].kart.id}`);
        // }
        if (context.player.vehicleId != "" && context.player.vehicleId != undefined) {
            console.log(context.player.name + " has mounted " + JSON.parse(context.player.vehicleId).id);
        }
        if (context.player.vehicleId == "" && context.player.vehicleId != undefined) {
            console.log(context.player.name + " has dismounted");
        }
        // console.log(context.player.vehicleId)
    });
});
//# sourceMappingURL=RaidplayerSetsVehicleId.js.map