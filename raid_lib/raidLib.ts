import { map } from 'lodash';
import { game, raidPlayerOutfit, player_cooldown, raidPlayers, raidPermissions, raidTeams, raidTeamMaps, throttle} from '../index.js';
import { ALL_OBJECTS } from '../raid_data/ObjectData.js';
import { ALL_TEAM_MAPS } from '../raid_data/RaidTeamMaps.js';
import { Game, WireObject, Player, MapObject } from "@gathertown/gather-game-client";
import moment from 'moment';
import axios from 'axios';

// Time Tracking Variables

let team_start_time = 0;
let team_end_time = 0;
let team_duration = 0;
let cumulative_time = 0;

// Tribonds Check Variables
let tribonds_1_check = false;
let tribonds_2_check = false;
let tribonds_3_check = false;
let tribonds_4_check = false;
let tribonds_5_check = false;
let tribonds_end_time = 0;
let tribonds_duration = 0;

// Tiki Torches Check Variables
let tiki_1_check = false;
let tiki_2_check = false;
let tiki_3_check = false;
let tiki_4_check = false;
let tiki_5_check = false;
let tiki_6_check = false;
let tiki_end_time = 0;
let tiki_duration = 0;

// Codebreaker Check Variables
let codebreaker_1_check = false;
let codebreaker_2_check = false;
let codebreaker_3_check = false;
let codebreaker_end_time = 0;
let codebreaker_duration = 0;

// Beach Completion Check Variables
let tribondsCompleted = false;
let tikiCompleted = false;
let codebreakerCompleted = false;
let beachCompleted = false;
let beach_end_time = 0;
let beach_duration = 0;

// Maze Completion Check Variables
let maze_start_time = 0;
let maze_end_time = 0;
let maze_duration = 0;

// Jungle Completion Check Variables
let jungle_start_time = 0;
let jungle_end_time = 0;
let jungle_duration = 0;

// Final Area
let final_area_start_time = 0;
let final_area_end_time = 0;
let final_area_duration = 0;

export const findFrontCoords = (player_id: string) => {
  // Store the coords of the space in front of the player
  let front = {
    x: raidPlayers[player_id].x,
    y: raidPlayers[player_id].y,
    direction: raidPlayers[player_id].direction
  }
  
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
}

export const findFrontPlayer = (player_id: string, map_id: string) => {
  // Check for any players in front of player
  let front = findFrontCoords(player_id);
  let front_player = 'none';

  Object.keys(raidPlayers).forEach((key, index) => {
    // console.log(key, raidPlayers[key].x, raidPlayers[key].y, raidPlayers[key].map_id)
    if (raidPlayers[key].x == front.x && raidPlayers[key].y == front.y && raidPlayers[key].map_id == map_id && key != player_id) {
      front_player = key;
    }
  });

  return front_player;
}

export const checkSameEmojiSpace = (player: Partial<Player>) => {
  let emoji = player.emojiStatus;

  let emoji_same = game.filterPlayersInSpace(e => e.emojiStatus == emoji && e.id != player.id);

  return emoji_same;
}

export const checkSameEmojiFront = (player_id: string, map_id: string) => {
  let front_player = findFrontPlayer(player_id, map_id);

  if (game.getPlayer(front_player).emojiStatus == game.getPlayer(player_id).emojiStatus) return true;

  return false;
}

export const teleportForward = (player_id: string, map_id: string, num_forward: number) => {
  let front = {
    x: raidPlayers[player_id].x,
    y: raidPlayers[player_id].y,
    direction: raidPlayers[player_id].direction
  }
  
  switch (front.direction) {
    case 3:
    case 4:
      front.y-= num_forward;
      break;
    case 7:
    case 8:
      front.x+= num_forward;
      break;
    case 1:
    case 2:
      front.y+= num_forward;
      break;
    case 5:
    case 6:
      front.x-= num_forward;
    case 9:
      console.log("Dancing");
      break;
    default:
      console.log('invalid direction?');
  }

  game.teleport(map_id, front.x, front.y, player_id, front.direction);
}

export const teleportSameEmoji = (player: Partial<Player>) => {
  let player_list = checkSameEmojiSpace(player);

  if (Object.keys(player_list).length > 0) {
    game.teleport(player_list[0].map, player_list[0].x, player_list[0].y, player.id);
    console.log(player.name, 'teleported to another player with the same emoji: ' + player.emojiStatus);
  }
}

// Probably redundant
export const checkMod = (player_id: string) => {
  return raidPermissions[player_id].DEFAULT_MOD;
}

// Raid Team stuff
export const createRandomTeams = (map_id: string, num_players_team: number, emote: string, teamName: string) => {
  let new_players = generatePlayerList(game.getPlayersInMap(map_id), emote);

  let player_count = Object.keys(new_players).length;

  for (let i = 0; i < num_players_team; i++) {
    let random = Math.floor(Math.random() * (player_count - 1));

    game.teleport(raidTeams[teamName].map_id, raidTeams[teamName].x, raidTeams[teamName].y, new_players[random].id);

    new_players = generatePlayerList(game.getPlayersInMap(map_id), emote);
  }
}

export const generatePlayerList = (players: Partial<Player>[], emote: string) => {
  return players.filter((element) => {
    //return (!raidPermissions[element.id].OWNER && !raidPermissions[element.id].DEFAULT_MOD && !(game.getPlayer(element.id).emojiStatus == emote));
    return (!(game.getPlayer(element.id).emojiStatus == emote));
  });
}

