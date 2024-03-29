"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkOldManText = exports.useMagicCircle = exports.postLockboxUnlocked = exports.postMazeCompleted = exports.postGrabKey = exports.resetCollisions = exports.checkCodebreaker = exports.checkCodebreaker_3rd_Digit = exports.checkCodebreaker_2nd_Digit = exports.checkCodebreaker_1st_Digit = exports.checkTikiPuzzle = exports.interactsTikiTorch = exports.interactsFirePit = exports.checkStartGameTimer = exports.checkBeachCompleted = exports.checkTribondsPuzzle = exports.playerRateLimit = exports.formatDateTime = exports.axiosCall = exports.getCurrentTime = exports.generateMask = exports.filterFullTeams = exports.findSmallestTeams = exports.teamSort = exports.generatePlayerList = exports.createRandomTeams = exports.checkMod = exports.teleportSameEmoji = exports.teleportForward = exports.checkSameEmojiFront = exports.checkSameEmojiSpace = exports.findFrontPlayer = exports.findFrontCoords = void 0;
var index_js_1 = require("../index.js");
var ObjectData_js_1 = require("../raid_data/ObjectData.js");
var moment_1 = __importDefault(require("moment"));
var axios_1 = __importDefault(require("axios"));
// Time Tracking Variables
var team_start_time = 0;
var team_end_time = 0;
var team_duration = 0;
var cumulative_time = 0;
// Tribonds Check Variables
var tribonds_1_check = false;
var tribonds_2_check = false;
var tribonds_3_check = false;
var tribonds_4_check = false;
var tribonds_5_check = false;
var tribonds_end_time = 0;
var tribonds_duration = 0;
// Tiki Torches Check Variables
var tiki_1_check = false;
var tiki_2_check = false;
var tiki_3_check = false;
var tiki_4_check = false;
var tiki_5_check = false;
var tiki_6_check = false;
var tiki_end_time = 0;
var tiki_duration = 0;
// Codebreaker Check Variables
var codebreaker_1_check = false;
var codebreaker_2_check = false;
var codebreaker_3_check = false;
var codebreaker_end_time = 0;
var codebreaker_duration = 0;
// Beach Completion Check Variables
var tribondsCompleted = false;
var tikiCompleted = false;
var codebreakerCompleted = false;
var beachCompleted = false;
var beach_end_time = 0;
var beach_duration = 0;
// Maze Completion Check Variables
var maze_start_time = 0;
var maze_end_time = 0;
var maze_duration = 0;
// Jungle Completion Check Variables
var jungle_start_time = 0;
var jungle_end_time = 0;
var jungle_duration = 0;
// Final Area
var final_area_start_time = 0;
var final_area_end_time = 0;
var final_area_duration = 0;
var findFrontCoords = function (player_id) {
    // Store the coords of the space in front of the player
    var front = {
        x: index_js_1.raidPlayers[player_id].x,
        y: index_js_1.raidPlayers[player_id].y,
        direction: index_js_1.raidPlayers[player_id].direction
    };
    switch (front.direction) {
        case 3:
        case 4:
            front.y--;
            break;
        case 7:
        case 8:
            front.x++;
            break;
        case 1:
        case 2:
            front.y++;
            break;
        case 5:
        case 6:
            front.x--;
            break;
        default:
            console.log('invalid direction?');
    }
    return front;
};
exports.findFrontCoords = findFrontCoords;
var findFrontPlayer = function (player_id, map_id) {
    // Check for any players in front of player
    var front = (0, exports.findFrontCoords)(player_id);
    var front_player = 'none';
    Object.keys(index_js_1.raidPlayers).forEach(function (key, index) {
        // console.log(key, raidPlayers[key].x, raidPlayers[key].y, raidPlayers[key].map_id)
        if (index_js_1.raidPlayers[key].x == front.x && index_js_1.raidPlayers[key].y == front.y && index_js_1.raidPlayers[key].map_id == map_id && key != player_id) {
            front_player = key;
        }
    });
    return front_player;
};
exports.findFrontPlayer = findFrontPlayer;
var checkSameEmojiSpace = function (player) {
    var emoji = player.emojiStatus;
    var emoji_same = index_js_1.game.filterPlayersInSpace(function (e) { return e.emojiStatus == emoji && e.id != player.id; });
    return emoji_same;
};
exports.checkSameEmojiSpace = checkSameEmojiSpace;
var checkSameEmojiFront = function (player_id, map_id) {
    var front_player = (0, exports.findFrontPlayer)(player_id, map_id);
    if (index_js_1.game.getPlayer(front_player).emojiStatus == index_js_1.game.getPlayer(player_id).emojiStatus)
        return true;
    return false;
};
exports.checkSameEmojiFront = checkSameEmojiFront;
var teleportForward = function (player_id, map_id, num_forward) {
    var front = {
        x: index_js_1.raidPlayers[player_id].x,
        y: index_js_1.raidPlayers[player_id].y,
        direction: index_js_1.raidPlayers[player_id].direction
    };
    switch (front.direction) {
        case 3:
        case 4:
            front.y -= num_forward;
            break;
        case 7:
        case 8:
            front.x += num_forward;
            break;
        case 1:
        case 2:
            front.y += num_forward;
            break;
        case 5:
        case 6:
            front.x -= num_forward;
        case 9:
            console.log("Dancing");
            break;
        default:
            console.log('invalid direction?');
    }
    index_js_1.game.teleport(map_id, front.x, front.y, player_id, front.direction);
};
exports.teleportForward = teleportForward;
var teleportSameEmoji = function (player) {
    var player_list = (0, exports.checkSameEmojiSpace)(player);
    if (Object.keys(player_list).length > 0) {
        index_js_1.game.teleport(player_list[0].map, player_list[0].x, player_list[0].y, player.id);
        console.log(player.name, 'teleported to another player with the same emoji: ' + player.emojiStatus);
    }
};
exports.teleportSameEmoji = teleportSameEmoji;
// Probably redundant
var checkMod = function (player_id) {
    return index_js_1.raidPermissions[player_id].DEFAULT_MOD;
};
exports.checkMod = checkMod;
// Raid Team stuff
var createRandomTeams = function (map_id, num_players_team, emote, teamName) {
    var new_players = (0, exports.generatePlayerList)(index_js_1.game.getPlayersInMap(map_id), emote);
    var player_count = Object.keys(new_players).length;
    for (var i = 0; i < num_players_team; i++) {
        var random = Math.floor(Math.random() * (player_count - 1));
        index_js_1.game.teleport(index_js_1.raidTeams[teamName].map_id, index_js_1.raidTeams[teamName].x, index_js_1.raidTeams[teamName].y, new_players[random].id);
        new_players = (0, exports.generatePlayerList)(index_js_1.game.getPlayersInMap(map_id), emote);
    }
};
exports.createRandomTeams = createRandomTeams;
var generatePlayerList = function (players, emote) {
    return players.filter(function (element) {
        //return (!raidPermissions[element.id].OWNER && !raidPermissions[element.id].DEFAULT_MOD && !(game.getPlayer(element.id).emojiStatus == emote));
        return (!(index_js_1.game.getPlayer(element.id).emojiStatus == emote));
    });
};
exports.generatePlayerList = generatePlayerList;
// Sort all non-admin and/or 'emote' players on a single map into predefined teams set in RaidTeamMaps.ts
var teamSort = function (map_id, team_maps, emote) {
    var player_list = (0, exports.generatePlayerList)(index_js_1.game.getPlayersInMap(map_id), emote);
    var smallest_teams = (0, exports.findSmallestTeams)(team_maps);
    var _loop_1 = function () {
        var player_count = Object.keys(player_list).length;
        var random = Math.floor(Math.random() * (player_count - 1));
        var small_team_count = Object.keys(smallest_teams).length;
        var small_team_random = Math.floor(Math.random() * small_team_count);
        if (!index_js_1.raidTeamMaps[team_maps].count_override)
            smallest_teams = (0, exports.filterFullTeams)(smallest_teams);
        //raidTeamMaps[team_maps].teams[small_team_random].players.push(player_list[random].id);
        // raidTeamMaps[team_maps].teams[Object.keys(smallest_teams)[small_team_random]];
        //console.log(raidTeamMaps[team_maps].teams)
        //console.log(smallest_teams[small_team_random].map.map_id);
        if (Object.keys(smallest_teams).length <= 0) {
            console.log('all teams full');
        }
        else {
            var random_team_1 = Object.keys(index_js_1.raidTeamMaps[team_maps].teams).find(function (key) { return index_js_1.raidTeamMaps[team_maps].teams[key].map.map_id === smallest_teams[small_team_random].map.map_id; });
            index_js_1.raidTeamMaps[team_maps].teams[random_team_1].players.push(player_list[random].id);
            (0, index_js_1.throttle)(function () {
                index_js_1.game.teleport(index_js_1.raidTeamMaps[team_maps].teams[random_team_1].map.map_id, index_js_1.raidTeamMaps[team_maps].teams[random_team_1].map.x, index_js_1.raidTeamMaps[team_maps].teams[random_team_1].map.y, player_list[random].id);
            });
        }
        //console.log(Object.values(raidTeamMaps[team_maps].teams).filter((e) => e.map_id === smallest_teams[small_team_random].map_id));
        //console.log(player_list[random].id);
        smallest_teams = (0, exports.findSmallestTeams)(team_maps);
        player_list.splice(random, 1);
    };
    while (player_list.length > 0) {
        _loop_1();
    }
    Object.values(index_js_1.raidTeamMaps[team_maps].teams).forEach(function (key, value) {
        console.log(key);
    });
};
exports.teamSort = teamSort;
var findSmallestTeams = function (team_maps) {
    if (index_js_1.raidTeamMaps[team_maps] != undefined) {
        var lowest_1 = 9999;
        Object.keys(index_js_1.raidTeamMaps[team_maps].teams).forEach(function (key, value) {
            if (index_js_1.raidTeamMaps[team_maps].teams[key].players.length < lowest_1)
                lowest_1 = index_js_1.raidTeamMaps[team_maps].teams[key].players.length;
        });
        return Object.values(index_js_1.raidTeamMaps[team_maps].teams).filter(function (e) { return e.players.length === lowest_1; });
    }
};
exports.findSmallestTeams = findSmallestTeams;
var filterFullTeams = function (teams) {
    return Object.values(teams).filter(function (e) { return e.players.length < e.max_count; });
};
exports.filterFullTeams = filterFullTeams;
//Masks a mask for collisions. mask_type is either 0x00 or 0x01
var generateMask = function (width, height, mask_type) {
    var temp = [];
    for (var i = 0; i < width * height; i++) {
        temp.push(mask_type);
    }
    return Buffer.from(temp).toString("base64");
    // return convertCollisionBytesToBits(temp).toString();
};
exports.generateMask = generateMask;
var getCurrentTime = function () {
    return (0, moment_1.default)().format('MM/DD/YYYY - h:mm:ss a');
};
exports.getCurrentTime = getCurrentTime;
var axiosCall = function (table_name, jsonData) {
    axios_1.default.post('https://rtr-web.herokuapp.com/api/gather-tracker/' + table_name, jsonData).then(function (res) {
        console.log(table_name, +(0, exports.getCurrentTime)());
    }).catch(function (error) {
        console.log(error);
    });
};
exports.axiosCall = axiosCall;
var formatDateTime = function (timestamp) {
    // Convert the timestamp to a Date object
    var date = new Date(timestamp);
    var year = date.getFullYear();
    var month = date.getMonth() + 1; // JavaScript months are 0-based.
    var day = date.getDate();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    // Adding leading zeros for day, month, hours, minutes, and seconds if they are less than 10
    // month = month < 10 ? '0' + month : month;
    // day = day < 10 ? '0' + day : day;
    // hours = hours < 10 ? '0' + hours : hours;
    // minutes = minutes < 10 ? '0' + minutes : minutes;
    // seconds = seconds < 10 ? '0' + seconds : seconds;
    return "".concat(year, "-").concat(month, "-").concat(day, " ").concat(hours, ":").concat(minutes, ":").concat(seconds);
};
exports.formatDateTime = formatDateTime;
// Return true if cooldown is triggered
var playerRateLimit = function (player) {
    // Return if no cooldown is defined
    if (player.rate_limit.timer == 0)
        return false;
    // Set trigger to true if max counter has been reached
    if (player.rate_limit.counter == player.rate_limit.max_counter) {
        var temp = player.rate_limit.cooldown - (Date.now() - player.rate_limit.remaining);
        // console.log (`${player.name} is on cooldown (${temp} ms left)`);
        return true;
    }
    // Start cooldown timer if not already
    if (player.rate_limit.counter < player.rate_limit.max_counter) {
        if (player.rate_limit.timeout != undefined)
            clearTimeout(player.rate_limit.timeout);
        player.rate_limit.timeout = setTimeout(function () {
            player.rate_limit.counter = 0;
            player.rate_limit.timeout = undefined;
            console.log('cooldown ended for', player.name);
        }, player.rate_limit.cooldown);
    }
    player.rate_limit.counter++;
    console.log("".concat(player.name, " counter is at ").concat(player.rate_limit.counter, "/").concat(player.rate_limit.max_counter));
    if (player.rate_limit.counter == player.rate_limit.max_counter) {
        player.rate_limit.remaining = Date.now();
    }
    return false;
};
exports.playerRateLimit = playerRateLimit;
function checkTribondsPuzzle(map_id, playerId, player, object_id) {
    if (object_id === "dropzone_1" && player.itemString.includes("Light")) {
        tribonds_1_check = true;
    }
    else if (object_id === "dropzone_1" && !player.itemString.includes("Light")) {
        tribonds_1_check = false;
    }
    if (object_id === "dropzone_2" && player.itemString.includes("Yard")) {
        tribonds_2_check = true;
    }
    else if (object_id === "dropzone_2" && !player.itemString.includes("Yard")) {
        tribonds_2_check = false;
    }
    if (object_id === "dropzone_3" && player.itemString.includes("Bell")) {
        tribonds_3_check = true;
    }
    else if (object_id === "dropzone_3" && !player.itemString.includes("Bell")) {
        tribonds_3_check = false;
    }
    if (object_id === "dropzone_4" && player.itemString.includes("Drop")) {
        tribonds_4_check = true;
    }
    else if (object_id === "dropzone_4" && !player.itemString.includes("Drop")) {
        tribonds_4_check = false;
    }
    if (object_id === "dropzone_5" && player.itemString.includes("Paper")) {
        tribonds_5_check = true;
    }
    else if (object_id === "dropzone_5" && !player.itemString.includes("Paper")) {
        tribonds_5_check = false;
    }
    // console.log(tribonds_1_check)
    // console.log(tribonds_2_check)
    // console.log(tribonds_3_check)
    // console.log(tribonds_4_check)
    // console.log(tribonds_5_check)
    // console.log(tribondsCompleted)
    if ((tribonds_1_check === true
        && tribonds_2_check === true
        && tribonds_3_check === true
        && tribonds_4_check === true
        && tribonds_5_check === true
        && tribondsCompleted === false)) {
        tribondsCompleted = true;
        (0, index_js_1.throttle)(function () {
            index_js_1.game.setObject(map_id, "crystal_ball_clear_2", {
                normal: "https://s3.amazonaws.com/www.raidtheroom.online/gather-images/gather-image-1706391024635-crystal-ball-green-gray-feet.png",
            });
            // console.log("Tribonds Puzzle Completed")
        });
        (0, index_js_1.throttle)(function () {
            index_js_1.game.setObject(map_id, "codebreaker_cover", {
                normal: "https://s3.amazonaws.com/www.raidtheroom.online/gather-images/gather-image-1706394531767-blank.png",
            });
        });
        var teamArray_1 = [];
        teamArray_1 = index_js_1.game.filterUidsInSpace(function (player) { return player.map == map_id; });
        var _loop_2 = function (i) {
            (0, index_js_1.throttle)(function () {
                index_js_1.game.playSound("https://s3.amazonaws.com/raidtheroom.online/gather/sounds/Win%20-%20588234__mehraniiii__win.wav", 0.25, teamArray_1[i]);
            });
        };
        for (var i = 0; i < teamArray_1.length; i++) {
            _loop_2(i);
        }
        if (tribonds_end_time == 0) {
            tribonds_end_time = Date.now();
            console.log("Tribonds End Time: " + tribonds_end_time);
            tribonds_duration = (tribonds_end_time - tiki_end_time) / 1000;
            console.log("Tribonds Duration: " + tribonds_duration);
        }
        var newRowRTRDatabase = {
            'field_1': "Escape the Island 1.5 Input",
            'player_id': playerId,
            'display_name': player.name,
            'object_id': object_id,
            'space_id': index_js_1.game.spaceId,
            'map_id': player.map,
            'player_xy': player.x + ", " + player.y,
            'timestamp': Date.now(),
            'field_2': "Tribonds Puzzle Completed",
            'field_3': tribonds_duration,
            "converted_date_time": team_start_time,
        };
        axios_1.default.post("https://rtr-web.herokuapp.com/api/gather-tracker/eti-prod-progress", newRowRTRDatabase).then(function (res) {
            // console.log(res.data);
            console.log("Tribonds Puzzle Completed DB at: " + (0, exports.getCurrentTime)());
        }).catch(function (error) {
            console.log(error);
        });
        (0, index_js_1.throttle)(function () {
            var payload = {
                "text": "📈" + (0, exports.getCurrentTime)() + '\n' + "Team: " + "https://app.gather.town/app/" + index_js_1.game.spaceId + '\n' + "PROGRESS: " + "Completed Tribonds in " + parseFloat((tribonds_duration / 60).toFixed(2)) + " minutes" + '\n' + '\n'
            };
            axios_1.default.post("https://hooks.slack.com/services/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", payload).then(function (res) {
                // console.log(res.data);
                console.log("Completed Tribonds Sent to Slack" + (0, exports.getCurrentTime)());
            }).catch(function (error) {
                console.log(error.data);
            });
        });
        checkBeachCompleted(map_id, playerId, player, object_id);
    }
}
exports.checkTribondsPuzzle = checkTribondsPuzzle;
function checkBeachCompleted(map_id, playerId, player, object_id) {
    if (tribondsCompleted === true && tikiCompleted === true && codebreakerCompleted === true && beachCompleted === false) {
        // if (tribondsCompleted === true && tikiCompleted === true) {
        beachCompleted = true;
        maze_start_time = Date.now();
        var teamArray_2 = [];
        teamArray_2 = index_js_1.game.filterUidsInSpace(function (player) { return player.map == map_id; });
        var _loop_3 = function (i) {
            (0, index_js_1.throttle)(function () {
                index_js_1.game.playSound("https://s3.amazonaws.com/raidtheroom.online/gather/sounds/room-completed.mp3", 0.25, teamArray_2[i]);
            });
        };
        for (var i = 0; i < teamArray_2.length; i++) {
            _loop_3(i);
        }
        (0, index_js_1.throttle)(function () {
            index_js_1.game.setObject("kayF_GdniUHiAXJ6NhLHT", "beach_gate", {
                normal: "https://s3.amazonaws.com/www.raidtheroom.online/gather-images/gather-image-1706394531767-blank.png", // Blank
                highlighted: "https://s3.amazonaws.com/www.raidtheroom.online/gather-images/gather-image-1706394531767-blank.png", // Blank
            });
            index_js_1.game.setMapCollisions(map_id, 31, 19, 2, 1, (0, exports.generateMask)(2, 1, 0x00));
            console.log("Collision removed from the beach gate");
        });
        if (beach_end_time == 0) {
            beach_end_time = Date.now();
            console.log("Beach End Time: " + beach_end_time);
            beach_duration = (beach_end_time - team_start_time) / 1000;
            console.log("Beach Duration: " + beach_duration);
            cumulative_time = beach_duration;
        }
        var newRowRTRDatabase = {
            'field_1': "Escape the Island 1.5 Input",
            'player_id': playerId,
            'display_name': player.name,
            'object_id': object_id,
            'space_id': index_js_1.game.spaceId,
            'map_id': player.map,
            'player_xy': player.x + ", " + player.y,
            'timestamp': Date.now(),
            'field_2': "Beach Room Completed",
            // 'field_3': beach_duration,      
            // 'field_4': cumulative_time,
            "converted_date_time": team_start_time,
        };
        axios_1.default.post("https://rtr-web.herokuapp.com/api/gather-tracker/eti-test-progress", newRowRTRDatabase).then(function (res) {
            // console.log(res.data);
            console.log("Beach Room Completed DB at: " + (0, exports.getCurrentTime)());
        }).catch(function (error) {
            console.log(error);
        });
        (0, index_js_1.throttle)(function () {
            var payload = {
                // "text": "📈" + getCurrentTime() + '\n' + "Team: " + "https://app.gather.town/app/" + game.spaceId + '\n' + "PROGRESS: " + "Completed Beach in " + parseFloat((60/60).toFixed(2)) + '\n' + '\n'
                "text": "📈" + (0, exports.getCurrentTime)() + '\n' + "Team: " + "https://app.gather.town/app/" + index_js_1.game.spaceId + '\n' + "PROGRESS: " + "Completed Beach in " + parseFloat((beach_duration / 60).toFixed(2)) + '\n' + '\n'
            };
            axios_1.default.post("https://hooks.slack.com/services/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", payload).then(function (res) {
                // console.log(res.data);
                console.log("Completed Beach to Slack" + (0, exports.getCurrentTime)());
            }).catch(function (error) {
                console.log(error.data);
            });
        });
    }
}
exports.checkBeachCompleted = checkBeachCompleted;
function checkStartGameTimer(map_id, playerId, player, object_id, game_start_timer_input) {
    if (team_start_time == 0 && game_start_timer_input == "start") {
        team_start_time = Date.now();
        console.log("Team Session ID: " + team_start_time + " started at " + (0, exports.getCurrentTime)());
        var teamArray_3 = [];
        teamArray_3 = index_js_1.game.filterUidsInSpace(function (player) { return player.map == player.map; });
        var _loop_4 = function (i) {
            (0, index_js_1.throttle)(function () {
                index_js_1.game.teleport(player.map, 36, 54, teamArray_3[i]);
                index_js_1.game.playSound("https://s3.amazonaws.com/raidtheroom.online/gather/sounds/game-start.mp3", 0.25, teamArray_3[i]);
            });
        };
        for (var i = 0; i < teamArray_3.length; i++) {
            _loop_4(i);
        }
        var newRowRTRDatabase = {
            'field_1': "Escape the Island 1.5 Input",
            'player_id': playerId,
            'display_name': player.name,
            'object_id': object_id,
            'space_id': index_js_1.game.spaceId,
            'map_id': player.map,
            'player_xy': player.x + ", " + player.y,
            'timestamp': Date.now(),
            'field_2': "Game Started",
            "converted_date_time": team_start_time,
        };
        axios_1.default.post("https://rtr-web.herokuapp.com/api/gather-tracker/eti-luan-progress", newRowRTRDatabase).then(function (res) {
            // console.log(res.data);
            console.log("Game Started at: " + (0, exports.getCurrentTime)());
        }).catch(function (error) {
            console.log(error);
        });
        (0, index_js_1.throttle)(function () {
            var payload = {
                "text": "📈" + (0, exports.getCurrentTime)() + '\n' + "Team: " + "https://app.gather.town/app/" + index_js_1.game.spaceId + '\n' + "PROGRESS: " + "Game Started" + '\n' + '\n'
            };
            axios_1.default.post("https://hooks.slack.com/services/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", payload).then(function (res) {
                // console.log(res.data);
                console.log("Game Started Sent to Slack" + (0, exports.getCurrentTime)());
            }).catch(function (error) {
                console.log(error.data);
            });
        });
        (0, index_js_1.throttle)(function () {
            index_js_1.game.setObject(player.map, object_id, {
                normal: "https://cdn.gather.town/v0/b/gather-town.appspot.com/o/internal-dashboard-upload%2FOAS5P91MeHHJ9X3x?alt=media&token=5cbaf712-c15f-47ca-9a35-160831d22ffd",
            });
            index_js_1.game.setImpassable(player.map, 37, 54, false);
        });
    }
}
exports.checkStartGameTimer = checkStartGameTimer;
function interactsFirePit(map_id, playerId, player, object_id) {
    if (player.itemString.includes("firepit")) {
        (0, index_js_1.throttle)(function () {
            index_js_1.game.setItem("", "", playerId);
        });
    }
    else {
        (0, index_js_1.throttle)(function () {
            index_js_1.game.setItem("firepit", "https://s3.amazonaws.com/www.raidtheroom.online/gather-images/gather-image-1706394874548-fireball.png", playerId);
            index_js_1.game.playSound("https://s3.amazonaws.com/raidtheroom.online/gather/sounds/lit-match.mp3", 1, playerId);
        });
        var newRowRTRDatabase = {
            'field_1': "Escape the Island 1.5 Input",
            'player_id': playerId,
            'display_name': player.name,
            'object_id': object_id,
            'space_id': index_js_1.game.spaceId,
            'map_id': player.map,
            'player_xy': player.x + ", " + player.y,
            'timestamp': Date.now(),
            'field_2': "Fire grabbed by: " + player.name,
            "converted_date_time": team_start_time,
        };
        axios_1.default.post("https://rtr-web.herokuapp.com/api/gather-tracker/eti-prod-input", newRowRTRDatabase).then(function (res) {
            // console.log(res.data);
            console.log(player.name + " lit " + object_id + " at " + (0, exports.getCurrentTime)());
        }).catch(function (error) {
            console.log(error);
        });
    }
}
exports.interactsFirePit = interactsFirePit;
function interactsTikiTorch(map_id, playerId, player, object_id) {
    (0, index_js_1.throttle)(function () {
        index_js_1.game.setObject(player.map, object_id.toString(), {
            normal: "https://s3.amazonaws.com/www.raidtheroom.online/gather-images/gather-image-1706397124182-small-tikki-torch-lit.png",
        });
        index_js_1.game.playSound("https://s3.amazonaws.com/raidtheroom.online/gather/sounds/fire-lit-short.mp3", 0.25, playerId);
        var newRowRTRDatabase = {
            'field_1': "Escape the Island 1.5 Input",
            'player_id': playerId,
            'display_name': player.name,
            'object_id': object_id,
            'space_id': index_js_1.game.spaceId,
            'map_id': player.map,
            'player_xy': player.x + ", " + player.y,
            'timestamp': Date.now(),
            'field_2': "Tiki Torch Lit: " + object_id,
            "converted_date_time": team_start_time,
        };
        axios_1.default.post("https://rtr-web.herokuapp.com/api/gather-tracker/eti-prod-input", newRowRTRDatabase).then(function (res) {
            // console.log(res.data);
            console.log(player.name + " lit " + object_id + " at " + (0, exports.getCurrentTime)());
        }).catch(function (error) {
            console.log(error);
        });
        switch (object_id) {
            case "tiki_torch_1":
                tiki_1_check = true;
                break;
            case "tiki_torch_2":
                tiki_2_check = true;
                break;
            case "tiki_torch_3":
                tiki_3_check = true;
                break;
            case "tiki_torch_4":
                tiki_4_check = true;
                break;
            case "tiki_torch_5":
                tiki_5_check = true;
                break;
            case "tiki_torch_6":
                tiki_6_check = true;
                break;
            default:
                // Do nothing
                break;
        }
        console.log(object_id + " lit");
    });
    (0, index_js_1.throttle)(function () {
        index_js_1.game.setItem("", "", playerId);
    });
    checkTikiPuzzle(player.map, playerId, player, object_id);
}
exports.interactsTikiTorch = interactsTikiTorch;
function checkTikiPuzzle(map_id, playerId, player, object_id) {
    (0, index_js_1.throttle)(function () {
        if ((tiki_1_check === true
            && tiki_2_check === true
            && tiki_3_check === true
            && tiki_4_check === true
            && tiki_5_check === true
            && tiki_6_check === true
            && tikiCompleted === false)) {
            tikiCompleted = true;
            var crystal_ball_green_1 = "https://s3.amazonaws.com/www.raidtheroom.online/gather-images/gather-image-1706391024635-crystal-ball-green-gray-feet.png";
            (0, index_js_1.throttle)(function () {
                index_js_1.game.setObject(map_id, "crystal_ball_clear_1", {
                    normal: crystal_ball_green_1,
                });
            });
            (0, index_js_1.throttle)(function () {
                index_js_1.game.setObject(map_id, "tribonds_cover", {
                    normal: "https://s3.amazonaws.com/www.raidtheroom.online/gather-images/gather-image-1706394531767-blank.png",
                });
            });
            var teamArray_4 = [];
            teamArray_4 = index_js_1.game.filterUidsInSpace(function (player) { return player.map == map_id; });
            var _loop_5 = function (i) {
                (0, index_js_1.throttle)(function () {
                    index_js_1.game.playSound("https://s3.amazonaws.com/raidtheroom.online/gather/sounds/Win%20-%20588234__mehraniiii__win.wav", 0.25, teamArray_4[i]);
                });
            };
            for (var i = 0; i < teamArray_4.length; i++) {
                _loop_5(i);
            }
            if (tiki_end_time == 0) {
                tiki_end_time = Date.now();
                console.log("Tiki Torch Puzzle End Time: " + tiki_end_time);
                tiki_duration = (tiki_end_time - team_start_time) / 1000;
                console.log("Tiki Torch Puzzle Duration: " + tiki_duration);
            }
            var newRowRTRDatabase = {
                'field_1': "Escape the Island 1.5 Input",
                'player_id': playerId,
                'display_name': player.name,
                'object_id': object_id,
                'space_id': index_js_1.game.spaceId,
                'map_id': player.map,
                'player_xy': player.x + ", " + player.y,
                'timestamp': Date.now(),
                'field_2': "Tiki Torch Puzzle Completed",
                'field_3': tiki_duration,
                "converted_date_time": team_start_time,
            };
            axios_1.default.post("https://rtr-web.herokuapp.com/api/gather-tracker/eti-test-progress", newRowRTRDatabase).then(function (res) {
                // console.log(res.data);
                console.log("Tiki Torch Puzzle Completed DB at: " + (0, exports.getCurrentTime)());
            }).catch(function (error) {
                console.log(error);
            });
            (0, index_js_1.throttle)(function () {
                var payload = {
                    "text": "📈" + (0, exports.getCurrentTime)() + '\n' + "Team: " + "https://app.gather.town/app/" + index_js_1.game.spaceId + '\n' + "PROGRESS: " + "Completed Tiki Torches in " + parseFloat((tiki_duration / 60).toFixed(2)) + " minutes" + '\n' + '\n'
                };
                axios_1.default.post("https://hooks.slack.com/services/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", payload).then(function (res) {
                    // console.log(res.data);
                    console.log("Completed Tiki Torches Sent to Slack" + (0, exports.getCurrentTime)());
                }).catch(function (error) {
                    console.log(error.data);
                });
            });
            checkBeachCompleted(map_id, playerId, player, object_id);
        }
    });
}
exports.checkTikiPuzzle = checkTikiPuzzle;
function checkCodebreaker_1st_Digit(map_id, playerId, player, object_id, codebreaker_submit_1_input) {
    var newRowRTRDatabase = {
        'field_1': "Escape the Island 1.5 Input",
        'player_id': playerId,
        'display_name': player.name,
        'object_id': object_id,
        'space_id': index_js_1.game.spaceId,
        'map_id': player.map,
        'player_xy': player.x + ", " + player.y,
        'timestamp': Date.now(),
        'field_2': codebreaker_submit_1_input,
        "converted_date_time": team_start_time,
    };
    axios_1.default.post("https://rtr-web.herokuapp.com/api/gather-tracker/eti-test-input", newRowRTRDatabase).then(function (res) {
        // console.log(res.data);
        console.log(player.name + " input " + codebreaker_submit_1_input + " on FIRST CB spot at: " + (0, exports.getCurrentTime)());
    }).catch(function (error) {
        console.log(error);
    });
    (0, index_js_1.throttle)(function () {
        index_js_1.game.setObject(player.map, object_id.toString(), {
            normal: "https://0ev63k7wu9.execute-api.us-west-2.amazonaws.com/dev/draw-text?text=%20%20" + codebreaker_submit_1_input + "&font=Roboto-Bold.ttf&red=256&green=256&blue=256&size=20", // Text Value
            highlighted: "https://0ev63k7wu9.execute-api.us-west-2.amazonaws.com/dev/draw-text?text=%20%20" + codebreaker_submit_1_input + "&font=Roboto-Bold.ttf&red=256&green=256&blue=256&size=20", // Text Value
        });
        index_js_1.game.playSound("https://s3.amazonaws.com/raidtheroom.online/gather/sounds/chalk-short.mp3", 1, playerId);
    });
    if (codebreaker_submit_1_input === "5") {
        codebreaker_1_check = true;
        checkCodebreaker(player.map, playerId, player, object_id);
    }
    else if (codebreaker_submit_1_input != "5") {
        codebreaker_1_check = false;
    }
}
exports.checkCodebreaker_1st_Digit = checkCodebreaker_1st_Digit;
function checkCodebreaker_2nd_Digit(map_id, playerId, player, object_id, codebreaker_submit_2_input) {
    var newRowRTRDatabase = {
        'field_1': "Escape the Island 1.5 Input",
        'player_id': playerId,
        'display_name': player.name,
        'object_id': object_id,
        'space_id': index_js_1.game.spaceId,
        'map_id': player.map,
        'player_xy': player.x + ", " + player.y,
        'timestamp': Date.now(),
        'field_2': codebreaker_submit_2_input,
        "converted_date_time": team_start_time,
    };
    axios_1.default.post("https://rtr-web.herokuapp.com/api/gather-tracker/eti-test-input", newRowRTRDatabase).then(function (res) {
        // console.log(res.data);
        console.log(player.name + " input " + codebreaker_submit_2_input + " on SECOND CB spot at: " + (0, exports.getCurrentTime)());
    }).catch(function (error) {
        console.log(error);
    });
    (0, index_js_1.throttle)(function () {
        index_js_1.game.setObject(player.map, object_id.toString(), {
            normal: "https://0ev63k7wu9.execute-api.us-west-2.amazonaws.com/dev/draw-text?text=%20%20" + codebreaker_submit_2_input + "&font=Roboto-Bold.ttf&red=256&green=256&blue=256&size=20", // Text Value
            highlighted: "https://0ev63k7wu9.execute-api.us-west-2.amazonaws.com/dev/draw-text?text=%20%20" + codebreaker_submit_2_input + "&font=Roboto-Bold.ttf&red=256&green=256&blue=256&size=20", // Text Value
        });
        index_js_1.game.playSound("https://s3.amazonaws.com/raidtheroom.online/gather/sounds/chalk-short.mp3", 1, playerId);
    });
    if (codebreaker_submit_2_input === "2") {
        codebreaker_2_check = true;
        checkCodebreaker(player.map, playerId, player, object_id);
    }
    else if (codebreaker_submit_2_input != "2") {
        codebreaker_2_check = false;
    }
}
exports.checkCodebreaker_2nd_Digit = checkCodebreaker_2nd_Digit;
function checkCodebreaker_3rd_Digit(map_id, playerId, player, object_id, codebreaker_submit_3_input) {
    var newRowRTRDatabase = {
        'field_1': "Escape the Island 1.5 Input",
        'player_id': playerId,
        'display_name': player.name,
        'object_id': object_id,
        'space_id': index_js_1.game.spaceId,
        'map_id': player.map,
        'player_xy': player.x + ", " + player.y,
        'timestamp': Date.now(),
        'field_2': codebreaker_submit_3_input,
        "converted_date_time": team_start_time,
    };
    axios_1.default.post("https://rtr-web.herokuapp.com/api/gather-tracker/eti-test-input", newRowRTRDatabase).then(function (res) {
        // console.log(res.data);
        console.log(player.name + " input " + codebreaker_submit_3_input + " on THIRD CB spot at: " + (0, exports.getCurrentTime)());
    }).catch(function (error) {
        console.log(error);
    });
    (0, index_js_1.throttle)(function () {
        index_js_1.game.setObject(player.map, object_id.toString(), {
            normal: "https://0ev63k7wu9.execute-api.us-west-2.amazonaws.com/dev/draw-text?text=%20%20" + codebreaker_submit_3_input + "&font=Roboto-Bold.ttf&red=256&green=256&blue=256&size=20", // Text Value
            highlighted: "https://0ev63k7wu9.execute-api.us-west-2.amazonaws.com/dev/draw-text?text=%20%20" + codebreaker_submit_3_input + "&font=Roboto-Bold.ttf&red=256&green=256&blue=256&size=20", // Text Value
        });
        index_js_1.game.playSound("https://s3.amazonaws.com/raidtheroom.online/gather/sounds/chalk-short.mp3", 1, playerId);
    });
    if (codebreaker_submit_3_input === "8") {
        codebreaker_3_check = true;
        checkCodebreaker(player.map, playerId, player, object_id);
    }
    else if (codebreaker_submit_3_input != "8") {
        codebreaker_3_check = false;
    }
}
exports.checkCodebreaker_3rd_Digit = checkCodebreaker_3rd_Digit;
function checkCodebreaker(map_id, playerId, player, object_id) {
    (0, index_js_1.throttle)(function () {
        if ((codebreaker_1_check === true
            && codebreaker_2_check === true
            && codebreaker_3_check === true
            && codebreakerCompleted === false)) {
            codebreakerCompleted = true;
            var crystal_ball_green_2 = "https://s3.amazonaws.com/www.raidtheroom.online/gather-images/gather-image-1706391024635-crystal-ball-green-gray-feet.png";
            (0, index_js_1.throttle)(function () {
                index_js_1.game.setObject(map_id, "crystal_ball_clear_3", {
                    normal: crystal_ball_green_2,
                });
                console.log("Codebreaker Puzzle Completed");
                console.log(codebreaker_1_check);
                console.log(codebreaker_2_check);
                console.log(codebreaker_3_check);
            });
            var teamArray_5 = [];
            teamArray_5 = index_js_1.game.filterUidsInSpace(function (player) { return player.map == map_id; });
            var _loop_6 = function (i) {
                (0, index_js_1.throttle)(function () {
                    index_js_1.game.playSound("https://s3.amazonaws.com/raidtheroom.online/gather/sounds/Win%20-%20588234__mehraniiii__win.wav", 0.25, teamArray_5[i]);
                });
            };
            for (var i = 0; i < teamArray_5.length; i++) {
                _loop_6(i);
            }
            if (codebreaker_end_time == 0) {
                codebreaker_end_time = Date.now();
                console.log("Codebreaker End Time: " + codebreaker_end_time);
                codebreaker_duration = (codebreaker_end_time - tribonds_end_time) / 1000;
                console.log("Codebreaker Duration: " + codebreaker_duration);
            }
            var newRowRTRDatabase = {
                'field_1': "Escape the Island 1.5 Input",
                'player_id': playerId,
                'display_name': player.name,
                'object_id': object_id,
                'space_id': index_js_1.game.spaceId,
                'map_id': player.map,
                'player_xy': player.x + ", " + player.y,
                'timestamp': Date.now(),
                'field_2': "Codebreaker Puzzle Completed",
                'field_3': codebreaker_duration,
                "converted_date_time": team_start_time,
            };
            axios_1.default.post("https://rtr-web.herokuapp.com/api/gather-tracker/eti-test-progress", newRowRTRDatabase).then(function (res) {
                // console.log(res.data);
                console.log("Codebreak Puzzle Completed DB at: " + (0, exports.getCurrentTime)());
            }).catch(function (error) {
                console.log(error);
            });
            (0, index_js_1.throttle)(function () {
                var payload = {
                    "text": "📈" + (0, exports.getCurrentTime)() + '\n' + "Team: " + "https://app.gather.town/app/" + index_js_1.game.spaceId + '\n' + "PROGRESS: " + "Completed Codebreaker in " + parseFloat((codebreaker_duration / 60).toFixed(2)) + " minutes" + '\n' + '\n'
                };
                axios_1.default.post("https://hooks.slack.com/services/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", payload).then(function (res) {
                    // console.log(res.data);
                    console.log("Completed Codebreaker Sent to Slack" + (0, exports.getCurrentTime)());
                }).catch(function (error) {
                    console.log(error.data);
                });
            });
            checkBeachCompleted(map_id, playerId, player, object_id);
        }
    });
}
exports.checkCodebreaker = checkCodebreaker;
function resetCollisions() {
    // Reset Beach Gate Collisions
    (0, index_js_1.throttle)(function () {
        index_js_1.game.setImpassable("kayF_GdniUHiAXJ6NhLHT", 37, 54, true);
        index_js_1.game.setMapCollisions("kayF_GdniUHiAXJ6NhLHT", 31, 19, 2, 1, (0, exports.generateMask)(2, 1, 0x01));
    });
    console.log("Collisions reset at the beach gate");
    // Reset Maze Collisions
    (0, index_js_1.throttle)(function () {
        // game.setMapCollisions("7bY0bQ5t5-M_yaLoZf-OA", 42, 23, 1, 5, generateMask(1, 5, 0x01));
        index_js_1.game.setImpassable("7bY0bQ5t5-M_yaLoZf-OA", ObjectData_js_1.ALL_OBJECTS.lockbox_red.gather.x, ObjectData_js_1.ALL_OBJECTS.lockbox_red.gather.y, true);
        index_js_1.game.setImpassable("7bY0bQ5t5-M_yaLoZf-OA", ObjectData_js_1.ALL_OBJECTS.lockbox_yellow.gather.x, ObjectData_js_1.ALL_OBJECTS.lockbox_yellow.gather.y, true);
        index_js_1.game.setImpassable("7bY0bQ5t5-M_yaLoZf-OA", ObjectData_js_1.ALL_OBJECTS.lockbox_orange.gather.x, ObjectData_js_1.ALL_OBJECTS.lockbox_orange.gather.y, true);
        index_js_1.game.setImpassable("7bY0bQ5t5-M_yaLoZf-OA", ObjectData_js_1.ALL_OBJECTS.lockbox_blue.gather.x, ObjectData_js_1.ALL_OBJECTS.lockbox_blue.gather.y, true);
        index_js_1.game.setImpassable("7bY0bQ5t5-M_yaLoZf-OA", ObjectData_js_1.ALL_OBJECTS.lockbox_purple.gather.x, ObjectData_js_1.ALL_OBJECTS.lockbox_purple.gather.y, true);
    });
    // Reset Jungle Collisions
    (0, index_js_1.throttle)(function () {
        index_js_1.game.setMapCollisions("4S6s6mZv9wsUtmTjV34Eg", 35, 35, 2, 2, (0, exports.generateMask)(2, 2, 0x01));
    });
}
exports.resetCollisions = resetCollisions;
function postGrabKey(map_id, playerId, player, object_id) {
    var newRowRTRDatabase = {
        'field_1': "Escape the Island 1.5 Input",
        'player_id': playerId,
        'display_name': player.name,
        'object_id': object_id,
        'space_id': index_js_1.game.spaceId,
        'map_id': player.map,
        'player_xy': player.x + ", " + player.y,
        'timestamp': Date.now(),
        'field_2': "Key grabbed by: " + player.name,
        "converted_date_time": team_start_time,
    };
    axios_1.default.post("https://rtr-web.herokuapp.com/api/gather-tracker/eti-test-input", newRowRTRDatabase).then(function (res) {
        // console.log(res.data);
        console.log(player.name + " grabbed " + object_id + " at " + (0, exports.getCurrentTime)());
    }).catch(function (error) {
        console.log(error);
    });
}
exports.postGrabKey = postGrabKey;
function postMazeCompleted(map_id, playerId, player, object_id) {
    if (maze_end_time == 0) {
        maze_end_time = Date.now();
        console.log("Maze End Time: " + maze_end_time);
        maze_duration = (maze_end_time - maze_start_time) / 1000;
        console.log("Maze Duration: " + maze_duration);
        cumulative_time = (maze_end_time - team_start_time) / 1000;
        jungle_start_time = Date.now();
    }
    var newRowRTRDatabase = {
        'field_1': "Escape the Island 1.5 Input",
        'player_id': playerId,
        'display_name': player.name,
        'object_id': object_id,
        'space_id': index_js_1.game.spaceId,
        'map_id': player.map,
        'player_xy': player.x + ", " + player.y,
        'timestamp': Date.now(),
        'field_2': "Maze Room Completed",
        'field_3': maze_duration,
        'field_4': cumulative_time,
        "converted_date_time": team_start_time,
    };
    axios_1.default.post("https://rtr-web.herokuapp.com/api/gather-tracker/eti-test-progress", newRowRTRDatabase).then(function (res) {
        // console.log(res.data);
        console.log("Maze Room Completed DB at: " + (0, exports.getCurrentTime)());
    }).catch(function (error) {
        console.log(error);
    });
    (0, index_js_1.throttle)(function () {
        var payload = {
            "text": "📈" + (0, exports.getCurrentTime)() + '\n' + "Team: " + "https://app.gather.town/app/" + index_js_1.game.spaceId + '\n' + "PROGRESS: " + "Completed Maze in " + parseFloat((maze_duration / 60).toFixed(2)) + " minutes" + '\n' + '\n'
        };
        axios_1.default.post("https://hooks.slack.com/services/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", payload).then(function (res) {
            // console.log(res.data);
            console.log("Completed Maze Sent to Slack" + (0, exports.getCurrentTime)());
        }).catch(function (error) {
            console.log(error.data);
        });
    });
}
exports.postMazeCompleted = postMazeCompleted;
function postLockboxUnlocked(map_id, playerId, player, object_id) {
    var newRowRTRDatabase = {
        'field_1': "Escape the Island 1.5 Input",
        'player_id': playerId,
        'display_name': player.name,
        'object_id': object_id,
        'space_id': index_js_1.game.spaceId,
        'map_id': player.map,
        'player_xy': player.x + ", " + player.y,
        'timestamp': Date.now(),
        'field_2': "Lockbox unlocked by: " + player.name,
        "converted_date_time": team_start_time,
    };
    axios_1.default.post("https://rtr-web.herokuapp.com/api/gather-tracker/eti-test-input", newRowRTRDatabase).then(function (res) {
        // console.log(res.data);
        console.log(player.name + " interacted with " + object_id + " at " + (0, exports.getCurrentTime)());
    }).catch(function (error) {
        console.log(error);
    });
}
exports.postLockboxUnlocked = postLockboxUnlocked;
function useMagicCircle(map_id, playerId, player, object_id, magic_circle_input) {
    var newRowRTRDatabase = {
        'field_1': "Escape the Island 1.5 Input",
        'player_id': playerId,
        'display_name': player.name,
        'object_id': object_id,
        'space_id': index_js_1.game.spaceId,
        'map_id': player.map,
        'player_xy': player.x + ", " + player.y,
        'timestamp': Date.now(),
        'field_2': magic_circle_input,
        "converted_date_time": team_start_time,
    };
    axios_1.default.post("https://rtr-web.herokuapp.com/api/gather-tracker/eti-test-input", newRowRTRDatabase).then(function (res) {
        // console.log(res.data);
        console.log(player.name + " input " + magic_circle_input + " on Magic Circle at: " + (0, exports.getCurrentTime)());
    }).catch(function (error) {
        console.log(error);
    });
    (0, index_js_1.throttle)(function () {
        index_js_1.game.playSound("https://s3.amazonaws.com/raidtheroom.online/gather/sounds/magic-missile.mp3", 0.25, playerId);
    });
    if (index_js_1.raidPlayerOutfit[playerId] == undefined) {
        index_js_1.raidPlayerOutfit[playerId] = player.currentlyEquippedWearables;
    }
    if (magic_circle_input === "sheep") {
        index_js_1.game.setCurrentlyEquippedWearables({
            "skin": "none",
            "hair": "",
            "facial_hair": "",
            "top": "",
            "bottom": "",
            "shoes": "",
            "hat": "",
            "glasses": "",
            "other": "",
            "costume": "akANoLHkQWGRHia0uYgg",
            "mobility": "",
            "jacket": ""
        }, playerId);
    }
    if (magic_circle_input === "chicken") {
        index_js_1.game.setCurrentlyEquippedWearables({
            "skin": "none",
            "hair": "",
            "facial_hair": "",
            "top": "",
            "bottom": "",
            "shoes": "",
            "hat": "",
            "glasses": "",
            "other": "",
            "costume": "wesl312rqJvIVHpU1pJ0",
            "mobility": "",
            "jacket": ""
        }, playerId);
    }
    if (magic_circle_input === "frog") {
        index_js_1.game.setCurrentlyEquippedWearables({
            "skin": "none",
            "hair": "",
            "facial_hair": "",
            "top": "",
            "bottom": "",
            "shoes": "",
            "hat": "",
            "glasses": "",
            "other": "",
            "costume": "7U3AcqhrNsHnqX66rdcV",
            "mobility": "",
            "jacket": ""
        }, playerId);
    }
    if (magic_circle_input === "mouse") {
        index_js_1.game.setCurrentlyEquippedWearables({
            "skin": "none",
            "hair": "",
            "facial_hair": "",
            "top": "",
            "bottom": "",
            "shoes": "",
            "hat": "",
            "glasses": "",
            "other": "",
            "costume": "QIQvEXvXF3mw6knrlkvS",
            "mobility": "",
            "jacket": ""
        }, playerId);
    }
    if (magic_circle_input === "human") {
        index_js_1.game.setCurrentlyEquippedWearables({
            "skin": Object.values(index_js_1.raidPlayerOutfit[playerId])[0].toString(),
            "hair": Object.values(index_js_1.raidPlayerOutfit[playerId])[1].toString(),
            "facial_hair": Object.values(index_js_1.raidPlayerOutfit[playerId])[2].toString(),
            "top": Object.values(index_js_1.raidPlayerOutfit[playerId])[3].toString(),
            "bottom": Object.values(index_js_1.raidPlayerOutfit[playerId])[4].toString(),
            "shoes": Object.values(index_js_1.raidPlayerOutfit[playerId])[5].toString(),
            "hat": Object.values(index_js_1.raidPlayerOutfit[playerId])[6].toString(),
            "glasses": Object.values(index_js_1.raidPlayerOutfit[playerId])[7].toString(),
            "other": Object.values(index_js_1.raidPlayerOutfit[playerId])[8].toString(),
            "costume": Object.values(index_js_1.raidPlayerOutfit[playerId])[9].toString(),
            "mobility": Object.values(index_js_1.raidPlayerOutfit[playerId])[10].toString(),
            "jacket": Object.values(index_js_1.raidPlayerOutfit[playerId])[11].toString()
        }, playerId);
    }
}
exports.useMagicCircle = useMagicCircle;
function checkOldManText(map_id, playerId, player, object_id, old_man_text_input) {
    var newRowRTRDatabase = {
        'field_1': "Escape the Island 1.5 Input",
        'player_id': playerId,
        'display_name': player.name,
        'object_id': object_id,
        'space_id': index_js_1.game.spaceId,
        'map_id': player.map,
        'player_xy': player.x + ", " + player.y,
        'timestamp': Date.now(),
        'field_2': old_man_text_input,
        "converted_date_time": team_start_time,
    };
    axios_1.default.post("https://rtr-web.herokuapp.com/api/gather-tracker/eti-test-input", newRowRTRDatabase).then(function (res) {
        // console.log(res.data);
        console.log(player.name + " input " + old_man_text_input + " on Old Man at: " + (0, exports.getCurrentTime)());
    }).catch(function (error) {
        console.log(error);
    });
    if (old_man_text_input === "check") {
        var sheep_1 = index_js_1.game.getObject("sheep_drop_1", player.map).obj.normal;
        var sheep_2 = index_js_1.game.getObject("sheep_drop_2", player.map).obj.normal;
        var chicken_1 = index_js_1.game.getObject("chicken_drop_1", player.map).obj.normal;
        var chicken_2 = index_js_1.game.getObject("chicken_drop_2", player.map).obj.normal;
        var frog_1 = index_js_1.game.getObject("frog_drop_1", player.map).obj.normal;
        var frog_2 = index_js_1.game.getObject("frog_drop_2", player.map).obj.normal;
        var mouse_1 = index_js_1.game.getObject("mouse_drop_1", player.map).obj.normal;
        var mouse_2 = index_js_1.game.getObject("mouse_drop_2", player.map).obj.normal;
        var strawberry = "https://s3.amazonaws.com/www.raidtheroom.online/gather-images/gather-image-1706549559584-strawberry.png";
        var coconut = "https://s3.amazonaws.com/www.raidtheroom.online/gather-images/gather-image-1706549559459-coconut.png";
        var apple = "https://s3.amazonaws.com/www.raidtheroom.online/gather-images/gather-image-1706549559454-apple_red_leaf_2.png";
        var beet = "https://s3.amazonaws.com/www.raidtheroom.online/gather-images/gather-image-1706549559472-Beet_2%2032x32-Aseprite.png";
        var orange = "https://s3.amazonaws.com/www.raidtheroom.online/gather-images/gather-image-1706549559557-Orange_2%2032x32%20-%20Aseprite.png";
        var acorn = "https://s3.amazonaws.com/www.raidtheroom.online/gather-images/gather-image-1706549559419-Acorn_2%2032x32-Aseprite.png";
        var banana = "https://s3.amazonaws.com/www.raidtheroom.online/gather-images/gather-image-1706549559457-banana.png";
        var grapes = "https://s3.amazonaws.com/www.raidtheroom.online/gather-images/gather-image-1706549559470-Grapes_2%2032x32%20-%20Aseprite.png";
        if (((sheep_1 == strawberry && sheep_2 == coconut) || (sheep_1 == coconut && sheep_2 == strawberry))
            &&
                ((chicken_1 == apple && chicken_2 == beet) || (chicken_1 == beet && chicken_2 == apple))
            &&
                ((frog_1 == orange && frog_2 == acorn) || (frog_1 == acorn && frog_2 == orange))
            &&
                ((mouse_1 == banana && mouse_2 == grapes) || (mouse_1 == grapes && mouse_2 == banana))) {
            // Final Submission is correct
            final_area_start_time = Date.now();
            var teamArray_6 = [];
            teamArray_6 = index_js_1.game.filterUidsInSpace(function (player) { return player.map == player.map; });
            var _loop_7 = function (i) {
                (0, index_js_1.throttle)(function () {
                    index_js_1.game.playSound("https://s3.amazonaws.com/raidtheroom.online/gather/sounds/room-completed.mp3", 0.25, teamArray_6[i]);
                });
                if (index_js_1.raidPlayerOutfit[teamArray_6[i]] != undefined) {
                    (0, index_js_1.throttle)(function () {
                        var skin = Object.values(index_js_1.raidPlayerOutfit[teamArray_6[i]])[0].toString();
                        var hair = Object.values(index_js_1.raidPlayerOutfit[teamArray_6[i]])[1].toString();
                        var facial_hair = Object.values(index_js_1.raidPlayerOutfit[teamArray_6[i]])[2].toString();
                        var top = Object.values(index_js_1.raidPlayerOutfit[teamArray_6[i]])[3].toString();
                        var bottom = Object.values(index_js_1.raidPlayerOutfit[teamArray_6[i]])[4].toString();
                        var shoes = Object.values(index_js_1.raidPlayerOutfit[teamArray_6[i]])[5].toString();
                        var hat = Object.values(index_js_1.raidPlayerOutfit[teamArray_6[i]])[6].toString();
                        var glasses = Object.values(index_js_1.raidPlayerOutfit[teamArray_6[i]])[7].toString();
                        var other = Object.values(index_js_1.raidPlayerOutfit[teamArray_6[i]])[8].toString();
                        var costume = Object.values(index_js_1.raidPlayerOutfit[teamArray_6[i]])[9].toString();
                        var mobility = Object.values(index_js_1.raidPlayerOutfit[teamArray_6[i]])[10].toString();
                        var jacket = Object.values(index_js_1.raidPlayerOutfit[teamArray_6[i]])[11].toString();
                        index_js_1.game.setCurrentlyEquippedWearables({
                            "skin": skin,
                            "hair": hair,
                            "facial_hair": facial_hair,
                            "top": top,
                            "bottom": bottom,
                            "shoes": shoes,
                            "hat": hat,
                            "glasses": glasses,
                            "other": other,
                            "costume": costume,
                            "mobility": mobility,
                            "jacket": jacket
                        }, teamArray_6[i]);
                    });
                }
                (0, index_js_1.throttle)(function () {
                    index_js_1.game.setItem("", "", teamArray_6[i]);
                });
            };
            for (var i = 0; i < teamArray_6.length; i++) {
                _loop_7(i);
            }
            (0, index_js_1.throttle)(function () {
                index_js_1.game.setObject(player.map, "rock_gate", {
                    normal: "https://s3.amazonaws.com/www.raidtheroom.online/gather-images/gather-image-1706394531767-blank.png", // Blank
                    highlighted: "https://s3.amazonaws.com/www.raidtheroom.online/gather-images/gather-image-1706394531767-blank.png", // Blank
                });
                index_js_1.game.setMapCollisions(player.map, 35, 35, 2, 2, (0, exports.generateMask)(2, 2, 0x00));
                console.log("Collision removed from the rock gate");
            });
            if (jungle_end_time == 0) {
                jungle_end_time = Date.now();
                team_end_time = jungle_end_time;
                console.log("Jungle End Time: " + jungle_end_time);
                jungle_duration = (jungle_end_time - jungle_start_time) / 1000;
                console.log("Jungle Duration: " + jungle_duration);
                cumulative_time = jungle_end_time - team_start_time;
                team_duration = (cumulative_time) / 1000;
            }
            var newRowRTRDatabase_1 = {
                'field_1': "Escape the Island 1.5 Input",
                'player_id': playerId,
                'display_name': player.name,
                'object_id': object_id,
                'space_id': index_js_1.game.spaceId,
                'map_id': player.map,
                'player_xy': player.x + ", " + player.y,
                'timestamp': Date.now(),
                'field_2': "Jungle Room Completed",
                'field_3': jungle_duration,
                'field_4': cumulative_time,
                'field_5': "Final Submission is correct",
                "converted_date_time": team_start_time,
            };
            axios_1.default.post("https://rtr-web.herokuapp.com/api/gather-tracker/eti-test-progress", newRowRTRDatabase_1).then(function (res) {
                // console.log(res.data);
                console.log("Jungle Room Completed DB at: " + (0, exports.getCurrentTime)());
            }).catch(function (error) {
                console.log(error);
            });
            (0, index_js_1.throttle)(function () {
                var payload = {
                    "text": "📈" + (0, exports.getCurrentTime)() + '\n' + "Team: " + "https://app.gather.town/app/" + index_js_1.game.spaceId + '\n' + "PROGRESS: " + "Completed Jungle in " + parseFloat((jungle_duration / 60).toFixed(2)) + '\n' + '\n'
                };
                axios_1.default.post("https://hooks.slack.com/services/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", payload).then(function (res) {
                    // console.log(res.data);
                    console.log("Completed Jungle to Slack " + (0, exports.getCurrentTime)());
                }).catch(function (error) {
                    console.log(error.data);
                });
            });
            (0, index_js_1.throttle)(function () {
                var payload = {
                    "text": "📈" + (0, exports.getCurrentTime)() + '\n' + "Team: " + "https://app.gather.town/app/" + index_js_1.game.spaceId + '\n' + "PROGRESS: " + "Completed Game in " + parseFloat((team_duration / 60).toFixed(2)) + '\n' + '\n'
                };
                axios_1.default.post("https://hooks.slack.com/services/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", payload).then(function (res) {
                    // console.log(res.data);
                    console.log("Completed Game to Slack " + (0, exports.getCurrentTime)());
                }).catch(function (error) {
                    console.log(error.data);
                });
            });
        }
        else {
            var teamArray_7 = [];
            teamArray_7 = index_js_1.game.filterUidsInSpace(function (player) { return player.map == player.map; });
            var _loop_8 = function (i) {
                (0, index_js_1.throttle)(function () {
                    index_js_1.game.playSound("https://s3.amazonaws.com/raidtheroom.online/gather/sounds/wrong-buzzer.mp3", 0.25, teamArray_7[i]);
                });
            };
            for (var i = 0; i < teamArray_7.length; i++) {
                _loop_8(i);
            }
            (0, index_js_1.throttle)(function () {
                index_js_1.game.chat("ROOM_CHAT", [], player.map, { contents: "Nice try, " + player.name + "! Unfortunately, my animals are not happy with your offerings." + '\n' + '\n' });
            });
        }
    }
}
exports.checkOldManText = checkOldManText;
//# sourceMappingURL=raidLib.js.map