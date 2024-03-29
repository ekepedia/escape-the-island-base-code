"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.raidspaceSetsSpaceMembers = void 0;
// import { game, raidPermissions, modOrGreaterUids } from '../index.js';
var index_js_1 = require("../index.js");
var raidspaceSetsSpaceMembers = function (game) {
    game.subscribeToEvent("spaceSetsSpaceUsers", function (data, context) {
        Object.keys(data.spaceSetsSpaceUsers.spaceUsers).forEach(function (key, value) {
            index_js_1.raidPermissions[key] = {
                OWNER: data.spaceSetsSpaceUsers.spaceUsers[key].role == 'Owner' ? true : false,
                DEFAULT_MOD: data.spaceSetsSpaceUsers.spaceUsers[key].role == 'Mod' ? true : false,
                DEFAULT_BUILDER: data.spaceSetsSpaceUsers.spaceUsers[key].role == 'Builder' ? true : false
            };
        });
        console.log(index_js_1.raidPermissions);
    });
};
exports.raidspaceSetsSpaceMembers = raidspaceSetsSpaceMembers;
//# sourceMappingURL=RaidspaceSetsMembers.js.map