// Sort all non-admin and/or 'emote' players on a single map into predefined teams set in RaidTeamMaps.ts
export const teamSort = (map_id: string, team_maps: string, emote: string) => {
  let player_list = generatePlayerList(game.getPlayersInMap(map_id), emote);
  let smallest_teams = findSmallestTeams(team_maps);

  while (player_list.length > 0) {
    let player_count = Object.keys(player_list).length;
    let random = Math.floor(Math.random() * (player_count - 1));

    let small_team_count = Object.keys(smallest_teams).length;
    let small_team_random = Math.floor(Math.random() * small_team_count);

    if (!raidTeamMaps[team_maps].count_override) smallest_teams = filterFullTeams(smallest_teams);

    //raidTeamMaps[team_maps].teams[small_team_random].players.push(player_list[random].id);
    // raidTeamMaps[team_maps].teams[Object.keys(smallest_teams)[small_team_random]];

    //console.log(raidTeamMaps[team_maps].teams)
    //console.log(smallest_teams[small_team_random].map.map_id);

    if (Object.keys(smallest_teams).length <= 0) {
      console.log('all teams full')
    } else {
      let random_team = Object.keys(raidTeamMaps[team_maps].teams).find(key => raidTeamMaps[team_maps].teams[key].map.map_id === smallest_teams[small_team_random].map.map_id); 
      raidTeamMaps[team_maps].teams[random_team].players.push(player_list[random].id);

      throttle(() => {
        game.teleport(raidTeamMaps[team_maps].teams[random_team].map.map_id, raidTeamMaps[team_maps].teams[random_team].map.x, raidTeamMaps[team_maps].teams[random_team].map.y, player_list[random].id);
      })
      
    }

    //console.log(Object.values(raidTeamMaps[team_maps].teams).filter((e) => e.map_id === smallest_teams[small_team_random].map_id));

    //console.log(player_list[random].id);
    

    smallest_teams = findSmallestTeams(team_maps);
    player_list.splice(random, 1);
  }

  Object.values(raidTeamMaps[team_maps].teams).forEach((key, value) => {
    console.log(key);
  })
}

export const findSmallestTeams = (team_maps: string) => {
  if (raidTeamMaps[team_maps] != undefined) {
    let lowest = 9999;
    Object.keys(raidTeamMaps[team_maps].teams).forEach((key, value) => {
      if (raidTeamMaps[team_maps].teams[key].players.length < lowest) lowest = raidTeamMaps[team_maps].teams[key].players.length;
    });

    return Object.values(raidTeamMaps[team_maps].teams).filter((e) => e.players.length === lowest);
  }
}

export const filterFullTeams = (teams: RaidTeam[]) => {
  return Object.values(teams).filter((e) => e.players.length < e.max_count);
}

//Masks a mask for collisions. mask_type is either 0x00 or 0x01
export const generateMask = (width: number, height: number, mask_type: number) => {
  let temp = [];

  for (let i = 0; i < width * height; i++) {
    temp.push(mask_type);
  }

  return Buffer.from(temp).toString("base64");
  // return convertCollisionBytesToBits(temp).toString();
}

export const getCurrentTime = () => {
  return moment().format('MM/DD/YYYY - h:mm:ss a');
}

export const axiosCall = (table_name: string, jsonData: {}) => {
  axios.post('https://rtr-web.herokuapp.com/api/gather-tracker/' + table_name, jsonData).then ((res) => {
    console.log(table_name, + getCurrentTime())
  }).catch ((error) => {
    console.log(error);
  })
}

export const formatDateTime = (timestamp) => {
  // Convert the timestamp to a Date object
  let date = new Date(timestamp);

  let year = date.getFullYear();
  let month = date.getMonth() + 1;  // JavaScript months are 0-based.
  let day = date.getDate();
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let seconds = date.getSeconds();

  // Adding leading zeros for day, month, hours, minutes, and seconds if they are less than 10
  // month = month < 10 ? '0' + month : month;
  // day = day < 10 ? '0' + day : day;
  // hours = hours < 10 ? '0' + hours : hours;
  // minutes = minutes < 10 ? '0' + minutes : minutes;
  // seconds = seconds < 10 ? '0' + seconds : seconds;

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// Return true if cooldown is triggered
export const playerRateLimit = (player: RaidPlayer) => {
  // Return if no cooldown is defined

  if (player.rate_limit.timer == 0) return false;

  // Set trigger to true if max counter has been reached
  if (player.rate_limit.counter == player.rate_limit.max_counter) {
    let temp = player.rate_limit.cooldown - (Date.now() - player.rate_limit.remaining);

    // console.log (`${player.name} is on cooldown (${temp} ms left)`);
    return true;
  }

  // Start cooldown timer if not already
  if (player.rate_limit.counter < player.rate_limit.max_counter) {
    if (player.rate_limit.timeout != undefined) clearTimeout(player.rate_limit.timeout);

    player.rate_limit.timeout = setTimeout(() => {
      player.rate_limit.counter = 0;
      player.rate_limit.timeout = undefined;
      console.log('cooldown ended for', player.name);
    }, player.rate_limit.cooldown);
  }

  player.rate_limit.counter++;
  console.log(`${player.name} counter is at ${player.rate_limit.counter}/${player.rate_limit.max_counter}`);

  if (player.rate_limit.counter == player.rate_limit.max_counter) {
    player.rate_limit.remaining = Date.now();
  }

  return false;
}

export function checkTribondsPuzzle(map_id, playerId, player, object_id) {

  if (object_id === "dropzone_1" && player.itemString.includes("Light")){
    tribonds_1_check = true;
  }
  else if (object_id === "dropzone_1" && !player.itemString.includes("Light")){
    tribonds_1_check = false;
  }

  if (object_id === "dropzone_2" && player.itemString.includes("Yard")){
    tribonds_2_check = true;
  }
  else if (object_id === "dropzone_2" && !player.itemString.includes("Yard")){
    tribonds_2_check = false;
  }

  if (object_id === "dropzone_3" && player.itemString.includes("Bell")){
    tribonds_3_check = true;
  }
  else if (object_id === "dropzone_3" && !player.itemString.includes("Bell")){
    tribonds_3_check = false;
  }

  if (object_id === "dropzone_4" && player.itemString.includes("Drop")){
    tribonds_4_check = true;
  }
  else if (object_id === "dropzone_4" && !player.itemString.includes("Drop")){
    tribonds_4_check = false;
  }

  if (object_id === "dropzone_5" && player.itemString.includes("Paper")){
    tribonds_5_check = true;
  }
  else if (object_id === "dropzone_5" && !player.itemString.includes("Paper")){
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
    && tribondsCompleted === false
    )){

    tribondsCompleted = true;

    throttle(() => {
      game.setObject(map_id, "crystal_ball_clear_2", {  
        normal: "https://s3.amazonaws.com/www.raidtheroom.online/gather-images/gather-image-1706391024635-crystal-ball-green-gray-feet.png",
      })

      // console.log("Tribonds Puzzle Completed")
    })

    throttle(() => {
      game.setObject(map_id, "codebreaker_cover", {  
        normal: "https://s3.amazonaws.com/www.raidtheroom.online/gather-images/gather-image-1706394531767-blank.png",
      })
    })

    let teamArray = [];
    teamArray = game.filterUidsInSpace((player) => player.map == map_id);

    for (let i = 0; i < teamArray.length; i++){
      throttle(() => { 
        game.playSound("https://s3.amazonaws.com/raidtheroom.online/gather/sounds/Win%20-%20588234__mehraniiii__win.wav", 0.25, teamArray[i]);
      })
    }

    if (tribonds_end_time == 0) {
      tribonds_end_time = Date.now();
      console.log("Tribonds End Time: " + tribonds_end_time)

      tribonds_duration = (tribonds_end_time - tiki_end_time)/1000;
      console.log("Tribonds Duration: " + tribonds_duration)
    }

    const newRowRTRDatabase = { 
      'field_1': "Escape the Island 1.5 Input", 
      'player_id': playerId, 
      'display_name': player.name, 
      'object_id': object_id, 
      'space_id': game.spaceId, 
      'map_id': player.map, 
      'player_xy': player.x + ", " + player.y, 
      'timestamp': Date.now(),
      'field_2': "Tribonds Puzzle Completed",
      'field_3': tribonds_duration, 
      "converted_date_time": team_start_time,
      };
    axios.post("https://rtr-web.herokuapp.com/api/gather-tracker/eti-prod-progress", newRowRTRDatabase).then ((res)=>{
      // console.log(res.data);
      console.log("Tribonds Puzzle Completed DB at: " + getCurrentTime())
    }).catch ((error)=>{
      console.log(error);
    })

    throttle(() => {  
      const payload = {
        "text": "📈" + getCurrentTime() + '\n' + "Team: " + "https://app.gather.town/app/" + game.spaceId + '\n' + "PROGRESS: " + "Completed Tribonds in " + parseFloat((tribonds_duration/60).toFixed(2)) + " minutes" + '\n' + '\n'
      }
      axios.post("https://hooks.slack.com/services/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", payload).then ((res)=>{
        // console.log(res.data);
        console.log ("Completed Tribonds Sent to Slack" + getCurrentTime())
      }).catch ((error)=>{
        console.log(error.data);
      })
    });

    checkBeachCompleted(map_id, playerId, player, object_id);

  }

}

