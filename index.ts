require('dotenv').config();

import { Game, WireObject, Player, MapObject, Enter } from "@gathertown/gather-game-client";

global.WebSocket = require("isomorphic-ws");

// Time Tracking Variables
export let team_start_time = 0;
export let team_end_time = 0;
export let team_duration = 0;
export let cumulative_time = 0;

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
import { ALL_OBJECTS } from "./raid_data/ObjectData";
import { ALL_RACETRACKS } from "./raid_data/RaidRaceData";
import { ALL_ROOMS } from "./raid_data/RaidRoomData";
import { ALL_SPAWN_ZONES } from "./raid_data/RaidSpawnData";
import { ALL_TEAM_MAPS } from "./raid_data/RaidTeamMaps";

// Raid Classes imports
import { RaidObject } from "./raid_classes/RaidObject";
import { RaidRace } from "./raid_classes/RaidRace";
import { RaidRoom } from "./raid_classes/RaidRoom"
import { RaidLightsOut } from "./raid_classes/RaidLightsOut";
import { RaidSpawnZone } from "./raid_classes/RaidSpawnZone";

// Raid Sub import
import { raidPlayerMoves } from './raid_subs/RaidplayerMoves';
import { raidPlayerInteracts } from "./raid_subs/RaidplayerInteracts";
import { raidPlayerTriggers } from "./raid_subs/RaidplayerTriggersObject";
import { raidPlayerSetsVehicleId } from "./raid_subs/RaidplayerSetsVehicleId";
import { raidPlayerShootsConfetti } from "./raid_subs/RaidplayerShootsConfetti";
import { raidspaceSetsSpaceMembers } from "./raid_subs/RaidspaceSetsMembers";
import { raidPlayerSendsCommand } from "./raid_subs/RaidplayerSendsCommand";
import { raidSpaceOverwrites } from "./raid_subs/RaidspaceOverwrites";
import { raidPlayerExits } from './raid_subs/RaidplayerExits';
import { raidPlayerSetsAffiliation } from "./raid_subs/RaidplayerSetsAffiliation";
import { raidPlayerSetsEmoteV2 } from "./raid_subs/RaidplayerSetsEmoteV2";

// Raid Objects import
import { SignRaidRoomObject } from "./raid_classes/SignRaidRoomObject";
import { EnterRaidRoomObject } from "./raid_classes/EnterRaidObject";
import { ExitRaidRoomObject } from "./raid_classes/ExitRaidObject";
import { RaidHintObject } from "./raid_classes/RaidHintObject";
import { RaidPasswordDoor } from "./raid_classes/RaidPasswordDoor";
import { findSmallestTeams, teamSort } from "./raid_lib/raidLib";
import { RaidMiroObject } from "./raid_classes/RaidMiroObject";

// Raid Functions import
import { resetCollisions } from './raid_lib/raidLib';

// Global variables for RtR - tracking
export const raidPlayers: { [id: string]: RaidPlayer } = {};
export const raidObjects: { [id: string]: RaidObject } = {};
export const raidPlayersXY: { [id: string]: { x: number, y: number, map_id: string, steps: number } } = {};
export const raidConfetti: { [id: string]: number } = {};
export const raidPlayerOutfit: { [id: string]: {} } = {};

// Support
export const raidEmote: { [id: string]: number } = {};
export const raidHand: { [id: string]: number } = {};

// Racetrack stuff - deprecicated
export const raidRaceTracks: { [track_name: string]: RaidRace } = {}
export const raidRaceMaps = [];
export const raidRaceMapsTemp: { [map_id: string]: string } = {};
export const raidPlayerRaceTimer: { [id: string]: number } = {};

// Raid Room
export const raidRooms: { [id: string]: RaidRoom } = {};

// Raid Spawn Zones
export const raidSpawnRooms: { [id: string]: RaidSpawnZone } = {};

// Raid Space members
export const raidPermissions: { [id: string]: { DEFAULT_MOD: boolean, DEFAULT_BUILDER: boolean, OWNER: boolean } } = {};
export const modOrGreaterUids: string[] = [];
export const owners = new Set;
export const mods = new Set;
export const builders = new Set;

// Raid Teams
export const raidTeamMaps: { [team_group: string]: RaidTeamGroup } = {};
export const raidTeams: { [team_name: string]: { map_id: string, x: number, y: number, players?: string[], max_count?: number } } = {};
// export const raid_ETI_team_start_time: number = 0;

// Raid Exit Tracking
export const raidPlayerSpokeOnExit: { [id: string]: number } = {};
export const raidPlayerTimeSpent: { [id: string]: number } = {};

