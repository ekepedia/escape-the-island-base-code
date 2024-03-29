"use strict";
// import { game, mods, owners, builders } from '../index.js';
Object.defineProperty(exports, "__esModule", { value: true });
exports.raidSpaceOverwrites = void 0;
var raidSpaceOverwrites = function (game) {
    game.subscribeToEvent('spaceOverwrites', function (data, context) {
        //console.log(JSON.parse(data.spaceOverwrites.spaceData).mods)
        // var members = JSON.parse(data.spaceOverwrites.spaceData).members;
        // for(const uuid in members){
        //     if(members[uuid].roles.OWNER){owners.add(uuid);}
        //     if(members[uuid].roles.DEFAULT_MOD){mods.add(uuid);}
        //     if(members[uuid].roles.DEFAULT_BUILDER){builders.add(uuid);}
        // }
    });
};
exports.raidSpaceOverwrites = raidSpaceOverwrites;
//# sourceMappingURL=RaidspaceOverwrites.js.map