export function checkBeachCompleted(map_id, playerId, player, object_id) {

  if (tribondsCompleted === true && tikiCompleted === true && codebreakerCompleted === true && beachCompleted === false) {

  // if (tribondsCompleted === true && tikiCompleted === true) {
    
    beachCompleted = true;
    maze_start_time = Date.now();

    let teamArray = [];
    teamArray = game.filterUidsInSpace((player) => player.map == map_id);

    for (let i = 0; i < teamArray.length; i++){
      throttle(() => { 
        game.playSound("https://s3.amazonaws.com/raidtheroom.online/gather/sounds/room-completed.mp3", 0.25, teamArray[i]);
      })
    } 

    throttle(() => { 
      
      game.setObject("kayF_GdniUHiAXJ6NhLHT", "beach_gate", {
        normal: "https://s3.amazonaws.com/www.raidtheroom.online/gather-images/gather-image-1706394531767-blank.png", // Blank
        highlighted: "https://s3.amazonaws.com/www.raidtheroom.online/gather-images/gather-image-1706394531767-blank.png", // Blank
      }); 
   
      game.setMapCollisions(map_id, 31, 19, 2, 1, generateMask(2, 1, 0x00));
      console.log("Collision removed from the beach gate")
    })

    if (beach_end_time == 0) {
      beach_end_time = Date.now();
      console.log("Beach End Time: " + beach_end_time)

      beach_duration = (beach_end_time - team_start_time)/1000;
      console.log("Beach Duration: " + beach_duration)

      cumulative_time = beach_duration;
    }

    const newRowRTRDatabase = { 
      'field_1': "Escape the Island 1.5 Input", 
      'player_id': playerId, 
      'display_name': player.name, 
      'object_id': object_id, 
      'space_id': game.spaceId, 
      'map_id': player.map, 
      'player_xy': player.x + ", " + player.y, 
      'timestamp': Date.now(),
      'field_2': "Beach Room Completed", 
      // 'field_3': beach_duration,      
      // 'field_4': cumulative_time,
      "converted_date_time": team_start_time,
      };
    axios.post("https://rtr-web.herokuapp.com/api/gather-tracker/eti-test-progress", newRowRTRDatabase).then ((res)=>{
      // console.log(res.data);
      console.log("Beach Room Completed DB at: " + getCurrentTime())
    }).catch ((error)=>{
      console.log(error);
    })

    throttle(() => {  
      const payload = {
        // "text": "📈" + getCurrentTime() + '\n' + "Team: " + "https://app.gather.town/app/" + game.spaceId + '\n' + "PROGRESS: " + "Completed Beach in " + parseFloat((60/60).toFixed(2)) + '\n' + '\n'
        "text": "📈" + getCurrentTime() + '\n' + "Team: " + "https://app.gather.town/app/" + game.spaceId + '\n' + "PROGRESS: " + "Completed Beach in " + parseFloat((beach_duration/60).toFixed(2)) + '\n' + '\n'
      }
      axios.post("https://hooks.slack.com/services/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", payload).then ((res)=>{
        // console.log(res.data);
        console.log ("Completed Beach to Slack" + getCurrentTime())
      }).catch ((error)=>{
        console.log(error.data);
      })
    });

  }
}

export function checkStartGameTimer(map_id, playerId, player, object_id, game_start_timer_input){

  if (team_start_time == 0 && game_start_timer_input == "start") {
    team_start_time = Date.now();
    console.log("Team Session ID: " + team_start_time + " started at " + getCurrentTime())

    let teamArray = [];
    teamArray = game.filterUidsInSpace((player) => player.map == player.map);

    for (let i = 0; i < teamArray.length; i++){
      throttle(() => { 
        game.teleport(player.map, 36, 54, teamArray[i]);
        game.playSound("https://s3.amazonaws.com/raidtheroom.online/gather/sounds/game-start.mp3", 0.25, teamArray[i]);
      })
    }

    const newRowRTRDatabase = { 
      'field_1': "Escape the Island 1.5 Input", 
      'player_id': playerId, 
      'display_name': player.name, 
      'object_id': object_id, 
      'space_id': game.spaceId, 
      'map_id': player.map, 
      'player_xy': player.x + ", " + player.y, 
      'timestamp': Date.now(),
      'field_2': "Game Started", 
      "converted_date_time": team_start_time,
      };
    axios.post("https://rtr-web.herokuapp.com/api/gather-tracker/eti-luan-progress", newRowRTRDatabase).then ((res)=>{
      // console.log(res.data);
      console.log("Game Started at: " + getCurrentTime())
    }).catch ((error)=>{
      console.log(error);
    })

    throttle(() => {  
      const payload = {
        "text": "📈" + getCurrentTime() + '\n' + "Team: " + "https://app.gather.town/app/" + game.spaceId + '\n' + "PROGRESS: " + "Game Started"  + '\n' + '\n'
      }
      axios.post("https://hooks.slack.com/services/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", payload).then ((res)=>{
        // console.log(res.data);
        console.log ("Game Started Sent to Slack" + getCurrentTime())
      }).catch ((error)=>{
        console.log(error.data);
      })
    });

    throttle(() => {
      game.setObject(player.map, object_id, {  
        normal: "https://cdn.gather.town/v0/b/gather-town.appspot.com/o/internal-dashboard-upload%2FOAS5P91MeHHJ9X3x?alt=media&token=5cbaf712-c15f-47ca-9a35-160831d22ffd",
      });

      game.setImpassable(player.map, 37, 54, false);
    });

  }

}

