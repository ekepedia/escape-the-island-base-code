// import { game, raidPlayerSpokeOnExit, raidPlayerTimeSpent, raidPlayersXY, raidConfetti, raidObjects, raidPlayers, raidSpawnRooms, throttle } from '../index.js';
import { raidPlayerSpokeOnExit, raidPlayerTimeSpent, raidPlayersXY, raidConfetti, raidObjects, raidPlayers, raidSpawnRooms, throttle } from '../index.js';
import { getCurrentTime, generateMask, checkSameEmojiSpace, findFrontPlayer, teleportForward, teleportSameEmoji } from '../raid_lib/raidLib.js';
import axios from 'axios';

export const raidPlayerSetsAffiliation = ((game) => {
  game.subscribeToEvent("playerSetsAffiliation", (data, context) => {

    throttle(() => {

      if (!game.players[context.playerId])
        return;

      let dynamicAvatar = "https://dynamic-assets.gather.town/v2/sprite-profile/avatar-";
      let usedAvatar = []

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
      const payload = {
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
      }
      axios.post("https://rtr-web.herokuapp.com/api/gather-tracker/luan-migration-playerSetsAffiliation", payload).then((res) => {
        // console.log(res.data);
        console.log("playerSetsAffiliation " + getCurrentTime())
      }).catch((error) => {
        console.log(error);
      })

      raidPlayerTimeSpent[context.playerId] = Date.now();

    });

  });
});