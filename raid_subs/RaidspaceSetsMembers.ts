// import { game, raidPermissions, modOrGreaterUids } from '../index.js';
import { raidPermissions } from '../index.js';

export const raidspaceSetsSpaceMembers = (game) => {
  game.subscribeToEvent("spaceSetsSpaceUsers", (data, context) => {

    Object.keys(data.spaceSetsSpaceUsers.spaceUsers).forEach((key, value) => {
      raidPermissions[key] = {
        OWNER: data.spaceSetsSpaceUsers.spaceUsers[key].role == 'Owner' ? true : false,
        DEFAULT_MOD: data.spaceSetsSpaceUsers.spaceUsers[key].role == 'Mod' ? true : false,
        DEFAULT_BUILDER: data.spaceSetsSpaceUsers.spaceUsers[key].role == 'Builder' ? true : false
      }
    });

    console.log(raidPermissions);
  });
}