export function interactsFirePit(map_id, playerId, player, object_id){
  
  if (player.itemString.includes("firepit")) {
    throttle(() => {
      game.setItem("", "", playerId);
    })
  }
  else {
    throttle(() => {
      game.setItem("firepit", "https://s3.amazonaws.com/www.raidtheroom.online/gather-images/gather-image-1706394874548-fireball.png", playerId);
      game.playSound("https://s3.amazonaws.com/raidtheroom.online/gather/sounds/lit-match.mp3", 1, playerId);
    })

    const newRowRTRDatabase = { 
      'field_1': "Escape the Island 1.5 Input", 
      'player_id': playerId, 
      'display_name': player.name, 
      'object_id': object_id, 
      'space_id': game.spaceId, 
      'map_id': player.map, 
      'player_xy': player.x + ", " + player.y, 
      'timestamp': Date.now(),
      'field_2': "Fire grabbed by: " + player.name, 
      "converted_date_time": team_start_time,
      };
    axios.post("https://rtr-web.herokuapp.com/api/gather-tracker/eti-prod-input", newRowRTRDatabase).then ((res)=>{
      // console.log(res.data);
      console.log(player.name + " lit " + object_id + " at " + getCurrentTime())
    }).catch ((error)=>{
      console.log(error);
    })
  }
  
}

export function interactsTikiTorch(map_id, playerId, player, object_id){

  throttle(() => {
    game.setObject(player.map, object_id.toString(), {  
      normal: "https://s3.amazonaws.com/www.raidtheroom.online/gather-images/gather-image-1706397124182-small-tikki-torch-lit.png",
    })
  
    game.playSound("https://s3.amazonaws.com/raidtheroom.online/gather/sounds/fire-lit-short.mp3", 0.25, playerId);
  
    const newRowRTRDatabase = { 
      'field_1': "Escape the Island 1.5 Input", 
      'player_id': playerId, 
      'display_name': player.name, 
      'object_id': object_id, 
      'space_id': game.spaceId, 
      'map_id': player.map, 
      'player_xy': player.x + ", " + player.y, 
      'timestamp': Date.now(),
      'field_2': "Tiki Torch Lit: " + object_id, 
      "converted_date_time": team_start_time,
      };
    axios.post("https://rtr-web.herokuapp.com/api/gather-tracker/eti-prod-input", newRowRTRDatabase).then ((res)=>{
      // console.log(res.data);
      console.log(player.name + " lit " + object_id + " at " + getCurrentTime())
    }).catch ((error)=>{
      console.log(error);
    })
  
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
  
    console.log(object_id + " lit")
  })
  
  throttle(() => {
    game.setItem("", "", playerId);
  })
  
  checkTikiPuzzle(player.map, playerId, player, object_id);

}


export function checkTikiPuzzle(map_id, playerId, player, object_id) {

  throttle(() => {

    if ((tiki_1_check === true
        && tiki_2_check === true
        && tiki_3_check === true
        && tiki_4_check === true
        && tiki_5_check === true
        && tiki_6_check === true
        && tikiCompleted === false
      )){

      tikiCompleted = true;

      let crystal_ball_green = "https://s3.amazonaws.com/www.raidtheroom.online/gather-images/gather-image-1706391024635-crystal-ball-green-gray-feet.png";

      throttle(() => {
        game.setObject(map_id, "crystal_ball_clear_1", {  
          normal: crystal_ball_green,
        })
      })

      throttle(() => {
        game.setObject(map_id, "tribonds_cover", {  
          normal: "https://s3.amazonaws.com/www.raidtheroom.online/gather-images/gather-image-1706394531767-blank.png",
        })
      })

      let teamArray = [];
      teamArray = game.filterUidsInSpace((player) => player.map == map_id);

      for (let i = 0; i < teamArray.length; i++){
        throttle(() => { 
          game.playSound("https://s3.amazonaws.com/raidtheroom.online/gather/sounds/Win%20-%20588234__mehraniiii__win.wav", 0.25, teamArray[i]);
        })
      } 

      if (tiki_end_time == 0) {
        tiki_end_time = Date.now();
        console.log("Tiki Torch Puzzle End Time: " + tiki_end_time)

        tiki_duration = (tiki_end_time - team_start_time)/1000;
        console.log("Tiki Torch Puzzle Duration: " + tiki_duration)
      }

      const newRowRTRDatabase = { 
        'field_1': "Escape the Island 1.5 Input", 
        'player_id': playerId, 
        'display_name': player.name, 
        'object_id': object_id, 
        'space_id': game.spaceId, 
        'map_id': player.map, 
        'player_xy': player.x + ", " + player.y, 
        'timestamp': Date.now(),
        'field_2': "Tiki Torch Puzzle Completed", 
        'field_3': tiki_duration,
        "converted_date_time": team_start_time,
        };
      axios.post("https://rtr-web.herokuapp.com/api/gather-tracker/eti-test-progress", newRowRTRDatabase).then ((res)=>{
        // console.log(res.data);
        console.log("Tiki Torch Puzzle Completed DB at: " + getCurrentTime())
      }).catch ((error)=>{
        console.log(error);
      })

      throttle(() => {  
        const payload = {
          "text": "📈" + getCurrentTime() + '\n' + "Team: " + "https://app.gather.town/app/" + game.spaceId + '\n' + "PROGRESS: " + "Completed Tiki Torches in " + parseFloat((tiki_duration/60).toFixed(2)) + " minutes" + '\n' + '\n'
        }
        axios.post("https://hooks.slack.com/services/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", payload).then ((res)=>{
          // console.log(res.data);
          console.log ("Completed Tiki Torches Sent to Slack" + getCurrentTime())
        }).catch ((error)=>{
          console.log(error.data);
        })
      });

      checkBeachCompleted(map_id, playerId, player, object_id);

    }

  });

}

