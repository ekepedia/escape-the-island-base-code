// import { game, raidConfetti, raidHand, raidObjects, raidPlayers, throttle, mods, builders, owners, raidPermissions } from '../index.js';
import { raidConfetti, raidHand, raidObjects, raidPlayers, throttle, mods, builders, owners, raidPermissions } from '../index.js';
import { checkSameEmojiSpace, getCurrentTime, findFrontPlayer, teleportForward, teleportSameEmoji, checkMod } from '../raid_lib/raidLib';
import axios from 'axios';

export const raidPlayerShootsConfetti = ((game) => {
  game.subscribeToEvent("playerShootsConfetti", (data, context) => {

    if (raidConfetti[context.playerId] == undefined) {
      raidConfetti[context.playerId] = 1;
    } else {
      raidConfetti[context.playerId]++;
    }

    // Non-Admins will have their raidPermissions all set to False
    if (raidPermissions[context.playerId] === undefined) {
      raidPermissions[context.playerId] = {
        DEFAULT_MOD: false,
        DEFAULT_BUILDER: false,
        OWNER: false
      };
    }

    console.log(context.player.name + " threw confetti total = " + raidConfetti[context.playerId])

    // teleport player in front of player
    // let front_player = findFrontPlayer(context.playerId, context.player.map);
    // if ( front_player != 'none' && context.player.textStatus == '/tp') {
    //   game.teleport(context.player.map, 5, 5, front_player);
    // }


    // ADMIN ONLY COMMANDS
    // #region

    if (raidPermissions[context.playerId].OWNER == true || raidPermissions[context.playerId].DEFAULT_MOD == true) {

      // teleport forward if mod with correct emoji
      if (context.player.emojiStatus == "▶️") {
        teleportForward(context.playerId, context.player.map, 1);

        if (context.player.direction == 9) {
          game.setItem("", "", context.playerId)
        }
      }

      // ETI Map Teleportation
      if (context.player.textStatus.includes("/eti")) {

        if (context.player.textStatus.includes("1") || context.player.textStatus.includes("beach")) {
          game.teleport("kayF_GdniUHiAXJ6NhLHT", 32, 41, context.playerId)
        }

        if (context.player.textStatus.includes("2") || context.player.textStatus.includes("maze")) {
          game.teleport("7bY0bQ5t5-M_yaLoZf-OA", 42, 37, context.playerId)
        }

        if (context.player.textStatus.includes("3") || context.player.textStatus.includes("jungle")) {
          game.teleport("4S6s6mZv9wsUtmTjV34Eg", 59, 66, context.playerId)
        }

        if (context.player.textStatus.includes("4") || context.player.textStatus.includes("cliff")) {
          game.teleport("w96F336TUBnQyxVXD35DP", 33, 45, context.playerId)
        }

        if (context.player.textStatus.includes("5") || context.player.textStatus.includes("finale")) {
          game.teleport("escape-the-island-demo-4", 24, 28, context.playerId)
        }

      }

      // Teleport everyone in the space to me
      if (context.player.textStatus === "/tptome") {
        try {

          let tpArray = [];
          tpArray = game.filterUidsInSpace((playerId) => playerId != context.playerId)

          for (let i = 0; i < tpArray.length; i++) {
            throttle(() => {
              game.teleport(context.player.map, context.player.x, context.player.y, tpArray[i])
              console.log("TP to me " + (tpArray.length - 1) + " players")

              // if (game.players[tpArray[i]].spotlighted == 1){
              //   game.setSpotlight(tpArray[i], false);
              //   console.log("Un-Spotlighted " + game.players[tpArray[i]].name);
              // }
            })
          }

        } catch (error) {
          console.error(error);
        }
      }


      // Add a collision tile in front of me
      if (context.player.textStatus === "/addblock") {

        let front_x = context.player.x, front_y = context.player.y
        let direction = context.player.direction;
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
            console.log("Dancing")
            break;
          default:
            console.log('invalid direction??');
        }
        game.setImpassable(context.player.map, front_x, front_y, true)
      }

      // Remove a collision tile in front of me
      if (context.player.textStatus === "/removeblock") {

        let front_x = context.player.x, front_y = context.player.y
        let direction = context.player.direction;
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
            console.log("Dancing")
            break;
          default:
            console.log('invalid direction??');
        }
        game.setImpassable(context.player.map, front_x, front_y, false)
      }



    }

    // #endregion



    // NON ADMIN COMMANDS

    if (context.player.emote == "🆘") {

      throttle(() => {
        game.setEmote("", context.playerId)
      });

      throttle(() => {
        game.setEmojiStatus("", context.playerId)
      });

      let handDuration = (Date.now() - raidHand[context.playerId]) / 1000;
      console.log("Support completed in: " + handDuration + " seconds")
      // game.chat("vYYichOiLcSq6LWPn5eUtccp5lH2", [], game.players["vYYichOiLcSq6LWPn5eUtccp5lH2"].map, { contents: getCurrentTime() + '\n' + context.player.name + " ✅ LOWERED their hand" + '\n' + "Completed in: " + handDuration + '\n' + '\n'});

      // Slack Lower Hand
      throttle(() => {

        const payload = {
          "text": getCurrentTime() + '\n' + context.player.name + " ✅ LOWERED their hand" + '\n' + "Completed in: " + handDuration + '\n' + '\n'
        }
        axios.post("https://hooks.slack.com/services/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", payload).then((res) => {
          // console.log(res.data);
          console.log("Lowered Hand Sent to Slack " + getCurrentTime())
        }).catch((error) => {
          console.log(error);
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
          "field_2": "Lowered hand",
          "field_3": handDuration,
          "timestamp": getCurrentTime()
        }
        axios.post("https://rtr-web.herokuapp.com/api/gather-tracker/luan-migration-raised-hand", payload).then((res) => {
          // console.log(res.data);
          console.log("lowered hand " + getCurrentTime())
        }).catch((error) => {
          console.log(error);
        })

      });

      throttle(() => {
        delete raidHand[context.playerId];
        console.log(raidHand[context.playerId])
      });



    }

    if (context.player.itemString != "") {

      if (context.player.emojiStatus != "▶️") {
        game.setItem("", "", context.playerId)
      }

    }


  })
})