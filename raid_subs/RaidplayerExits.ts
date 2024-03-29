// import { game, raidPlayerSpokeOnExit, raidPlayerTimeSpent, raidPlayersXY, raidConfetti, raidObjects, raidPlayers, raidSpawnRooms, throttle } from '../index.js';
import { raidPlayerSpokeOnExit, raidPlayerTimeSpent, raidPlayersXY, raidConfetti, raidObjects, raidPlayers, raidSpawnRooms, throttle } from '../index.js';
import { getCurrentTime, generateMask, checkSameEmojiSpace, findFrontPlayer, teleportForward, teleportSameEmoji } from '../raid_lib/raidLib';
import axios from 'axios';

export const raidPlayerExits = ((game) => {

    game.subscribeToEvent("playerExits", (data, context) => {

        let TotalSessionTime = ((Date.now() - raidPlayerTimeSpent[context.playerId]) / 1000)

        // let temp_key = (game.getObject(someObject.id.toString(), map) || {}).key || {};";
        // if (temp_key == undefined) {
        //   continue;
        // }

        throttle(() => {

            // Log Player Joins
            const payload = {
                "version": "1",
                "display_name": context.player.name,
                "space_id": game.spaceId,
                "map_id": context.player.map,
                "player_id": context.playerId,
                "player_xy": context.player.x + ", " + context.player.y,
                "field_1": data.playerExits.encId,
                "field_2": game.partialMaps[context.player.map].name,
                "field_3": raidPlayersXY[context.playerId] != undefined ? (raidPlayersXY[context.playerId].steps || 0) : "undefined",
                "field_4": raidPlayerSpokeOnExit[context.playerId] != undefined ? raidPlayerSpokeOnExit[context.playerId] : 0,
                "field_5": raidConfetti[context.playerId] != undefined ? raidConfetti[context.playerId] : 0,
                "field_6": TotalSessionTime != undefined ? TotalSessionTime : 0,
                "field_7": raidPlayerTimeSpent[context.playerId] || 0,
                // "field_8": raidGroupChatTotal[context.playerId] || 0,
                // "field_9": raidTaggedOther[context.playerId] != undefined ? raidTaggedOther[context.playerId]: 0,
                //  "field_9": raidTaggedOther[context.playerId] || 0,
                // "field_10": raidGotTagged[context.playerId] != undefined ? raidGotTagged[context.playerId]: 0,
                "timestamp": Date.now()
            }
            axios.post("https://rtr-web.herokuapp.com/api/gather-tracker/luan-migration-playerExits", payload).then((res) => {
                // console.log(res.data);
                console.log("playerExits " + getCurrentTime())
            }).catch((error) => {
                console.log(error);
            })

            console.log(context.player.name, "spent", TotalSessionTime != undefined ? TotalSessionTime : 0), "seconds this session";
            console.log(context.player.name, "took", raidPlayersXY[context.playerId] != undefined ? (raidPlayersXY[context.playerId].steps || 0) : "undefined" + " steps");
            console.log(context.player.name, "spoke for", raidPlayerSpokeOnExit[context.playerId] != undefined ? raidPlayerSpokeOnExit[context.playerId] : 0)
            console.log(context.player.name, "threw confetti", raidConfetti[context.playerId] != undefined ? raidConfetti[context.playerId] : 0);
            // console.log(context.player.name, "group conversations", raidGroupChatTotal[context.playerId] != undefined ? raidGroupChatTotal[context.playerId]: 0);
            // console.log(context.player.name, "tagged other players", raidTaggedOther[context.playerId] != undefined ? raidTaggedOther[context.playerId]: 0);
            // console.log(context.player.name, "got tagged", raidGotTagged[context.playerId] != undefined ? raidGotTagged[context.playerId]: 0);

        });


        throttle(() => {
            delete raidPlayersXY[context.playerId];
            // delete raidInventoryKarts[context.playerId];
        });



    });

})