export function checkCodebreaker_1st_Digit(map_id, playerId, player, object_id, codebreaker_submit_1_input) {

  const newRowRTRDatabase = { 
    'field_1': "Escape the Island 1.5 Input", 
    'player_id': playerId, 
    'display_name': player.name, 
    'object_id': object_id, 
    'space_id': game.spaceId, 
    'map_id': player.map, 
    'player_xy': player.x + ", " + player.y, 
    'timestamp': Date.now(),
    'field_2': codebreaker_submit_1_input, 
    "converted_date_time": team_start_time,
    };
  axios.post("https://rtr-web.herokuapp.com/api/gather-tracker/eti-test-input", newRowRTRDatabase).then ((res)=>{
    // console.log(res.data);
    console.log(player.name + " input " + codebreaker_submit_1_input + " on FIRST CB spot at: " + getCurrentTime())
  }).catch ((error)=>{
    console.log(error);
  })

  throttle(() => {
    game.setObject(player.map, object_id.toString(), {
      normal: "https://0ev63k7wu9.execute-api.us-west-2.amazonaws.com/dev/draw-text?text=%20%20" + codebreaker_submit_1_input + "&font=Roboto-Bold.ttf&red=256&green=256&blue=256&size=20", // Text Value
      highlighted: "https://0ev63k7wu9.execute-api.us-west-2.amazonaws.com/dev/draw-text?text=%20%20" + codebreaker_submit_1_input + "&font=Roboto-Bold.ttf&red=256&green=256&blue=256&size=20", // Text Value
    }); 

    game.playSound("https://s3.amazonaws.com/raidtheroom.online/gather/sounds/chalk-short.mp3", 1, playerId);
  });

  if (codebreaker_submit_1_input === "5"){
    codebreaker_1_check = true;
    checkCodebreaker(player.map, playerId, player, object_id);
  }
  else if (codebreaker_submit_1_input != "5"){
    codebreaker_1_check = false;
  }

}

export function checkCodebreaker_2nd_Digit(map_id, playerId, player, object_id, codebreaker_submit_2_input) {
  const newRowRTRDatabase = { 
    'field_1': "Escape the Island 1.5 Input", 
    'player_id': playerId, 
    'display_name': player.name, 
    'object_id': object_id, 
    'space_id': game.spaceId, 
    'map_id': player.map, 
    'player_xy': player.x + ", " + player.y, 
    'timestamp': Date.now(),
    'field_2': codebreaker_submit_2_input, 
    "converted_date_time": team_start_time,
    };
  axios.post("https://rtr-web.herokuapp.com/api/gather-tracker/eti-test-input", newRowRTRDatabase).then ((res)=>{
    // console.log(res.data);
    console.log(player.name + " input " + codebreaker_submit_2_input + " on SECOND CB spot at: " + getCurrentTime())
  }).catch ((error)=>{
    console.log(error);
  })

  throttle(() => {
    game.setObject(player.map, object_id.toString(), {
      normal: "https://0ev63k7wu9.execute-api.us-west-2.amazonaws.com/dev/draw-text?text=%20%20" + codebreaker_submit_2_input + "&font=Roboto-Bold.ttf&red=256&green=256&blue=256&size=20", // Text Value
      highlighted: "https://0ev63k7wu9.execute-api.us-west-2.amazonaws.com/dev/draw-text?text=%20%20" + codebreaker_submit_2_input + "&font=Roboto-Bold.ttf&red=256&green=256&blue=256&size=20", // Text Value
    }); 

    game.playSound("https://s3.amazonaws.com/raidtheroom.online/gather/sounds/chalk-short.mp3", 1, playerId);

  });

  if (codebreaker_submit_2_input === "2"){
    codebreaker_2_check = true;
    checkCodebreaker(player.map, playerId, player, object_id);
  }
  else if (codebreaker_submit_2_input != "2"){
    codebreaker_2_check = false;
  }
}

export function checkCodebreaker_3rd_Digit(map_id, playerId, player, object_id, codebreaker_submit_3_input) {

  const newRowRTRDatabase = { 
    'field_1': "Escape the Island 1.5 Input", 
    'player_id': playerId, 
    'display_name': player.name, 
    'object_id': object_id, 
    'space_id': game.spaceId, 
    'map_id': player.map, 
    'player_xy': player.x + ", " + player.y, 
    'timestamp': Date.now(),
    'field_2': codebreaker_submit_3_input, 
    "converted_date_time": team_start_time,
    };
  axios.post("https://rtr-web.herokuapp.com/api/gather-tracker/eti-test-input", newRowRTRDatabase).then ((res)=>{
    // console.log(res.data);
    console.log(player.name + " input " + codebreaker_submit_3_input + " on THIRD CB spot at: " + getCurrentTime())
  }).catch ((error)=>{
    console.log(error);
  })
  
  throttle(() => {
    game.setObject(player.map, object_id.toString(), {
      normal: "https://0ev63k7wu9.execute-api.us-west-2.amazonaws.com/dev/draw-text?text=%20%20" + codebreaker_submit_3_input + "&font=Roboto-Bold.ttf&red=256&green=256&blue=256&size=20", // Text Value
      highlighted: "https://0ev63k7wu9.execute-api.us-west-2.amazonaws.com/dev/draw-text?text=%20%20" + codebreaker_submit_3_input + "&font=Roboto-Bold.ttf&red=256&green=256&blue=256&size=20", // Text Value
    }); 
  
    game.playSound("https://s3.amazonaws.com/raidtheroom.online/gather/sounds/chalk-short.mp3", 1, playerId);
  });
  
  if (codebreaker_submit_3_input === "8"){
    codebreaker_3_check = true;
    checkCodebreaker(player.map, playerId, player, object_id);
  }
  else if (codebreaker_submit_3_input != "8"){
    codebreaker_3_check = false;
  }

}

