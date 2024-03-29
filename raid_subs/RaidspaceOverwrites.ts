// import { game, mods, owners, builders } from '../index.js';

export const raidSpaceOverwrites = (game) => {
  game.subscribeToEvent('spaceOverwrites', (data, context) => {
    //console.log(JSON.parse(data.spaceOverwrites.spaceData).mods)
    // var members = JSON.parse(data.spaceOverwrites.spaceData).members;
    // for(const uuid in members){
    //     if(members[uuid].roles.OWNER){owners.add(uuid);}
    //     if(members[uuid].roles.DEFAULT_MOD){mods.add(uuid);}
    //     if(members[uuid].roles.DEFAULT_BUILDER){builders.add(uuid);}
    // }
  });
}