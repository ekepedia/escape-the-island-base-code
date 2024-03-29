// import { game, raidConfetti, raidEmote, raidHand, raidObjects, raidPlayers, throttle, mods, builders, owners, raidPermissions } from '../index.js';
// import { formatDateTime, checkSameEmojiSpace, getCurrentTime, findFrontPlayer, teleportForward, teleportSameEmoji } from '../raid_lib/raidLib';
import { raidEmote, raidHand, throttle, } from '../index.js';
import { formatDateTime, getCurrentTime } from '../raid_lib/raidLib';
import axios from 'axios';

export const raidPlayerSetsEmoteV2 = ((game) => {
  game.subscribeToEvent("playerSetsEmoteV2", (data, context) => {

    if (data.playerSetsEmoteV2.emote != "") {
      if (raidEmote[context.playerId] == undefined) {
        raidEmote[context.playerId] = 1;
      } else {
        raidEmote[context.playerId]++;
      }
    }

    console.log(data.playerSetsEmoteV2.emote)

    if (data.playerSetsEmoteV2.emote == "🤚") {
      // game.chat("vYYichOiLcSq6LWPn5eUtccp5lH2", [], game.players["vYYichOiLcSq6LWPn5eUtccp5lH2"].map, { contents: "🆕" + getCurrentTime() + '\n' + context.player.name + " 🤚 RAISED their hand" + '\n' + "🚀" + '\n' + "game.teleport(" + "game.players[" + '"' + context.playerId + '"' + "].map" + ", " + "game.players[" + '"' + context.playerId + '"' + "].x" + ", " + "game.players[" + '"' + context.playerId + '"' + "].y"  + ", " + "game.getMyPlayer().id" + ")" + '\n' + '\n'});

      if (context.player.emote != "🆘") {
        throttle(() => {
          game.setEmote("🆘", context.playerId)
        });

        throttle(() => {
          game.setEmojiStatus("🆘", context.playerId)
        });
      }

      if (raidHand[context.playerId] == undefined) {
        raidHand[context.playerId] = Date.now();
        console.log("Hand raised at " + raidHand[context.playerId])

        // Slack Raise Hand
        // https://hooks.slack.com/services/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

        throttle(() => {

          const payload = {
            "text": "🆕" + getCurrentTime() + '\n' + context.player.name + " 🆘 RAISED their hand" + '\n' + "🚀" + '\n' + "game.teleport(" + "game.players[" + '"' + context.playerId + '"' + "].map" + ", " + "game.players[" + '"' + context.playerId + '"' + "].x" + ", " + "game.players[" + '"' + context.playerId + '"' + "].y" + ", " + "game.getMyPlayer().id" + ")" + '\n' + '\n'
          }
          axios.post("https://hooks.slack.com/services/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", payload).then((res) => {
            // console.log(res.data);
            console.log("Raised Hand Sent to Slack" + getCurrentTime())
          }).catch((error) => {
            console.log(error.data);
          })

        });

        throttle(() => {

          const payload = {
            "space_id": game.spaceId,
            "map_id": context.player.map,
            "player_id": context.playerId,
            "display_name": context.player.name,
            "increment": 1,
            "field_1": raidHand[context.playerId],
            "field_2": "Raised hand",
            "timestamp": getCurrentTime()
          }
          axios.post("https://rtr-web.herokuapp.com/api/gather-tracker/hijinx-staging-raised-hand", payload).then((res) => {
            // console.log(res.data);
            console.log("raised hand " + getCurrentTime())
          }).catch((error) => {
            console.log(error);
          })

        });

      } else {
        console.log("Hand raised at " + formatDateTime(raidHand[context.playerId]) + " for " + (Date.now() - raidHand[context.playerId]) / 1000 + "seconds")
      }


    }


  });

});