"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.game = exports.player_cooldown = exports.miro_sdk = exports._ = exports.throttle_100 = exports.throttle = exports.raidPlayerTimeSpent = exports.raidPlayerSpokeOnExit = exports.raidTeams = exports.raidTeamMaps = exports.builders = exports.mods = exports.owners = exports.modOrGreaterUids = exports.raidPermissions = exports.raidSpawnRooms = exports.raidRooms = exports.raidPlayerRaceTimer = exports.raidRaceMapsTemp = exports.raidRaceMaps = exports.raidRaceTracks = exports.raidHand = exports.raidEmote = exports.raidPlayerOutfit = exports.raidConfetti = exports.raidPlayersXY = exports.raidObjects = exports.raidPlayers = exports.cumulative_time = exports.team_duration = exports.team_end_time = exports.team_start_time = void 0;
require('dotenv').config();
var gather_game_client_1 = require("@gathertown/gather-game-client");
global.WebSocket = require("isomorphic-ws");
// Time Tracking Variables
exports.team_start_time = 0;
exports.team_end_time = 0;
exports.team_duration = 0;
exports.cumulative_time = 0;
// Tiki Torches Check Variables
// let tiki_1_check = false;
// let tiki_2_check = false;
// let tiki_3_check = false;
// let tiki_4_check = false;
// let tiki_5_check = false;
// let tiki_6_check = false;
// let tiki_end_time = 0;
// let tiki_duration = 0;
// Codebreaker Check Variables
// let codebreaker_1_check = false;
// let codebreaker_2_check = false;
// let codebreaker_3_check = false;
// let codebreaker_end_time = 0;
// let codebreaker_duration = 0;
// Beach Completion Check Variables
// export let tribondsCompleted = false;
// let tikiCompleted = false;
// let codebreakerCompleted = false;
// let beachCompleted = false;
// let beach_end_time = 0;
// let beach_duration = 0;
// Maze Completion Check Variables
// let maze_start_time = 0;
// let maze_end_time = 0;
// let maze_duration = 0;
// Jungle Completion Check Variables
// let jungle_start_time = 0;
// let jungle_end_time = 0;
// let jungle_duration = 0;
// Final Area
// let final_area_start_time = 0;
// let final_area_end_time = 0;
// let final_area_duration = 0;
// Raid Data imports
var ObjectData_1 = require("./raid_data/ObjectData");
var RaidRaceData_1 = require("./raid_data/RaidRaceData");
var RaidRoomData_1 = require("./raid_data/RaidRoomData");
var RaidSpawnData_1 = require("./raid_data/RaidSpawnData");
var RaidTeamMaps_1 = require("./raid_data/RaidTeamMaps");
// Raid Classes imports
var RaidObject_1 = require("./raid_classes/RaidObject");
var RaidRace_1 = require("./raid_classes/RaidRace");
var RaidRoom_1 = require("./raid_classes/RaidRoom");
var RaidLightsOut_1 = require("./raid_classes/RaidLightsOut");
var RaidSpawnZone_1 = require("./raid_classes/RaidSpawnZone");
// Raid Sub import
var RaidplayerMoves_1 = require("./raid_subs/RaidplayerMoves");
var RaidplayerInteracts_1 = require("./raid_subs/RaidplayerInteracts");
var RaidplayerSetsVehicleId_1 = require("./raid_subs/RaidplayerSetsVehicleId");
var RaidplayerShootsConfetti_1 = require("./raid_subs/RaidplayerShootsConfetti");
var RaidspaceSetsMembers_1 = require("./raid_subs/RaidspaceSetsMembers");
var RaidplayerSendsCommand_1 = require("./raid_subs/RaidplayerSendsCommand");
var RaidspaceOverwrites_1 = require("./raid_subs/RaidspaceOverwrites");
var RaidplayerExits_1 = require("./raid_subs/RaidplayerExits");
var RaidplayerSetsAffiliation_1 = require("./raid_subs/RaidplayerSetsAffiliation");
var RaidplayerSetsEmoteV2_1 = require("./raid_subs/RaidplayerSetsEmoteV2");
// Raid Objects import
var SignRaidRoomObject_1 = require("./raid_classes/SignRaidRoomObject");
var EnterRaidObject_1 = require("./raid_classes/EnterRaidObject");
var ExitRaidObject_1 = require("./raid_classes/ExitRaidObject");
var RaidHintObject_1 = require("./raid_classes/RaidHintObject");
var RaidPasswordDoor_1 = require("./raid_classes/RaidPasswordDoor");
var RaidMiroObject_1 = require("./raid_classes/RaidMiroObject");
// Raid Functions import
var raidLib_1 = require("./raid_lib/raidLib");
// Global variables for RtR - tracking
exports.raidPlayers = {};
exports.raidObjects = {};
exports.raidPlayersXY = {};
exports.raidConfetti = {};
exports.raidPlayerOutfit = {};
// Support
exports.raidEmote = {};
exports.raidHand = {};
// Racetrack stuff - deprecicated
exports.raidRaceTracks = {};
exports.raidRaceMaps = [];
exports.raidRaceMapsTemp = {};
exports.raidPlayerRaceTimer = {};
// Raid Room
exports.raidRooms = {};
// Raid Spawn Zones
exports.raidSpawnRooms = {};
// Raid Space members
exports.raidPermissions = {};
exports.modOrGreaterUids = [];
exports.owners = new Set;
exports.mods = new Set;
exports.builders = new Set;
// Raid Teams
exports.raidTeamMaps = {};
exports.raidTeams = {};
// export const raid_ETI_team_start_time: number = 0;
// Raid Exit Tracking
exports.raidPlayerSpokeOnExit = {};
exports.raidPlayerTimeSpent = {};
// Throttle Queue
var throttledQueue = require('throttled-queue');
exports.throttle = throttledQueue(1, 50, true);
exports.throttle_100 = throttledQueue(1, 100, true);
//export const throttle2 = throttledQueue(1, 50, true);
// Lodash
exports._ = require('lodash');
// Miro REST API and authentication
exports.miro_sdk = require('api')('@miro-ea/v2.0#3on7q2wlqcdtj02');
exports.miro_sdk.auth(process.env.MIRO_ACCESS_TOKEN);
// Rate limited cooldown
exports.player_cooldown = {
    timer: 1000, // Window of time before cooldown triggers
    counter: 0, // Number of interactions within a timeframe
    max_counter: 1, // Max number of interaction
    cooldown: 250, // Time limit (ms)
    remaining: 0 // Put Date.now() when triggered
};
// *** Heroku Online Code (Start) ***
//Initial setup for POSTing
var express = require("express");
//const axios = require("axios");
var app = express();
// use alternate localhost and the port Heroku assigns to $PORT
var host = '0.0.0.0';
var port = process.env.PORT || 8000;
// *** Heroku Online Code (End) ***
// Creating game instance
exports.game = new gather_game_client_1.Game(process.env.URL, function () { return Promise.resolve({ apiKey: process.env.API_KEY }); });
(0, RaidspaceOverwrites_1.raidSpaceOverwrites)(exports.game);
exports.game.connect();
exports.game.subscribeToConnection(function (connected) { return console.log("connected?", connected); });
// Main function to be called after game is connected
var main = (function () {
    // Generate an array of raidObjects based off the data from ALL_OBJECTS.ts
    console.log("Generating objects...");
    Object.keys(ObjectData_1.ALL_OBJECTS).forEach(function (index, key, value) {
        var temp_gather = ObjectData_1.ALL_OBJECTS[index].gather;
        var existing;
        existing = exports.game.getObject(temp_gather.id, ObjectData_1.ALL_OBJECTS[index].raid.map_id);
        // ADD IN EKE EXISTING OBJECT CODE HERE
        // Adds the object to raidObjects array based on the behavior
        switch (ObjectData_1.ALL_OBJECTS[index].raid.behavior) {
            case 'LOGIC':
                {
                    var temp_raid = ObjectData_1.ALL_OBJECTS[index].raid;
                    exports.raidObjects[temp_gather.id] = new RaidObject_1.RaidObject(temp_gather, temp_raid, exports.game);
                }
                break;
            case 'LIGHTSOUT':
                {
                    var temp_raid = ObjectData_1.ALL_OBJECTS[index].raid;
                    exports.raidObjects[temp_gather.id] = new RaidLightsOut_1.RaidLightsOut(temp_gather, temp_raid, exports.game);
                }
                break;
            case 'SIGNUP':
                {
                    var temp_raid = ObjectData_1.ALL_OBJECTS[index].raid;
                    exports.raidObjects[temp_gather.id] = new SignRaidRoomObject_1.SignRaidRoomObject(temp_gather, temp_raid, exports.game);
                }
                break;
            case 'ENTER':
                {
                    var temp_raid = ObjectData_1.ALL_OBJECTS[index].raid;
                    exports.raidObjects[temp_gather.id] = new EnterRaidObject_1.EnterRaidRoomObject(temp_gather, temp_raid, exports.game);
                }
                break;
            case 'EXIT':
                {
                    var temp_raid = ObjectData_1.ALL_OBJECTS[index].raid;
                    exports.raidObjects[temp_gather.id] = new ExitRaidObject_1.ExitRaidRoomObject(temp_gather, temp_raid, exports.game);
                }
                break;
            case 'HINT':
                {
                    var temp_raid = ObjectData_1.ALL_OBJECTS[index].raid;
                    exports.raidObjects[temp_gather.id] = new RaidHintObject_1.RaidHintObject(temp_gather, temp_raid, exports.game);
                }
                break;
            case 'PASSWORD':
                {
                    var temp_raid = ObjectData_1.ALL_OBJECTS[index].raid;
                    exports.raidObjects[temp_gather.id] = new RaidPasswordDoor_1.RaidPasswordDoor(temp_gather, temp_raid, exports.game);
                }
                break;
            case 'MIRO':
                {
                    var temp_raid = ObjectData_1.ALL_OBJECTS[index].raid;
                    exports.raidObjects[temp_gather.id] = new RaidMiroObject_1.RaidMiroObject(temp_gather, temp_raid, exports.game);
                }
                break;
            default:
                {
                    var temp_raid = ObjectData_1.ALL_OBJECTS[index].raid;
                    exports.raidObjects[temp_gather.id] = new RaidObject_1.RaidObject(temp_gather, temp_raid, exports.game);
                    // console.log('defaulted', index);
                }
                break;
        }
        // Sets the newly added raidObject to the Gather map if it doesn't yet exist
        var validated = true;
        if (existing != undefined) {
            if (existing.obj.type == temp_gather.type &&
                existing.obj.width == temp_gather.width &&
                existing.obj.height == temp_gather.height &&
                existing.obj.x == temp_gather.x &&
                existing.obj.y == temp_gather.y &&
                existing.obj.distThreshold == temp_gather.distThreshold &&
                existing.obj.normal == temp_gather.normal &&
                existing.obj.highlighted == temp_gather.highlighted &&
                exports._.isEqual(existing.obj.properties, temp_gather.properties)) {
                validated = false;
            }
        }
        if (validated) {
            (0, exports.throttle_100)(function () {
                exports.game.setObject(exports.raidObjects[temp_gather.id].raid.map_id, exports.raidObjects[temp_gather.id].gather.id, exports.raidObjects[temp_gather.id].gather);
            });
            console.log("".concat(temp_gather.id, " has been added/updated with behavior ").concat(exports.raidObjects[temp_gather.id].raid.behavior));
            // console.log(`Raid Object ${temp_gather.id} has been added/updated with behavior ${raidObjects[temp_gather.id].raid.behavior}`);
        }
        else {
            // console.log(`Raid Object ${temp_gather.id} exists with undetected changes, no generation needed`)
            // console.log(`Raid Object ${temp_gather.id} exists`)
        }
        // Get the key of the newly set object and store it locally
        (0, exports.throttle_100)(function () {
            if (exports.raidObjects[temp_gather.id] != undefined || exports.raidObjects[temp_gather.id].key != undefined) {
                exports.raidObjects[temp_gather.id].key = exports.game.getObject(temp_gather.id).key;
                // console.log(`Raid Object ${temp_gather.id} has been assigned with key: ${raidObjects[temp_gather.id].key}`);
            }
            else if (exports.raidObjects[temp_gather.id] == undefined || exports.raidObjects[temp_gather.id].key == undefined) {
                console.log("Raid Object has not been assigned with key");
            }
        });
    });
    Object.keys(RaidRaceData_1.ALL_RACETRACKS).forEach(function (key, index) {
        console.log(key);
        exports.raidRaceTracks[key] = new RaidRace_1.RaidRace(key, RaidRaceData_1.ALL_RACETRACKS[key].map_id, RaidRaceData_1.ALL_RACETRACKS[key].start_line, RaidRaceData_1.ALL_RACETRACKS[key].end_line, RaidRaceData_1.ALL_RACETRACKS[key].checkpoints, RaidRaceData_1.ALL_RACETRACKS[key].laps);
        Object.keys(RaidRoomData_1.ALL_ROOMS).forEach(function (key, index) {
            exports.raidRooms[key] = new RaidRoom_1.RaidRoom(key, RaidRoomData_1.ALL_ROOMS[key].map_id, RaidRoomData_1.ALL_ROOMS[key].x, RaidRoomData_1.ALL_ROOMS[key].y, RaidRoomData_1.ALL_ROOMS[key].width, RaidRoomData_1.ALL_ROOMS[key].height, RaidRoomData_1.ALL_ROOMS[key].capacity, RaidRoomData_1.ALL_ROOMS[key].timer, RaidRoomData_1.ALL_ROOMS[key].interval, RaidRoomData_1.ALL_ROOMS[key].objects);
        });
        //raid spawn stuff
        Object.keys(RaidSpawnData_1.ALL_SPAWN_ZONES).forEach(function (key, index) {
            console.log('initiating spawn zones...');
            exports.raidSpawnRooms[key] = new RaidSpawnZone_1.RaidSpawnZone(key, RaidSpawnData_1.ALL_SPAWN_ZONES[key].map_id, RaidSpawnData_1.ALL_SPAWN_ZONES[key].spawn_rate, RaidSpawnData_1.ALL_SPAWN_ZONES[key].id_prefix, RaidSpawnData_1.ALL_SPAWN_ZONES[key].id_suffix_counter, RaidSpawnData_1.ALL_SPAWN_ZONES[key].item_max, RaidSpawnData_1.ALL_SPAWN_ZONES[key].items, RaidSpawnData_1.ALL_SPAWN_ZONES[key].zones, exports.game);
        });
        //delete raid spawn stuff
        Object.keys(exports.raidSpawnRooms).forEach(function (key, index) {
            (0, exports.throttle)(function () {
                exports.raidSpawnRooms[key].delete_objects();
            });
        });
        exports.raidRaceMaps.push(RaidRaceData_1.ALL_RACETRACKS[key].map_id);
        exports.raidRaceMapsTemp[RaidRaceData_1.ALL_RACETRACKS[key].map_id] = key;
    });
    Object.keys(RaidTeamMaps_1.ALL_TEAM_MAPS).forEach(function (key, index) {
        exports.raidTeamMaps[key] = {
            count_override: RaidTeamMaps_1.ALL_TEAM_MAPS[key].count_override,
            teams: RaidTeamMaps_1.ALL_TEAM_MAPS[key].teams
        };
    });
    //console.log(raidTeamMaps);
    //console.log(findSmallestTeams('test-team-sort'));
    // throttle(() => {
    //   console.log(`Object generation complete`);
    //   teamSort('main-hall', 'test-team-sort', "sdsdd");
    // });
    // Activate subscriptions
    // raidPlayerTriggers();
    (0, RaidplayerMoves_1.raidPlayerMoves)(exports.game, exports.raidPlayers);
    (0, RaidplayerInteracts_1.raidPlayerInteracts)(exports.game);
    (0, RaidplayerSetsVehicleId_1.raidPlayerSetsVehicleId)(exports.game);
    (0, RaidplayerShootsConfetti_1.raidPlayerShootsConfetti)(exports.game);
    (0, RaidplayerSendsCommand_1.raidPlayerSendsCommand)(exports.game);
    (0, RaidplayerExits_1.raidPlayerExits)(exports.game);
    (0, RaidplayerSetsAffiliation_1.raidPlayerSetsAffiliation)(exports.game);
    (0, RaidplayerSetsEmoteV2_1.raidPlayerSetsEmoteV2)(exports.game);
});
// Waits for game to be connected before executing main
exports.game.waitForInit().then(function (res) {
    console.log("Executing main");
    main();
    (0, raidLib_1.resetCollisions)();
    // Interval for spawn rooms (spawn every 5000 ms)
    // const newEventLoop = setInterval(() => {
    //   Object.keys(raidSpawnRooms).forEach((key, value) => {
    //     raidSpawnRooms[key].spawn();
    //   });
    // }, 5000);
});
// game.subscribeToEvent("spaceSetsSpaceUsers", ( data, context ) => {
//   console.log(data, context);
// });
(0, RaidspaceSetsMembers_1.raidspaceSetsSpaceMembers)(exports.game);
// *** Heroku Online Code (Start) ***
app.listen(port, host, function () {
    console.log("Server started.......");
});
// *** Heroku Online Code (End) **
//# sourceMappingURL=index.js.map