export function checkCodebreaker(map_id, playerId, player, object_id) {
  throttle(() => {

    if ((codebreaker_1_check === true
      && codebreaker_2_check === true
      && codebreaker_3_check === true
      && codebreakerCompleted === false
      )){

      codebreakerCompleted = true;

      let crystal_ball_green = "https://s3.amazonaws.com/www.raidtheroom.online/gather-images/gather-image-1706391024635-crystal-ball-green-gray-feet.png";

      throttle(() => {
        game.setObject(map_id, "crystal_ball_clear_3", {  
          normal: crystal_ball_green,
        })

        console.log("Codebreaker Puzzle Completed")
        console.log(codebreaker_1_check);
        console.log(codebreaker_2_check);
        console.log(codebreaker_3_check);

      })

      let teamArray = [];
      teamArray = game.filterUidsInSpace((player) => player.map == map_id);

      for (let i = 0; i < teamArray.length; i++){
        throttle(() => { 
          game.playSound("https://s3.amazonaws.com/raidtheroom.online/gather/sounds/Win%20-%20588234__mehraniiii__win.wav", 0.25, teamArray[i]);
        })
      }

      if (codebreaker_end_time == 0) {
        codebreaker_end_time = Date.now();
        console.log("Codebreaker End Time: " + codebreaker_end_time)

        codebreaker_duration = (codebreaker_end_time - tribonds_end_time)/1000;
        console.log("Codebreaker Duration: " + codebreaker_duration)
      }

      const newRowRTRDatabase = { 
        'field_1': "Escape the Island 1.5 Input", 
        'player_id': playerId, 
        'display_name': player.name, 
        'object_id': object_id, 
        'space_id': game.spaceId, 
        'map_id': player.map, 
        'player_xy': player.x + ", " + player.y, 
        'timestamp': Date.now(),
        'field_2': "Codebreaker Puzzle Completed", 
        'field_3': codebreaker_duration,
        "converted_date_time": team_start_time,
        };
      axios.post("https://rtr-web.herokuapp.com/api/gather-tracker/eti-test-progress", newRowRTRDatabase).then ((res)=>{
        // console.log(res.data);
        console.log("Codebreak Puzzle Completed DB at: " + getCurrentTime())
      }).catch ((error)=>{
        console.log(error);
      })

      throttle(() => {  
        const payload = {
          "text": "📈" + getCurrentTime() + '\n' + "Team: " + "https://app.gather.town/app/" + game.spaceId + '\n' + "PROGRESS: " + "Completed Codebreaker in " + parseFloat((codebreaker_duration/60).toFixed(2)) + " minutes"  + '\n' + '\n'
        }
        axios.post("https://hooks.slack.com/services/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", payload).then ((res)=>{
          // console.log(res.data);
          console.log ("Completed Codebreaker Sent to Slack" + getCurrentTime())
        }).catch ((error)=>{
          console.log(error.data);
        })
      });

      checkBeachCompleted(map_id, playerId, player, object_id);

    }

  });
}

export function resetCollisions(){

  // Reset Beach Gate Collisions
  throttle(() => {
    game.setImpassable("kayF_GdniUHiAXJ6NhLHT", 37, 54, true);
    game.setMapCollisions("kayF_GdniUHiAXJ6NhLHT", 31, 19, 2, 1, generateMask(2, 1, 0x01));
  });
  console.log("Collisions reset at the beach gate")

  // Reset Maze Collisions
  throttle(() => {
    // game.setMapCollisions("7bY0bQ5t5-M_yaLoZf-OA", 42, 23, 1, 5, generateMask(1, 5, 0x01));
    game.setImpassable("7bY0bQ5t5-M_yaLoZf-OA", ALL_OBJECTS.lockbox_red.gather.x, ALL_OBJECTS.lockbox_red.gather.y, true);
    game.setImpassable("7bY0bQ5t5-M_yaLoZf-OA", ALL_OBJECTS.lockbox_yellow.gather.x, ALL_OBJECTS.lockbox_yellow.gather.y, true);
    game.setImpassable("7bY0bQ5t5-M_yaLoZf-OA", ALL_OBJECTS.lockbox_orange.gather.x, ALL_OBJECTS.lockbox_orange.gather.y, true);
    game.setImpassable("7bY0bQ5t5-M_yaLoZf-OA", ALL_OBJECTS.lockbox_blue.gather.x, ALL_OBJECTS.lockbox_blue.gather.y, true);
    game.setImpassable("7bY0bQ5t5-M_yaLoZf-OA", ALL_OBJECTS.lockbox_purple.gather.x, ALL_OBJECTS.lockbox_purple.gather.y, true);
  });

  // Reset Jungle Collisions
  throttle(() => {
    game.setMapCollisions("4S6s6mZv9wsUtmTjV34Eg", 35, 35, 2, 2, generateMask(2, 2, 0x01));
  });
}

export function postGrabKey(map_id, playerId, player, object_id){
  const newRowRTRDatabase = { 
    'field_1': "Escape the Island 1.5 Input", 
    'player_id': playerId, 
    'display_name': player.name, 
    'object_id': object_id, 
    'space_id': game.spaceId, 
    'map_id': player.map, 
    'player_xy': player.x + ", " + player.y, 
    'timestamp': Date.now(),
    'field_2': "Key grabbed by: " + player.name, 
    "converted_date_time": team_start_time,
    };
  axios.post("https://rtr-web.herokuapp.com/api/gather-tracker/eti-test-input", newRowRTRDatabase).then ((res)=>{
    // console.log(res.data);
    console.log(player.name + " grabbed " + object_id + " at " + getCurrentTime())
  }).catch ((error)=>{
    console.log(error);
  })
}

export function postMazeCompleted(map_id, playerId, player, object_id){
  if (maze_end_time == 0) {
    maze_end_time = Date.now();
    console.log("Maze End Time: " + maze_end_time)

    maze_duration = (maze_end_time - maze_start_time)/1000;
    console.log("Maze Duration: " + maze_duration)

    cumulative_time = (maze_end_time - team_start_time)/1000;

    jungle_start_time = Date.now();
  }

  const newRowRTRDatabase = { 
    'field_1': "Escape the Island 1.5 Input", 
    'player_id': playerId, 
    'display_name': player.name, 
    'object_id': object_id, 
    'space_id': game.spaceId, 
    'map_id': player.map, 
    'player_xy': player.x + ", " + player.y, 
    'timestamp': Date.now(),
    'field_2': "Maze Room Completed", 
    'field_3': maze_duration,      
    'field_4': cumulative_time,
    "converted_date_time": team_start_time,
    };
  axios.post("https://rtr-web.herokuapp.com/api/gather-tracker/eti-test-progress", newRowRTRDatabase).then ((res)=>{
    // console.log(res.data);
    console.log("Maze Room Completed DB at: " + getCurrentTime())
  }).catch ((error)=>{
    console.log(error);
  })

  throttle(() => {  
    const payload = {
      "text": "📈" + getCurrentTime() + '\n' + "Team: " + "https://app.gather.town/app/" + game.spaceId + '\n' + "PROGRESS: " + "Completed Maze in " + parseFloat((maze_duration/60).toFixed(2)) + " minutes"  + '\n' + '\n'
    }
    axios.post("https://hooks.slack.com/services/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", payload).then ((res)=>{
      // console.log(res.data);
      console.log ("Completed Maze Sent to Slack" + getCurrentTime())
    }).catch ((error)=>{
      console.log(error.data);
    })
  });
}