// Throttle Queue
const throttledQueue = require('throttled-queue');
export const throttle = throttledQueue(1, 50, true);
export const throttle_100 = throttledQueue(1, 100, true);
//export const throttle2 = throttledQueue(1, 50, true);

// Lodash
export const _ = require('lodash');

// Miro REST API and authentication
export const miro_sdk = require('api')('@miro-ea/v2.0#3on7q2wlqcdtj02');
miro_sdk.auth(process.env.MIRO_ACCESS_TOKEN);

// Rate limited cooldown
export const player_cooldown = {
  timer: 1000, // Window of time before cooldown triggers
  counter: 0, // Number of interactions within a timeframe
  max_counter: 1, // Max number of interaction
  cooldown: 250, // Time limit (ms)
  remaining: 0 // Put Date.now() when triggered
};

// *** Heroku Online Code (Start) ***

//Initial setup for POSTing
const express = require("express");
//const axios = require("axios");
const app = express();
// use alternate localhost and the port Heroku assigns to $PORT
const host = '0.0.0.0';
const port = process.env.PORT || 8000;

// *** Heroku Online Code (End) ***

// Creating game instance
export const game = new Game(process.env.URL, () => Promise.resolve({ apiKey: process.env.API_KEY }));
raidSpaceOverwrites(game);
game.connect();
game.subscribeToConnection((connected) => console.log("connected?", connected));

