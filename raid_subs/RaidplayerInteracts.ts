// import { game, raidObjects, raidPlayers, raidSpawnRooms, throttle } from '../index.js';
import { raidObjects, raidPlayers, raidSpawnRooms, throttle } from '../index.js';
// import { RaidSpawnZone } from '../raid_classes/RaidSpawnZone.js';
import {
  checkStartGameTimer,
  interactsFirePit,
  interactsTikiTorch,
  checkTribondsPuzzle,
  playerRateLimit,
  getCurrentTime,
  generateMask,
  checkSameEmojiSpace,
  findFrontPlayer,
  teleportForward,
  teleportSameEmoji,
  checkCodebreaker_1st_Digit,
  checkCodebreaker_2nd_Digit,
  checkCodebreaker_3rd_Digit,
  postGrabKey,
  postMazeCompleted,
  postLockboxUnlocked,
  useMagicCircle,
  checkOldManText,

} from '../raid_lib/raidLib';

import axios from 'axios';

export const raidPlayerInteracts = ((game) => {
  game.subscribeToEvent("playerInteractsWithObject", (data, context) => {
    let temp_key = data.playerInteractsWithObject.key;
    let object_id = Object.keys(raidObjects).find((key) => raidObjects[key].key === temp_key);
    let thisObject = game.getObjectByKey(context.player.map, temp_key);

    // Cooldown Code
    if (playerRateLimit(raidPlayers[context.playerId])) return;

    // Run if the object is a raid object
    if (raidObjects[object_id] != undefined) {
      if (data.playerInteractsWithObject.dataJson) {
        // Grabs the dataJson from the object for Type 7 modals and runs the interaction function
        raidObjects[object_id].interaction(context.player, data.playerInteractsWithObject.dataJson);

        // List all Type 7 raidObjects here
        // ******************************************************************************************************************************************************************************************************

        // Game Start
        // #region

        if (object_id === "game_start_timer") {

          let json_data = data.playerInteractsWithObject.dataJson;
          // console.log(json_data);

          if (!json_data)
            return

          let parsed_JSON = JSON.parse(json_data);
          // console.log(parsed_JSON);

          let game_start_timer_input = parsed_JSON.game_start_timer_input.toLowerCase();

          // console.log(codebreaker_submit_1_input);

          // Start Status Check
          if (parsed_JSON = !undefined && game_start_timer_input != undefined) {

            checkStartGameTimer(context.player.map, context.playerId, context.player, object_id, game_start_timer_input);

          }
        }

        // #endregion


        // Codebreaker Puzzle - Type 7s
        // #region

        if (object_id == "codebreaker_submit_1") {
          let json_data = data.playerInteractsWithObject.dataJson;
          // console.log(json_data);

          if (!json_data)
            return

          let parsed_JSON = JSON.parse(json_data);
          // console.log(parsed_JSON);

          let codebreaker_submit_1_input = parsed_JSON.codebreaker_submit_1_input.toLowerCase();

          // console.log(codebreaker_submit_1_input);

          // Start Status Check
          if (parsed_JSON = !undefined && codebreaker_submit_1_input != undefined) {
            checkCodebreaker_1st_Digit(context.player.map, context.playerId, context.player, object_id, codebreaker_submit_1_input);
          }
        }

        if (object_id == "codebreaker_submit_2") {
          let json_data = data.playerInteractsWithObject.dataJson;
          // console.log(json_data);

          if (!json_data)
            return

          let parsed_JSON = JSON.parse(json_data);
          // console.log(parsed_JSON);

          let codebreaker_submit_2_input = parsed_JSON.codebreaker_submit_2_input.toLowerCase();

          // console.log(codebreaker_submit_2_input);

          // Start Status Check
          if (parsed_JSON = !undefined && codebreaker_submit_2_input != undefined) {
            checkCodebreaker_2nd_Digit(context.player.map, context.playerId, context.player, object_id, codebreaker_submit_2_input);
          }
        }

        if (object_id == "codebreaker_submit_3") {
          let json_data = data.playerInteractsWithObject.dataJson;
          // console.log(json_data);

          if (!json_data)
            return

          let parsed_JSON = JSON.parse(json_data);
          // console.log(parsed_JSON);

          let codebreaker_submit_3_input = parsed_JSON.codebreaker_submit_3_input.toLowerCase();

          // console.log(codebreaker_submit_3_input);

          // Start Status Check
          if (parsed_JSON = !undefined && codebreaker_submit_3_input != undefined) {
            checkCodebreaker_3rd_Digit(context.player.map, context.playerId, context.player, object_id, codebreaker_submit_3_input);
          }
        }

        // #endregion


        // Jungle - Type 7s
        // #region

        if (object_id == "magic_circle") {
          let json_data = data.playerInteractsWithObject.dataJson;
          // console.log(json_data);

          if (!json_data)
            return

          let parsed_JSON = JSON.parse(json_data);
          // console.log(parsed_JSON);

          let magic_circle_input = parsed_JSON.magic_circle_input.toLowerCase();

          // console.log(codebreaker_submit_1_input);

          // Start Status Check
          if (parsed_JSON = !undefined && magic_circle_input != undefined) {

            useMagicCircle(context.player.map, context.playerId, context.player, object_id, magic_circle_input);

          }
        }

        if (object_id == "old_man_text") {
          let json_data = data.playerInteractsWithObject.dataJson;
          // console.log(json_data);

          if (!json_data)
            return

          let parsed_JSON = JSON.parse(json_data);
          // console.log(parsed_JSON);

          let old_man_text_input = parsed_JSON.old_man_text_input.toLowerCase();

          // console.log(codebreaker_submit_1_input);

          // Start Status Check
          if (parsed_JSON = !undefined && old_man_text_input != undefined) {

            checkOldManText(context.player.map, context.playerId, context.player, object_id, old_man_text_input);

          }
        }

        // Animal Text
        // #region

        // Sheep Text
        if (object_id == "sheep_text") {

          let json_data = data.playerInteractsWithObject.dataJson;
          // console.log(json_data);

          if (!json_data)
            return

          let parsed_JSON = JSON.parse(json_data);
          // console.log(parsed_JSON);

          let sheep_text_input = parsed_JSON.sheep_text_input.toLowerCase();

          // console.log(codebreaker_submit_1_input);

          // Start Status Check
          if (parsed_JSON = !undefined && sheep_text_input != undefined) {

            if (sheep_text_input === "yes" && context.player.currentlyEquippedWearables.costume === "akANoLHkQWGRHia0uYgg") {
              game.chat("ROOM_CHAT", [], context.player.map, { contents: "Hi " + context.player.name + ", my fluffy friend!" + '\n' + "Since you're one of us, I know that the FROG likes ACORNS." + '\n' + '\n' });
            }

            if (sheep_text_input === "yes" && context.player.currentlyEquippedWearables.costume != "akANoLHkQWGRHia0uYgg") {
              game.chat("ROOM_CHAT", [], context.player.map, { contents: "Hmm, I can't trust you, " + context.player.name + " until you speak my language" + '\n' + '\n' });
            }

          }
        }

        // Chicken Text
        if (object_id == "chicken_text") {

          let json_data = data.playerInteractsWithObject.dataJson;
          // console.log(json_data);

          if (!json_data)
            return

          let parsed_JSON = JSON.parse(json_data);
          // console.log(parsed_JSON);

          let chicken_text_input = parsed_JSON.chicken_text_input.toLowerCase();

          // console.log(codebreaker_submit_1_input);

          // Start Status Check
          if (parsed_JSON = !undefined && chicken_text_input != undefined) {

            if (chicken_text_input === "yes" && context.player.currentlyEquippedWearables.costume === "wesl312rqJvIVHpU1pJ0") {
              game.chat("ROOM_CHAT", [], context.player.map, { contents: "Hi " + context.player.name + ", my feathery friend!" + '\n' + "Since you're one of us, I know that the MOUSE likes GRAPES." + '\n' + '\n' });
            }

            if (chicken_text_input === "yes" && context.player.currentlyEquippedWearables.costume != "wesl312rqJvIVHpU1pJ0") {
              game.chat("ROOM_CHAT", [], context.player.map, { contents: "Hmm, I can't trust you, " + context.player.name + " until you speak my language" + '\n' + '\n' });
            }

          }
        }

        // Frog Text
        if (object_id == "frog_text") {

          let json_data = data.playerInteractsWithObject.dataJson;
          // console.log(json_data);

          if (!json_data)
            return

          let parsed_JSON = JSON.parse(json_data);
          // console.log(parsed_JSON);

          let frog_text_input = parsed_JSON.frog_text_input.toLowerCase();

          // console.log(codebreaker_submit_1_input);

          // Start Status Check
          if (parsed_JSON = !undefined && frog_text_input != undefined) {

            if (frog_text_input === "yes" && context.player.currentlyEquippedWearables.costume === "7U3AcqhrNsHnqX66rdcV") {
              game.chat("ROOM_CHAT", [], context.player.map, { contents: "Hi " + context.player.name + ", my slimy friend!" + '\n' + "Since you're one of us, I know that the CHICKEN likes APPLES." + '\n' + '\n' });
            }

            if (frog_text_input === "yes" && context.player.currentlyEquippedWearables.costume != "7U3AcqhrNsHnqX66rdcV") {
              game.chat("ROOM_CHAT", [], context.player.map, { contents: "Hmm, I can't trust you, " + context.player.name + " until you speak my language" + '\n' + '\n' });
            }

          }
        }

        // Mouse Text
        if (object_id == "mouse_text") {

          let json_data = data.playerInteractsWithObject.dataJson;
          // console.log(json_data);

          if (!json_data)
            return

          let parsed_JSON = JSON.parse(json_data);
          // console.log(parsed_JSON);

          let mouse_text_input = parsed_JSON.mouse_text_input.toLowerCase();

          // console.log(codebreaker_submit_1_input);

          // Start Status Check
          if (parsed_JSON = !undefined && mouse_text_input != undefined) {

            if (mouse_text_input === "yes" && context.player.currentlyEquippedWearables.costume === "QIQvEXvXF3mw6knrlkvS") {
              game.chat("ROOM_CHAT", [], context.player.map, { contents: "Hi " + context.player.name + ", my furry friend!" + '\n' + "Since you're one of us, I know that the SHEEP likes STRAWBERRIES." + '\n' + '\n' });
            }

            if (mouse_text_input === "yes" && context.player.currentlyEquippedWearables.costume != "QIQvEXvXF3mw6knrlkvS") {
              game.chat("ROOM_CHAT", [], context.player.map, { contents: "Hmm, I can't trust you, " + context.player.name + " until you speak my language" + '\n' + '\n' });
            }

          }
        }

        // #endregion



        // #endregion

        // #endregion


      } else {

        raidObjects[object_id].interaction(context.player);

        // List all Type 5 and others here (No Type 7 BELOW - ONLY ALLOWED ABOVE)
        // ***********************************************************************
        // #region

        console.log(object_id);

        // Tribonds Puzzle
        // #region

        if (object_id.includes("tribond")) {

          throttle(() => {
            game.setItem(object_id, thisObject.normal, context.playerId);
            game.playSound("https://s3.amazonaws.com/raidtheroom.online/gather/sounds/grab-item.mp3", 1, context.playerId);
          })

        }

        if (object_id.includes("dropzone")) {

          // Pick up item
          if (context.player.itemString == "") {

            if (thisObject.normal === "https://s3.amazonaws.com/www.raidtheroom.online/gather-images/gather-image-1706394531767-blank.png") {
              return;
            }
            else if (thisObject.normal != "https://s3.amazonaws.com/www.raidtheroom.online/gather-images/gather-image-1706394531767-blank.png") {

              throttle(() => {
                game.setItem(object_id, thisObject.normal, context.playerId);
                game.playSound("https://s3.amazonaws.com/raidtheroom.online/gather/sounds/place-down.mp3", 0.5, context.playerId);

              });

              throttle(() => {

                game.setObject(context.player.map, object_id.toString(), {
                  normal: "https://s3.amazonaws.com/www.raidtheroom.online/gather-images/gather-image-1706394531767-blank.png", // Blank
                  highlighted: "https://s3.amazonaws.com/www.raidtheroom.online/gather-images/gather-image-1706394531767-blank.png", // Blank
                });

              })

            }


          }

          if (context.player.itemString != "" && context.player.itemString != undefined) {
            if (JSON.parse(context.player.itemString).image != undefined) {

              let itemURL = JSON.parse(context.player.itemString).image;

              throttle(() => {
                game.setObject(context.player.map, object_id.toString(), {
                  normal: itemURL,
                  highlighted: itemURL,
                })

                game.playSound("https://s3.amazonaws.com/raidtheroom.online/gather/sounds/place-down.mp3", 1, context.playerId)

                throttle(() => {
                  game.setItem(object_id, thisObject.normal, context.playerId);
                })

              });

            }




          }

          checkTribondsPuzzle(context.player.map, context.playerId, context.player, object_id);


        }

        // #endregion


        // Tiki Torch Puzzle
        // #region

        if (object_id === "firepit") {
          interactsFirePit(context.player.map, context.playerId, context.player, object_id);
        }

        if (object_id.includes("tiki_torch")) {

          if (context.player.itemString.includes("firepit")) {
            interactsTikiTorch(context.player.map, context.playerId, context.player, object_id);
          }

        }

        // #endregion


        // Maze Puzzle
        // #region

        if (object_id.includes("key")) {

          if (object_id.includes("purple")) {
            throttle(() => {
              game.setItem("purple-key", "https://s3.amazonaws.com/www.raidtheroom.online/gather-images/gather-image-1707471960478-custom-purple-key.png", context.playerId);
              game.playSound("https://s3.amazonaws.com/raidtheroom.online/gather/sounds/key-pickup.mp3", 1, context.playerId);
            })
          }

          if (object_id.includes("blue")) {
            throttle(() => {
              game.setItem("blue-key", "https://s3.amazonaws.com/www.raidtheroom.online/gather-images/gather-image-1707471960444-custom-blue-key.png", context.playerId);
              game.playSound("https://s3.amazonaws.com/raidtheroom.online/gather/sounds/key-pickup.mp3", 1, context.playerId);
            })
          }

          if (object_id.includes("orange")) {
            throttle(() => {
              game.setItem("orange-key", "https://s3.amazonaws.com/www.raidtheroom.online/gather-images/gather-image-1707471960457-custom-orange-key.png", context.playerId);
              game.playSound("https://s3.amazonaws.com/raidtheroom.online/gather/sounds/key-pickup.mp3", 1, context.playerId);
            })
          }

          if (object_id.includes("yellow")) {
            throttle(() => {
              game.setItem("yellow-key", "https://s3.amazonaws.com/www.raidtheroom.online/gather-images/gather-image-1707471960572-custom-yellow-key.png", context.playerId);
              game.playSound("https://s3.amazonaws.com/raidtheroom.online/gather/sounds/key-pickup.mp3", 1, context.playerId);
            })
          }

          if (object_id.includes("red")) {
            throttle(() => {
              game.setItem("red-key", "https://s3.amazonaws.com/www.raidtheroom.online/gather-images/gather-image-1707471960548-custom-red-key.png", context.playerId);
              game.playSound("https://s3.amazonaws.com/raidtheroom.online/gather/sounds/key-pickup.mp3", 1, context.playerId);
            })
          }

          postGrabKey(context.player.map, context.playerId, context.player, object_id);

        }

        if (object_id.includes("lockbox")) {

          let fullString = object_id;
          let parts = fullString.split("_");
          let color = parts[1]; // This will be the color

          if (!context.player.itemString.includes(color)) {
            game.playSound("https://s3.amazonaws.com/raidtheroom.online/gather/sounds/wrong-key.mp3", 1, context.playerId);
            return;
          }


          if (context.player.itemString.includes("purple") && object_id.includes("purple")) {
            throttle(() => {
              game.setObject(context.player.map, object_id.toString(), {
                type: 0,
                normal: "https://s3.amazonaws.com/www.raidtheroom.online/gather-images/gather-image-1706394531767-blank.png", // Blank
                highlighted: "https://s3.amazonaws.com/www.raidtheroom.online/gather-images/gather-image-1706394531767-blank.png", // Blank
              });

              game.setImpassable(context.player.map, thisObject.x, thisObject.y, false);
              game.setItem("", "", context.playerId);
              game.playSound("https://s3.amazonaws.com/raidtheroom.online/gather/sounds/key-unlock.mp3", 1, context.playerId);
            })

            let teamArray = [];
            teamArray = game.filterUidsInSpace((player) => player.map == context.player.map);

            for (let i = 0; i < teamArray.length; i++) {
              throttle(() => {
                game.playSound("https://s3.amazonaws.com/raidtheroom.online/gather/sounds/room-completed.mp3", 0.25, teamArray[i]);
              })
            }

            postMazeCompleted(context.player.map, context.playerId, context.player, object_id);

          }

          if (context.player.itemString.includes("blue") && object_id.includes("blue")) {
            throttle(() => {
              game.setObject(context.player.map, object_id.toString(), {
                type: 0,
                normal: "https://s3.amazonaws.com/www.raidtheroom.online/gather-images/gather-image-1706394531767-blank.png", // Blank
                highlighted: "https://s3.amazonaws.com/www.raidtheroom.online/gather-images/gather-image-1706394531767-blank.png", // Blank
              });

              game.setImpassable(context.player.map, thisObject.x, thisObject.y, false);
              game.setItem("", "", context.playerId);
              game.playSound("https://s3.amazonaws.com/raidtheroom.online/gather/sounds/key-unlock.mp3", 1, context.playerId);
            })
          }

          if (context.player.itemString.includes("orange") && object_id.includes("orange")) {
            throttle(() => {
              game.setObject(context.player.map, object_id.toString(), {
                type: 0,
                normal: "https://s3.amazonaws.com/www.raidtheroom.online/gather-images/gather-image-1706394531767-blank.png", // Blank
                highlighted: "https://s3.amazonaws.com/www.raidtheroom.online/gather-images/gather-image-1706394531767-blank.png", // Blank
              });

              game.setImpassable(context.player.map, thisObject.x, thisObject.y, false);
              game.setItem("", "", context.playerId);
              game.playSound("https://s3.amazonaws.com/raidtheroom.online/gather/sounds/key-unlock.mp3", 1, context.playerId);
            })
          }

          if (context.player.itemString.includes("yellow") && object_id.includes("yellow")) {
            throttle(() => {
              game.setObject(context.player.map, object_id.toString(), {
                type: 0,
                normal: "https://s3.amazonaws.com/www.raidtheroom.online/gather-images/gather-image-1706394531767-blank.png", // Blank
                highlighted: "https://s3.amazonaws.com/www.raidtheroom.online/gather-images/gather-image-1706394531767-blank.png", // Blank
              });

              game.setImpassable(context.player.map, thisObject.x, thisObject.y, false);
              game.setItem("", "", context.playerId);
              game.playSound("https://s3.amazonaws.com/raidtheroom.online/gather/sounds/key-unlock.mp3", 1, context.playerId);
            })
          }

          if (context.player.itemString.includes("red") && object_id.includes("red")) {
            throttle(() => {
              game.setObject(context.player.map, object_id.toString(), {
                type: 0,
                normal: "https://s3.amazonaws.com/www.raidtheroom.online/gather-images/gather-image-1706394531767-blank.png", // Blank
                highlighted: "https://s3.amazonaws.com/www.raidtheroom.online/gather-images/gather-image-1706394531767-blank.png", // Blank
              });

              game.setItem("", "", context.playerId);
              game.setImpassable(context.player.map, thisObject.x, thisObject.y, false);
              game.playSound("https://s3.amazonaws.com/raidtheroom.online/gather/sounds/key-unlock.mp3", 1, context.playerId);
            })
          }

          postLockboxUnlocked(context.player.map, context.playerId, context.player, object_id);

        }

        // #endregion


        // Jungle Puzzle
        // #region

        // Animal Travel
        // #region

        // Frog Jump
        if (object_id == "frog_jump_1" && context.player.currentlyEquippedWearables.costume === "7U3AcqhrNsHnqX66rdcV") {
          game.teleport(context.player.map, 74, 28, context.playerId, 7);
          game.playSound("https://s3.amazonaws.com/raidtheroom.online/gather/sounds/pop.mp3", 0.5, context.playerId);
        }
        else if (object_id == "frog_jump_1" && context.player.currentlyEquippedWearables.costume != "7U3AcqhrNsHnqX66rdcV") {
          game.chat("ROOM_CHAT", [], context.player.map, { contents: context.player.name + " tried to jump on the lily pad, but tripped and fell." + '\n' + '\n' });
          game.playSound("https://s3.amazonaws.com/raidtheroom.online/gather/sounds/wrong-buzzer.mp3", 0.25, context.playerId)
        }

        if (object_id == "frog_jump_1_return") {
          game.teleport(context.player.map, 72, 28, context.playerId, 5);
          game.playSound("https://s3.amazonaws.com/raidtheroom.online/gather/sounds/pop.mp3", 0.5, context.playerId);
        }

        if (object_id == "frog_jump_2" && context.player.currentlyEquippedWearables.costume === "7U3AcqhrNsHnqX66rdcV") {
          game.teleport(context.player.map, 23, 37, context.playerId, 4);
          game.playSound("https://s3.amazonaws.com/raidtheroom.online/gather/sounds/pop.mp3", 0.5, context.playerId);
        }
        else if (object_id == "frog_jump_1" && context.player.currentlyEquippedWearables.costume != "7U3AcqhrNsHnqX66rdcV") {
          game.chat("ROOM_CHAT", [], context.player.map, { contents: context.player.name + " tried to jump on the lily pad, but fell into the water." + '\n' + '\n' });
          game.playSound("https://s3.amazonaws.com/raidtheroom.online/gather/sounds/wrong-buzzer.mp3", 0.25, context.playerId)
        }

        if (object_id == "frog_jump_2_return") {
          game.teleport(context.player.map, 23, 39, context.playerId, 1);
          game.playSound("https://s3.amazonaws.com/raidtheroom.online/gather/sounds/pop.mp3", 0.5, context.playerId);
        }

        // Mouse Crawl
        if (object_id == "mouse_tunnel" && context.player.currentlyEquippedWearables.costume === "QIQvEXvXF3mw6knrlkvS") {
          game.teleport(context.player.map, 40, 78, context.playerId, 7);
          game.playSound("https://s3.amazonaws.com/raidtheroom.online/gather/sounds/pop.mp3", 0.5, context.playerId);
        }
        else if (object_id == "mouse_tunnel" && context.player.currentlyEquippedWearables.costume != "QIQvEXvXF3mw6knrlkvS") {
          game.chat("ROOM_CHAT", [], context.player.map, { contents: context.player.name + " tried to crawl through the mouse tunnel, but is too big to fit." + '\n' + '\n' });
          game.playSound("https://s3.amazonaws.com/raidtheroom.online/gather/sounds/wrong-buzzer.mp3", 0.25, context.playerId)
        }

        if (object_id == "mouse_tunnel_return") {
          game.teleport(context.player.map, 27, 78, context.playerId, 5);
          game.playSound("https://s3.amazonaws.com/raidtheroom.online/gather/sounds/pop.mp3", 0.5, context.playerId);
        }

        // Chicken Fly
        if (object_id == "chicken_fly" && context.player.currentlyEquippedWearables.costume === "wesl312rqJvIVHpU1pJ0") {
          game.teleport(context.player.map, 88, 61, context.playerId, 7);
          game.playSound("https://s3.amazonaws.com/raidtheroom.online/gather/sounds/pop.mp3", 0.5, context.playerId);
        }
        else if (object_id == "chicken_fly" && context.player.currentlyEquippedWearables.costume != "wesl312rqJvIVHpU1pJ0") {
          game.chat("ROOM_CHAT", [], context.player.map, { contents: context.player.name + " tried to fly, but fell to the ground." + '\n' + '\n' });
          game.playSound("https://s3.amazonaws.com/raidtheroom.online/gather/sounds/wrong-buzzer.mp3", 0.25, context.playerId)
        }

        if (object_id == "chicken_fly_return") {
          game.teleport(context.player.map, 85, 60, context.playerId, 3);
          game.playSound("https://s3.amazonaws.com/raidtheroom.online/gather/sounds/pop.mp3", 0.5, context.playerId);
        }

        // Sheep Jump
        if (object_id == "sheep_jump" && context.player.currentlyEquippedWearables.costume === "akANoLHkQWGRHia0uYgg") {
          game.teleport(context.player.map, 10, 63, context.playerId, 1);
          game.playSound("https://s3.amazonaws.com/raidtheroom.online/gather/sounds/pop.mp3", 0.5, context.playerId);
        }
        else if (object_id == "sheep_jump" && context.player.currentlyEquippedWearables.costume != "akANoLHkQWGRHia0uYgg") {
          game.chat("ROOM_CHAT", [], context.player.map, { contents: context.player.name + " tried to climb the rocks, but my legs aren't strong enough." + '\n' + '\n' });
          game.playSound("https://s3.amazonaws.com/raidtheroom.online/gather/sounds/wrong-buzzer.mp3", 0.25, context.playerId)
        }

        if (object_id == "sheep_jump_return") {
          game.teleport(context.player.map, 10, 61, context.playerId, 3);
          game.playSound("https://s3.amazonaws.com/raidtheroom.online/gather/sounds/pop.mp3", 0.5, context.playerId);
        }

        // #endregion

        // Food
        // #region

        if (object_id.includes("food")) {

          throttle(() => {
            game.setItem(object_id, thisObject.normal, context.playerId);
            game.playSound("https://s3.amazonaws.com/raidtheroom.online/gather/sounds/pop.mp3", 0.5, context.playerId);
          })

        }

        if (object_id.includes("drop") && context.player.map === "4S6s6mZv9wsUtmTjV34Eg") {

          if (context.player.itemString != "" && thisObject.normal == "https://s3.amazonaws.com/www.raidtheroom.online/gather-images/gather-image-1706394531767-blank.png") {

            let itemURL = JSON.parse(context.player.itemString).image;

            throttle(() => {
              game.setObject(context.player.map, object_id.toString(), {
                normal: itemURL
              });

              game.playSound("https://s3.amazonaws.com/raidtheroom.online/gather/sounds/pop.mp3", 0.5, context.playerId);
            })

            throttle(() => {
              game.setItem("", "", context.playerId);
            })
          }

          if (context.player.itemString == "" && thisObject.normal != "https://s3.amazonaws.com/www.raidtheroom.online/gather-images/gather-image-1706394531767-blank.png") {
            throttle(() => {
              game.setItem(object_id, thisObject.normal, context.playerId);
            })

            throttle(() => {
              game.setObject(context.player.map, object_id.toString(), {
                normal: "https://s3.amazonaws.com/www.raidtheroom.online/gather-images/gather-image-1706394531767-blank.png" // Blank
              });

              game.playSound("https://s3.amazonaws.com/raidtheroom.online/gather/sounds/pop.mp3", 0.5, context.playerId);
            })

          }

        }

        // #endregion



        // #endregion



        // #endregion

      }
      return;
    }

    // Verify what the object is if it's not a raid object
    let temp_obj = game.getObjectByKey(context.player.map, temp_key);
    object_id = temp_obj.id;

    if (object_id != undefined) {
      console.log(object_id);
    }

  });
});