export function postLockboxUnlocked(map_id, playerId, player, object_id){
  const newRowRTRDatabase = { 
    'field_1': "Escape the Island 1.5 Input", 
    'player_id': playerId, 
    'display_name': player.name, 
    'object_id': object_id, 
    'space_id': game.spaceId, 
    'map_id': player.map, 
    'player_xy': player.x + ", " + player.y, 
    'timestamp': Date.now(),
    'field_2': "Lockbox unlocked by: " + player.name, 
    "converted_date_time": team_start_time,
    };
  axios.post("https://rtr-web.herokuapp.com/api/gather-tracker/eti-test-input", newRowRTRDatabase).then ((res)=>{
    // console.log(res.data);
    console.log(player.name + " interacted with " + object_id + " at " + getCurrentTime())
  }).catch ((error)=>{
    console.log(error);
  })
}

export function useMagicCircle(map_id, playerId, player, object_id, magic_circle_input) {

  const newRowRTRDatabase = { 
    'field_1': "Escape the Island 1.5 Input", 
    'player_id': playerId, 
    'display_name': player.name, 
    'object_id': object_id, 
    'space_id': game.spaceId, 
    'map_id': player.map, 
    'player_xy': player.x + ", " + player.y, 
    'timestamp': Date.now(),
    'field_2': magic_circle_input, 
    "converted_date_time": team_start_time,
    };
  axios.post("https://rtr-web.herokuapp.com/api/gather-tracker/eti-test-input", newRowRTRDatabase).then ((res)=>{
    // console.log(res.data);
    console.log(player.name + " input " + magic_circle_input + " on Magic Circle at: " + getCurrentTime())
  }).catch ((error)=>{
    console.log(error);
  })
  
  throttle(() => {
    game.playSound("https://s3.amazonaws.com/raidtheroom.online/gather/sounds/magic-missile.mp3", 0.25, playerId);
  });
  
  if (raidPlayerOutfit[playerId] == undefined) {
    raidPlayerOutfit[playerId] = player.currentlyEquippedWearables;
  } 
  
  if (magic_circle_input === "sheep"){
    game.setCurrentlyEquippedWearables(
      {
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
      }, playerId
    );
  }
  
  if (magic_circle_input === "chicken"){
    game.setCurrentlyEquippedWearables(
      {
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
      }, playerId
    );
  }
  
  if (magic_circle_input === "frog"){
    game.setCurrentlyEquippedWearables(
      {
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
      }, playerId
    );
  }
  
  if (magic_circle_input === "mouse"){
    game.setCurrentlyEquippedWearables(
      {
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
      }, playerId
    );
  }
  
  if (magic_circle_input === "human"){
    game.setCurrentlyEquippedWearables(
      {
        "skin": Object.values(raidPlayerOutfit[playerId])[0].toString(),
        "hair": Object.values(raidPlayerOutfit[playerId])[1].toString(),
        "facial_hair": Object.values(raidPlayerOutfit[playerId])[2].toString(),
        "top": Object.values(raidPlayerOutfit[playerId])[3].toString(),
        "bottom": Object.values(raidPlayerOutfit[playerId])[4].toString(),
        "shoes": Object.values(raidPlayerOutfit[playerId])[5].toString(),
        "hat": Object.values(raidPlayerOutfit[playerId])[6].toString(),
        "glasses": Object.values(raidPlayerOutfit[playerId])[7].toString(),
        "other": Object.values(raidPlayerOutfit[playerId])[8].toString(),
        "costume": Object.values(raidPlayerOutfit[playerId])[9].toString(),
        "mobility": Object.values(raidPlayerOutfit[playerId])[10].toString(),
        "jacket": Object.values(raidPlayerOutfit[playerId])[11].toString()
      }, playerId
    );
  }
  
}

