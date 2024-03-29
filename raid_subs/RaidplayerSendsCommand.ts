// import { game, raidPermissions, modOrGreaterUids } from '../index.js';
import { modOrGreaterUids } from '../index.js';

export const raidPlayerSendsCommand = (game) => {
  game.subscribeToEvent("playerSendsCommand", ({ playerSendsCommand }, context) => {
    if (context.playerId ?? "" in modOrGreaterUids) {
      // they can do this command
      try {
        //ParseCommand(context, playerSendsCommand.command);
        console.log('hello mod');
      } catch (error) {
        console.error("Failed to parse command: ", error);
      }
    }
    else {
      console.log(context.player.name + " is not a mod")
      game.chat(context.playerId, [], context.player.map, { contents: ' Sorry! You must be a mod to use this command.' + '\n' + '\n' });
    }

    try {
      //ParseCommand(context, playerSendsCommand.command);
      console.log('hello');
    } catch (error) {
      console.error("Failed to parse command: ", error);
    }

  });
}