// Main function to be called after game is connected
const main = (() => {
  // Generate an array of raidObjects based off the data from ALL_OBJECTS.ts
  console.log(`Generating objects...`);
  Object.keys(ALL_OBJECTS).forEach((index, key, value) => {
    let temp_gather: MapObject = ALL_OBJECTS[index].gather;
    let existing: any;

    existing = game.getObject(temp_gather.id, ALL_OBJECTS[index].raid.map_id);

    // ADD IN EKE EXISTING OBJECT CODE HERE

    // Adds the object to raidObjects array based on the behavior
    switch (ALL_OBJECTS[index].raid.behavior) {
      case 'LOGIC':
        {
          let temp_raid: RaidLogic = ALL_OBJECTS[index].raid;
          raidObjects[temp_gather.id] = new RaidObject(temp_gather, temp_raid, game);
        }
        break;
      case 'LIGHTSOUT':
        {
          let temp_raid: RaidLightsOutProperties = ALL_OBJECTS[index].raid;
          raidObjects[temp_gather.id] = new RaidLightsOut(temp_gather, temp_raid, game);
        }
        break;
      case 'SIGNUP':
        {
          let temp_raid: RaidLogic = ALL_OBJECTS[index].raid;
          raidObjects[temp_gather.id] = new SignRaidRoomObject(temp_gather, temp_raid, game);
        }
        break;
      case 'ENTER':
        {
          let temp_raid: RaidEnterProperties = ALL_OBJECTS[index].raid;
          raidObjects[temp_gather.id] = new EnterRaidRoomObject(temp_gather, temp_raid, game);
        }
        break;
      case 'EXIT':
        {
          let temp_raid: RaidExitProperties = ALL_OBJECTS[index].raid;
          raidObjects[temp_gather.id] = new ExitRaidRoomObject(temp_gather, temp_raid, game);
        }
        break;
      case 'HINT':
        {
          let temp_raid: RaidHintProperties = ALL_OBJECTS[index].raid;
          raidObjects[temp_gather.id] = new RaidHintObject(temp_gather, temp_raid, game);
        }
        break;
      case 'PASSWORD':
        {
          let temp_raid: RaidPasswordProperties = ALL_OBJECTS[index].raid;
          raidObjects[temp_gather.id] = new RaidPasswordDoor(temp_gather, temp_raid, game);
        }
        break;
      case 'MIRO':
        {
          let temp_raid: RaidMiroProperties = ALL_OBJECTS[index].raid;
          raidObjects[temp_gather.id] = new RaidMiroObject(temp_gather, temp_raid, game);
        }
        break;
      default:
        {
          let temp_raid: RaidProperties = ALL_OBJECTS[index].raid;
          raidObjects[temp_gather.id] = new RaidObject(temp_gather, temp_raid, game);
          // console.log('defaulted', index);
        }
        break;
    }



    // Sets the newly added raidObject to the Gather map if it doesn't yet exist
    let validated = true;
    if (existing != undefined) {
      if (existing.obj.type == temp_gather.type &&
        existing.obj.width == temp_gather.width &&
        existing.obj.height == temp_gather.height &&
        existing.obj.x == temp_gather.x &&
        existing.obj.y == temp_gather.y &&
        existing.obj.distThreshold == temp_gather.distThreshold &&
        existing.obj.normal == temp_gather.normal &&
        existing.obj.highlighted == temp_gather.highlighted &&
        _.isEqual(existing.obj.properties, temp_gather.properties)
      ) {
        validated = false;
      }
    }

    if (validated) {
      throttle_100(() => {
        game.setObject(raidObjects[temp_gather.id].raid.map_id, raidObjects[temp_gather.id].gather.id, raidObjects[temp_gather.id].gather);
      });
      console.log(`${temp_gather.id} has been added/updated with behavior ${raidObjects[temp_gather.id].raid.behavior}`);
      // console.log(`Raid Object ${temp_gather.id} has been added/updated with behavior ${raidObjects[temp_gather.id].raid.behavior}`);
    } else {
      // console.log(`Raid Object ${temp_gather.id} exists with undetected changes, no generation needed`)
      // console.log(`Raid Object ${temp_gather.id} exists`)
    }

    // Get the key of the newly set object and store it locally
    throttle_100(() => {
      if (raidObjects[temp_gather.id] != undefined || raidObjects[temp_gather.id].key != undefined) {
        raidObjects[temp_gather.id].key = game.getObject(temp_gather.id).key;
        // console.log(`Raid Object ${temp_gather.id} has been assigned with key: ${raidObjects[temp_gather.id].key}`);
      }
      else if (raidObjects[temp_gather.id] == undefined || raidObjects[temp_gather.id].key == undefined) {
        console.log(`Raid Object has not been assigned with key`);
      }
    });
  });


  Object.keys(ALL_RACETRACKS).forEach((key, index) => {
    console.log(key);
    raidRaceTracks[key] = new RaidRace(
      key,
      ALL_RACETRACKS[key].map_id,
      ALL_RACETRACKS[key].start_line,
      ALL_RACETRACKS[key].end_line,
      ALL_RACETRACKS[key].checkpoints,
      ALL_RACETRACKS[key].laps
    );

    Object.keys(ALL_ROOMS).forEach((key, index) => {
      raidRooms[key] = new RaidRoom(
        key,
        ALL_ROOMS[key].map_id,
        ALL_ROOMS[key].x,
        ALL_ROOMS[key].y,
        ALL_ROOMS[key].width,
        ALL_ROOMS[key].height,
        ALL_ROOMS[key].capacity,
        ALL_ROOMS[key].timer,
        ALL_ROOMS[key].interval,
        ALL_ROOMS[key].objects
      );
    });

    //raid spawn stuff
    Object.keys(ALL_SPAWN_ZONES).forEach((key, index) => {
      console.log('initiating spawn zones...');

      raidSpawnRooms[key] = new RaidSpawnZone(
        key,
        ALL_SPAWN_ZONES[key].map_id,
        ALL_SPAWN_ZONES[key].spawn_rate,
        ALL_SPAWN_ZONES[key].id_prefix,
        ALL_SPAWN_ZONES[key].id_suffix_counter,
        ALL_SPAWN_ZONES[key].item_max,
        ALL_SPAWN_ZONES[key].items,
        ALL_SPAWN_ZONES[key].zones,
        game
      );
    });

    //delete raid spawn stuff
    Object.keys(raidSpawnRooms).forEach((key, index) => {
      throttle(() => {
        raidSpawnRooms[key].delete_objects();
      });
    });

    raidRaceMaps.push(ALL_RACETRACKS[key].map_id);
    raidRaceMapsTemp[ALL_RACETRACKS[key].map_id] = key;
  });

  Object.keys(ALL_TEAM_MAPS).forEach((key, index) => {
    raidTeamMaps[key] = {
      count_override: ALL_TEAM_MAPS[key].count_override,
      teams: ALL_TEAM_MAPS[key].teams
    }
  });

  //console.log(raidTeamMaps);
  //console.log(findSmallestTeams('test-team-sort'));

  // throttle(() => {
  //   console.log(`Object generation complete`);
  //   teamSort('main-hall', 'test-team-sort', "sdsdd");
  // });

  // Activate subscriptions
  // raidPlayerTriggers();
  raidPlayerMoves(game, raidPlayers);
  raidPlayerInteracts(game);

  raidPlayerSetsVehicleId(game);
  raidPlayerShootsConfetti(game);

  raidPlayerSendsCommand(game);
  raidPlayerExits(game);
  raidPlayerSetsAffiliation(game);
  raidPlayerSetsEmoteV2(game);
});

// Waits for game to be connected before executing main
game.waitForInit().then((res) => {
  console.log(`Executing main`);
  main();
  resetCollisions();

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

raidspaceSetsSpaceMembers(game);

// *** Heroku Online Code (Start) ***

app.listen(port, host, function () {
  console.log("Server started.......");
});

// *** Heroku Online Code (End) **