export function checkOldManText(map_id, playerId, player, object_id, old_man_text_input) {

  const newRowRTRDatabase = { 
    'field_1': "Escape the Island 1.5 Input", 
    'player_id': playerId, 
    'display_name': player.name, 
    'object_id': object_id, 
    'space_id': game.spaceId, 
    'map_id': player.map, 
    'player_xy': player.x + ", " + player.y, 
    'timestamp': Date.now(),
    'field_2': old_man_text_input, 
    "converted_date_time": team_start_time,
    };
  axios.post("https://rtr-web.herokuapp.com/api/gather-tracker/eti-test-input", newRowRTRDatabase).then ((res)=>{
    // console.log(res.data);
    console.log(player.name + " input " + old_man_text_input + " on Old Man at: " + getCurrentTime())
  }).catch ((error)=>{
    console.log(error);
  })
  
  if (old_man_text_input === "check"){
  
    let sheep_1 = game.getObject("sheep_drop_1", player.map).obj.normal
    let sheep_2 = game.getObject("sheep_drop_2", player.map).obj.normal
    let chicken_1 = game.getObject("chicken_drop_1", player.map).obj.normal
    let chicken_2 = game.getObject("chicken_drop_2", player.map).obj.normal
    let frog_1 = game.getObject("frog_drop_1", player.map).obj.normal
    let frog_2 = game.getObject("frog_drop_2", player.map).obj.normal
    let mouse_1 = game.getObject("mouse_drop_1", player.map).obj.normal
    let mouse_2 = game.getObject("mouse_drop_2", player.map).obj.normal
  
    let strawberry = "https://s3.amazonaws.com/www.raidtheroom.online/gather-images/gather-image-1706549559584-strawberry.png"
    let coconut = "https://s3.amazonaws.com/www.raidtheroom.online/gather-images/gather-image-1706549559459-coconut.png"
  
    let apple = "https://s3.amazonaws.com/www.raidtheroom.online/gather-images/gather-image-1706549559454-apple_red_leaf_2.png"
    let beet = "https://s3.amazonaws.com/www.raidtheroom.online/gather-images/gather-image-1706549559472-Beet_2%2032x32-Aseprite.png"
  
    let orange = "https://s3.amazonaws.com/www.raidtheroom.online/gather-images/gather-image-1706549559557-Orange_2%2032x32%20-%20Aseprite.png"
    let acorn = "https://s3.amazonaws.com/www.raidtheroom.online/gather-images/gather-image-1706549559419-Acorn_2%2032x32-Aseprite.png"
  
    let banana = "https://s3.amazonaws.com/www.raidtheroom.online/gather-images/gather-image-1706549559457-banana.png"
    let grapes = "https://s3.amazonaws.com/www.raidtheroom.online/gather-images/gather-image-1706549559470-Grapes_2%2032x32%20-%20Aseprite.png"
    
    if (
      ((sheep_1 == strawberry && sheep_2 == coconut) || (sheep_1 == coconut && sheep_2 == strawberry))
      &&
      ((chicken_1 == apple && chicken_2 == beet) || (chicken_1 == beet && chicken_2 == apple))
      &&
      ((frog_1 == orange && frog_2 == acorn) || (frog_1 == acorn && frog_2 == orange))
      &&
      ((mouse_1 == banana && mouse_2 == grapes) || (mouse_1 == grapes && mouse_2 == banana))
    ){
      // Final Submission is correct
      
      final_area_start_time = Date.now();
  
      let teamArray = [];
      teamArray = game.filterUidsInSpace((player) => player.map == player.map);
  
      for (let i = 0; i < teamArray.length; i++){
        throttle(() => { 
          game.playSound("https://s3.amazonaws.com/raidtheroom.online/gather/sounds/room-completed.mp3", 0.25, teamArray[i]);
        })
  
  
        if (raidPlayerOutfit[teamArray[i]] != undefined) {
  
          throttle(() => {
          
            let skin = Object.values(raidPlayerOutfit[teamArray[i]])[0].toString()
            let hair = Object.values(raidPlayerOutfit[teamArray[i]])[1].toString()
            let facial_hair = Object.values(raidPlayerOutfit[teamArray[i]])[2].toString()
            let top = Object.values(raidPlayerOutfit[teamArray[i]])[3].toString()
            let bottom = Object.values(raidPlayerOutfit[teamArray[i]])[4].toString()
            let shoes = Object.values(raidPlayerOutfit[teamArray[i]])[5].toString() 
            let hat = Object.values(raidPlayerOutfit[teamArray[i]])[6].toString()
            let glasses = Object.values(raidPlayerOutfit[teamArray[i]])[7].toString()
            let other = Object.values(raidPlayerOutfit[teamArray[i]])[8].toString()
            let costume = Object.values(raidPlayerOutfit[teamArray[i]])[9].toString()
            let mobility = Object.values(raidPlayerOutfit[teamArray[i]])[10].toString()
            let jacket = Object.values(raidPlayerOutfit[teamArray[i]])[11].toString()
  
            game.setCurrentlyEquippedWearables(
              {
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
              }, teamArray[i]
            );
          })
  
        }
  
        
  
        throttle(() => {
          game.setItem("", "", teamArray[i]);
        })
  
      } 
  
      throttle(() => { 
        
        game.setObject(player.map, "rock_gate", {
          normal: "https://s3.amazonaws.com/www.raidtheroom.online/gather-images/gather-image-1706394531767-blank.png", // Blank
          highlighted: "https://s3.amazonaws.com/www.raidtheroom.online/gather-images/gather-image-1706394531767-blank.png", // Blank
        }); 
    
        game.setMapCollisions(player.map, 35, 35, 2, 2, generateMask(2, 2, 0x00));
        console.log("Collision removed from the rock gate")
      })
  
      if (jungle_end_time == 0) {
        jungle_end_time = Date.now();
        team_end_time = jungle_end_time;
        
        console.log("Jungle End Time: " + jungle_end_time)
  
        jungle_duration = (jungle_end_time - jungle_start_time)/1000;
        console.log("Jungle Duration: " + jungle_duration)
        
        cumulative_time = jungle_end_time - team_start_time;
        team_duration = (cumulative_time)/1000;
      }
  
      const newRowRTRDatabase = { 
        'field_1': "Escape the Island 1.5 Input", 
        'player_id': playerId, 
        'display_name': player.name, 
        'object_id': object_id, 
        'space_id': game.spaceId, 
        'map_id': player.map, 
        'player_xy': player.x + ", " + player.y, 
        'timestamp': Date.now(),
        'field_2': "Jungle Room Completed", 
        'field_3': jungle_duration,      
        'field_4': cumulative_time,
        'field_5': "Final Submission is correct",
        "converted_date_time": team_start_time,
        };
      axios.post("https://rtr-web.herokuapp.com/api/gather-tracker/eti-test-progress", newRowRTRDatabase).then ((res)=>{
        // console.log(res.data);
        console.log("Jungle Room Completed DB at: " + getCurrentTime())
      }).catch ((error)=>{
        console.log(error);
      })
  
      throttle(() => {  
        const payload = {
          "text": "📈" + getCurrentTime() + '\n' + "Team: " + "https://app.gather.town/app/" + game.spaceId + '\n' + "PROGRESS: " + "Completed Jungle in " + parseFloat((jungle_duration/60).toFixed(2)) + '\n' + '\n'
        }
        axios.post("https://hooks.slack.com/services/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", payload).then ((res)=>{
          // console.log(res.data);
          console.log ("Completed Jungle to Slack " + getCurrentTime())
        }).catch ((error)=>{
          console.log(error.data);
        })
      });
  
      throttle(() => {  
        const payload = {
          "text": "📈" + getCurrentTime() + '\n' + "Team: " + "https://app.gather.town/app/" + game.spaceId + '\n' + "PROGRESS: " + "Completed Game in " + parseFloat((team_duration/60).toFixed(2)) + '\n' + '\n'
        }
        axios.post("https://hooks.slack.com/services/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", payload).then ((res)=>{
          // console.log(res.data);
          console.log ("Completed Game to Slack " + getCurrentTime())
        }).catch ((error)=>{
          console.log(error.data);
        })
      });
  
    }
    else {
      let teamArray = [];
      teamArray = game.filterUidsInSpace((player) => player.map == player.map);
  
      for (let i = 0; i < teamArray.length; i++){
        throttle(() => { 
          game.playSound("https://s3.amazonaws.com/raidtheroom.online/gather/sounds/wrong-buzzer.mp3", 0.25, teamArray[i]);
        })
      }
      throttle(() => {
        game.chat("ROOM_CHAT", [], player.map, { contents: "Nice try, " + player.name + "! Unfortunately, my animals are not happy with your offerings." + '\n' + '\n'});
      });
    }
  }

}