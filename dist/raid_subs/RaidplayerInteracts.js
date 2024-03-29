"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.raidPlayerInteracts = void 0;
// import { game, raidObjects, raidPlayers, raidSpawnRooms, throttle } from '../index.js';
var index_js_1 = require("../index.js");
// import { RaidSpawnZone } from '../raid_classes/RaidSpawnZone.js';
var raidLib_1 = require("../raid_lib/raidLib");
exports.raidPlayerInteracts = (function (game) {
    game.subscribeToEvent("playerInteractsWithObject", function (data, context) {
        var temp_key = data.playerInteractsWithObject.key;
        var object_id = Object.keys(index_js_1.raidObjects).find(function (key) { return index_js_1.raidObjects[key].key === temp_key; });
        var thisObject = game.getObjectByKey(context.player.map, temp_key);
        // Cooldown Code
        if ((0, raidLib_1.playerRateLimit)(index_js_1.raidPlayers[context.playerId]))
            return;
        // Run if the object is a raid object
        if (index_js_1.raidObjects[object_id] != undefined) {
            if (data.playerInteractsWithObject.dataJson) {
                // Grabs the dataJson from the object for Type 7 modals and runs the interaction function
                index_js_1.raidObjects[object_id].interaction(context.player, data.playerInteractsWithObject.dataJson);
                // List all Type 7 raidObjects here
                // ******************************************************************************************************************************************************************************************************
                // Game Start
                // #region
                if (object_id === "game_start_timer") {
                    var json_data = data.playerInteractsWithObject.dataJson;
                    // console.log(json_data);
                    if (!json_data)
                        return;
                    var parsed_JSON = JSON.parse(json_data);
                    // console.log(parsed_JSON);
                    var game_start_timer_input = parsed_JSON.game_start_timer_input.toLowerCase();
                    // console.log(codebreaker_submit_1_input);
                    // Start Status Check
                    if (parsed_JSON = !undefined && game_start_timer_input != undefined) {
                        (0, raidLib_1.checkStartGameTimer)(context.player.map, context.playerId, context.player, object_id, game_start_timer_input);
                    }
                }
                // #endregion
                // Codebreaker Puzzle - Type 7s
                // #region
                if (object_id == "codebreaker_submit_1") {
                    var json_data = data.playerInteractsWithObject.dataJson;
                    // console.log(json_data);
                    if (!json_data)
                        return;
                    var parsed_JSON = JSON.parse(json_data);
                    // console.log(parsed_JSON);
                    var codebreaker_submit_1_input = parsed_JSON.codebreaker_submit_1_input.toLowerCase();
                    // console.log(codebreaker_submit_1_input);
                    // Start Status Check
                    if (parsed_JSON = !undefined && codebreaker_submit_1_input != undefined) {
                        (0, raidLib_1.checkCodebreaker_1st_Digit)(context.player.map, context.playerId, context.player, object_id, codebreaker_submit_1_input);
                    }
                }
                if (object_id == "codebreaker_submit_2") {
                    var json_data = data.playerInteractsWithObject.dataJson;
                    // console.log(json_data);
                    if (!json_data)
                        return;
                    var parsed_JSON = JSON.parse(json_data);
                    // console.log(parsed_JSON);
                    var codebreaker_submit_2_input = parsed_JSON.codebreaker_submit_2_input.toLowerCase();
                    // console.log(codebreaker_submit_2_input);
                    // Start Status Check
                    if (parsed_JSON = !undefined && codebreaker_submit_2_input != undefined) {
                        (0, raidLib_1.checkCodebreaker_2nd_Digit)(context.player.map, context.playerId, context.player, object_id, codebreaker_submit_2_input);
                    }
                }
                if (object_id == "codebreaker_submit_3") {
                    var json_data = data.playerInteractsWithObject.dataJson;
                    // console.log(json_data);
                    if (!json_data)
                        return;
                    var parsed_JSON = JSON.parse(json_data);
                    // console.log(parsed_JSON);
                    var codebreaker_submit_3_input = parsed_JSON.codebreaker_submit_3_input.toLowerCase();
                    // console.log(codebreaker_submit_3_input);
                    // Start Status Check
                    if (parsed_JSON = !undefined && codebreaker_submit_3_input != undefined) {
                        (0, raidLib_1.checkCodebreaker_3rd_Digit)(context.player.map, context.playerId, context.player, object_id, codebreaker_submit_3_input);
                    }
                }
                // #endregion
                // Jungle - Type 7s
                // #region
                if (object_id == "magic_circle") {
                    var json_data = data.playerInteractsWithObject.dataJson;
                    // console.log(json_data);
                    if (!json_data)
                        return;
                    var parsed_JSON = JSON.parse(json_data);
                    // console.log(parsed_JSON);
                    var magic_circle_input = parsed_JSON.magic_circle_input.toLowerCase();
                    // console.log(codebreaker_submit_1_input);
                    // Start Status Check
                    if (parsed_JSON = !undefined && magic_circle_input != undefined) {
                        (0, raidLib_1.useMagicCircle)(context.player.map, context.playerId, context.player, object_id, magic_circle_input);
                    }
                }
                if (object_id == "old_man_text") {
                    var json_data = data.playerInteractsWithObject.dataJson;
                    // console.log(json_data);
                    if (!json_data)
                        return;
                    var parsed_JSON = JSON.parse(json_data);
                    // console.log(parsed_JSON);
                    var old_man_text_input = parsed_JSON.old_man_text_input.toLowerCase();
                    // console.log(codebreaker_submit_1_input);
                    // Start Status Check
                    if (parsed_JSON = !undefined && old_man_text_input != undefined) {
                        (0, raidLib_1.checkOldManText)(context.player.map, context.playerId, context.player, object_id, old_man_text_input);
                    }
                }
                // Animal Text
                // #region
                // Sheep Text
                if (object_id == "sheep_text") {
                    var json_data = data.playerInteractsWithObject.dataJson;
                    // console.log(json_data);
                    if (!json_data)
                        return;
                    var parsed_JSON = JSON.parse(json_data);
                    // console.log(parsed_JSON);
                    var sheep_text_input = parsed_JSON.sheep_text_input.toLowerCase();
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
                    var json_data = data.playerInteractsWithObject.dataJson;
                    // console.log(json_data);
                    if (!json_data)
                        return;
                    var parsed_JSON = JSON.parse(json_data);
                    // console.log(parsed_JSON);
                    var chicken_text_input = parsed_JSON.chicken_text_input.toLowerCase();
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
                    var json_data = data.playerInteractsWithObject.dataJson;
                    // console.log(json_data);
                    if (!json_data)
                        return;
                    var parsed_JSON = JSON.parse(json_data);
                    // console.log(parsed_JSON);
                    var frog_text_input = parsed_JSON.frog_text_input.toLowerCase();
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
                    var json_data = data.playerInteractsWithObject.dataJson;
                    // console.log(json_data);
                    if (!json_data)
                        return;
                    var parsed_JSON = JSON.parse(json_data);
                    // console.log(parsed_JSON);
                    var mouse_text_input = parsed_JSON.mouse_text_input.toLowerCase();
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
            }
            else {
                index_js_1.raidObjects[object_id].interaction(context.player);
                // List all Type 5 and others here (No Type 7 BELOW - ONLY ALLOWED ABOVE)
                // ***********************************************************************
                // #region
                console.log(object_id);
                // Tribonds Puzzle
                // #region
                if (object_id.includes("tribond")) {
                    (0, index_js_1.throttle)(function () {
                        game.setItem(object_id, thisObject.normal, context.playerId);
                        game.playSound("https://s3.amazonaws.com/raidtheroom.online/gather/sounds/grab-item.mp3", 1, context.playerId);
                    });
                }
                if (object_id.includes("dropzone")) {
                    // Pick up item
                    if (context.player.itemString == "") {
                        if (thisObject.normal === "https://s3.amazonaws.com/www.raidtheroom.online/gather-images/gather-image-1706394531767-blank.png") {
                            return;
                        }
                        else if (thisObject.normal != "https://s3.amazonaws.com/www.raidtheroom.online/gather-images/gather-image-1706394531767-blank.png") {
                            (0, index_js_1.throttle)(function () {
                                game.setItem(object_id, thisObject.normal, context.playerId);
                                game.playSound("https://s3.amazonaws.com/raidtheroom.online/gather/sounds/place-down.mp3", 0.5, context.playerId);
                            });
                            (0, index_js_1.throttle)(function () {
                                game.setObject(context.player.map, object_id.toString(), {
                                    normal: "https://s3.amazonaws.com/www.raidtheroom.online/gather-images/gather-image-1706394531767-blank.png", // Blank
                                    highlighted: "https://s3.amazonaws.com/www.raidtheroom.online/gather-images/gather-image-1706394531767-blank.png", // Blank
                                });
                            });
                        }
                    }
                    if (context.player.itemString != "" && context.player.itemString != undefined) {
                        if (JSON.parse(context.player.itemString).image != undefined) {
                            var itemURL_1 = JSON.parse(context.player.itemString).image;
                            (0, index_js_1.throttle)(function () {
                                game.setObject(context.player.map, object_id.toString(), {
                                    normal: itemURL_1,
                                    highlighted: itemURL_1,
                                });
                                game.playSound("https://s3.amazonaws.com/raidtheroom.online/gather/sounds/place-down.mp3", 1, context.playerId);
                                (0, index_js_1.throttle)(function () {
                                    game.setItem(object_id, thisObject.normal, context.playerId);
                                });
                            });
                        }
                    }
                    (0, raidLib_1.checkTribondsPuzzle)(context.player.map, context.playerId, context.player, object_id);
                }
                // #endregion
                // Tiki Torch Puzzle
                // #region
                if (object_id === "firepit") {
                    (0, raidLib_1.interactsFirePit)(context.player.map, context.playerId, context.player, object_id);
                }
                if (object_id.includes("tiki_torch")) {
                    if (context.player.itemString.includes("firepit")) {
                        (0, raidLib_1.interactsTikiTorch)(context.player.map, context.playerId, context.player, object_id);
                    }
                }
                // #endregion
                // Maze Puzzle
                // #region
                if (object_id.includes("key")) {
                    if (object_id.includes("purple")) {
                        (0, index_js_1.throttle)(function () {
                            game.setItem("purple-key", "https://s3.amazonaws.com/www.raidtheroom.online/gather-images/gather-image-1707471960478-custom-purple-key.png", context.playerId);
                            game.playSound("https://s3.amazonaws.com/raidtheroom.online/gather/sounds/key-pickup.mp3", 1, context.playerId);
                        });
                    }
                    if (object_id.includes("blue")) {
                        (0, index_js_1.throttle)(function () {
                            game.setItem("blue-key", "https://s3.amazonaws.com/www.raidtheroom.online/gather-images/gather-image-1707471960444-custom-blue-key.png", context.playerId);
                            game.playSound("https://s3.amazonaws.com/raidtheroom.online/gather/sounds/key-pickup.mp3", 1, context.playerId);
                        });
                    }
                    if (object_id.includes("orange")) {
                        (0, index_js_1.throttle)(function () {
                            game.setItem("orange-key", "https://s3.amazonaws.com/www.raidtheroom.online/gather-images/gather-image-1707471960457-custom-orange-key.png", context.playerId);
                            game.playSound("https://s3.amazonaws.com/raidtheroom.online/gather/sounds/key-pickup.mp3", 1, context.playerId);
                        });
                    }
                    if (object_id.includes("yellow")) {
                        (0, index_js_1.throttle)(function () {
                            game.setItem("yellow-key", "https://s3.amazonaws.com/www.raidtheroom.online/gather-images/gather-image-1707471960572-custom-yellow-key.png", context.playerId);
                            game.playSound("https://s3.amazonaws.com/raidtheroom.online/gather/sounds/key-pickup.mp3", 1, context.playerId);
                        });
                    }
                    if (object_id.includes("red")) {
                        (0, index_js_1.throttle)(function () {
                            game.setItem("red-key", "https://s3.amazonaws.com/www.raidtheroom.online/gather-images/gather-image-1707471960548-custom-red-key.png", context.playerId);
                            game.playSound("https://s3.amazonaws.com/raidtheroom.online/gather/sounds/key-pickup.mp3", 1, context.playerId);
                        });
                    }
                    (0, raidLib_1.postGrabKey)(context.player.map, context.playerId, context.player, object_id);
                }
                if (object_id.includes("lockbox")) {
                    var fullString = object_id;
                    var parts = fullString.split("_");
                    var color = parts[1]; // This will be the color
                    if (!context.player.itemString.includes(color)) {
                        game.playSound("https://s3.amazonaws.com/raidtheroom.online/gather/sounds/wrong-key.mp3", 1, context.playerId);
                        return;
                    }
                    if (context.player.itemString.includes("purple") && object_id.includes("purple")) {
                        (0, index_js_1.throttle)(function () {
                            game.setObject(context.player.map, object_id.toString(), {
                                type: 0,
                                normal: "https://s3.amazonaws.com/www.raidtheroom.online/gather-images/gather-image-1706394531767-blank.png", // Blank
                                highlighted: "https://s3.amazonaws.com/www.raidtheroom.online/gather-images/gather-image-1706394531767-blank.png", // Blank
                            });
                            game.setImpassable(context.player.map, thisObject.x, thisObject.y, false);
                            game.setItem("", "", context.playerId);
                            game.playSound("https://s3.amazonaws.com/raidtheroom.online/gather/sounds/key-unlock.mp3", 1, context.playerId);
                        });
                        var teamArray_1 = [];
                        teamArray_1 = game.filterUidsInSpace(function (player) { return player.map == context.player.map; });
                        var _loop_1 = function (i) {
                            (0, index_js_1.throttle)(function () {
                                game.playSound("https://s3.amazonaws.com/raidtheroom.online/gather/sounds/room-completed.mp3", 0.25, teamArray_1[i]);
                            });
                        };
                        for (var i = 0; i < teamArray_1.length; i++) {
                            _loop_1(i);
                        }
                        (0, raidLib_1.postMazeCompleted)(context.player.map, context.playerId, context.player, object_id);
                    }
                    if (context.player.itemString.includes("blue") && object_id.includes("blue")) {
                        (0, index_js_1.throttle)(function () {
                            game.setObject(context.player.map, object_id.toString(), {
                                type: 0,
                                normal: "https://s3.amazonaws.com/www.raidtheroom.online/gather-images/gather-image-1706394531767-blank.png", // Blank
                                highlighted: "https://s3.amazonaws.com/www.raidtheroom.online/gather-images/gather-image-1706394531767-blank.png", // Blank
                            });
                            game.setImpassable(context.player.map, thisObject.x, thisObject.y, false);
                            game.setItem("", "", context.playerId);
                            game.playSound("https://s3.amazonaws.com/raidtheroom.online/gather/sounds/key-unlock.mp3", 1, context.playerId);
                        });
                    }
                    if (context.player.itemString.includes("orange") && object_id.includes("orange")) {
                        (0, index_js_1.throttle)(function () {
                            game.setObject(context.player.map, object_id.toString(), {
                                type: 0,
                                normal: "https://s3.amazonaws.com/www.raidtheroom.online/gather-images/gather-image-1706394531767-blank.png", // Blank
                                highlighted: "https://s3.amazonaws.com/www.raidtheroom.online/gather-images/gather-image-1706394531767-blank.png", // Blank
                            });
                            game.setImpassable(context.player.map, thisObject.x, thisObject.y, false);
                            game.setItem("", "", context.playerId);
                            game.playSound("https://s3.amazonaws.com/raidtheroom.online/gather/sounds/key-unlock.mp3", 1, context.playerId);
                        });
                    }
                    if (context.player.itemString.includes("yellow") && object_id.includes("yellow")) {
                        (0, index_js_1.throttle)(function () {
                            game.setObject(context.player.map, object_id.toString(), {
                                type: 0,
                                normal: "https://s3.amazonaws.com/www.raidtheroom.online/gather-images/gather-image-1706394531767-blank.png", // Blank
                                highlighted: "https://s3.amazonaws.com/www.raidtheroom.online/gather-images/gather-image-1706394531767-blank.png", // Blank
                            });
                            game.setImpassable(context.player.map, thisObject.x, thisObject.y, false);
                            game.setItem("", "", context.playerId);
                            game.playSound("https://s3.amazonaws.com/raidtheroom.online/gather/sounds/key-unlock.mp3", 1, context.playerId);
                        });
                    }
                    if (context.player.itemString.includes("red") && object_id.includes("red")) {
                        (0, index_js_1.throttle)(function () {
                            game.setObject(context.player.map, object_id.toString(), {
                                type: 0,
                                normal: "https://s3.amazonaws.com/www.raidtheroom.online/gather-images/gather-image-1706394531767-blank.png", // Blank
                                highlighted: "https://s3.amazonaws.com/www.raidtheroom.online/gather-images/gather-image-1706394531767-blank.png", // Blank
                            });
                            game.setItem("", "", context.playerId);
                            game.setImpassable(context.player.map, thisObject.x, thisObject.y, false);
                            game.playSound("https://s3.amazonaws.com/raidtheroom.online/gather/sounds/key-unlock.mp3", 1, context.playerId);
                        });
                    }
                    (0, raidLib_1.postLockboxUnlocked)(context.player.map, context.playerId, context.player, object_id);
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
                    game.playSound("https://s3.amazonaws.com/raidtheroom.online/gather/sounds/wrong-buzzer.mp3", 0.25, context.playerId);
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
                    game.playSound("https://s3.amazonaws.com/raidtheroom.online/gather/sounds/wrong-buzzer.mp3", 0.25, context.playerId);
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
                    game.playSound("https://s3.amazonaws.com/raidtheroom.online/gather/sounds/wrong-buzzer.mp3", 0.25, context.playerId);
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
                    game.playSound("https://s3.amazonaws.com/raidtheroom.online/gather/sounds/wrong-buzzer.mp3", 0.25, context.playerId);
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
                    game.playSound("https://s3.amazonaws.com/raidtheroom.online/gather/sounds/wrong-buzzer.mp3", 0.25, context.playerId);
                }
                if (object_id == "sheep_jump_return") {
                    game.teleport(context.player.map, 10, 61, context.playerId, 3);
                    game.playSound("https://s3.amazonaws.com/raidtheroom.online/gather/sounds/pop.mp3", 0.5, context.playerId);
                }
                // #endregion
                // Food
                // #region
                if (object_id.includes("food")) {
                    (0, index_js_1.throttle)(function () {
                        game.setItem(object_id, thisObject.normal, context.playerId);
                        game.playSound("https://s3.amazonaws.com/raidtheroom.online/gather/sounds/pop.mp3", 0.5, context.playerId);
                    });
                }
                if (object_id.includes("drop") && context.player.map === "4S6s6mZv9wsUtmTjV34Eg") {
                    if (context.player.itemString != "" && thisObject.normal == "https://s3.amazonaws.com/www.raidtheroom.online/gather-images/gather-image-1706394531767-blank.png") {
                        var itemURL_2 = JSON.parse(context.player.itemString).image;
                        (0, index_js_1.throttle)(function () {
                            game.setObject(context.player.map, object_id.toString(), {
                                normal: itemURL_2
                            });
                            game.playSound("https://s3.amazonaws.com/raidtheroom.online/gather/sounds/pop.mp3", 0.5, context.playerId);
                        });
                        (0, index_js_1.throttle)(function () {
                            game.setItem("", "", context.playerId);
                        });
                    }
                    if (context.player.itemString == "" && thisObject.normal != "https://s3.amazonaws.com/www.raidtheroom.online/gather-images/gather-image-1706394531767-blank.png") {
                        (0, index_js_1.throttle)(function () {
                            game.setItem(object_id, thisObject.normal, context.playerId);
                        });
                        (0, index_js_1.throttle)(function () {
                            game.setObject(context.player.map, object_id.toString(), {
                                normal: "https://s3.amazonaws.com/www.raidtheroom.online/gather-images/gather-image-1706394531767-blank.png" // Blank
                            });
                            game.playSound("https://s3.amazonaws.com/raidtheroom.online/gather/sounds/pop.mp3", 0.5, context.playerId);
                        });
                    }
                }
                // #endregion
                // #endregion
                // #endregion
            }
            return;
        }
        // Verify what the object is if it's not a raid object
        var temp_obj = game.getObjectByKey(context.player.map, temp_key);
        object_id = temp_obj.id;
        if (object_id != undefined) {
            console.log(object_id);
        }
    });
});
//# sourceMappingURL=RaidplayerInteracts.js.map