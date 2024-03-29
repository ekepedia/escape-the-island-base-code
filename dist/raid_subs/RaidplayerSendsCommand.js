"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.raidPlayerSendsCommand = void 0;
// import { game, raidPermissions, modOrGreaterUids } from '../index.js';
var index_js_1 = require("../index.js");
var raidPlayerSendsCommand = function (game) {
    game.subscribeToEvent("playerSendsCommand", function (_a, context) {
        var _b;
        var playerSendsCommand = _a.playerSendsCommand;
        if ((_b = context.playerId) !== null && _b !== void 0 ? _b : "" in index_js_1.modOrGreaterUids) {
            // they can do this command
            try {
                //ParseCommand(context, playerSendsCommand.command);
                console.log('hello mod');
            }
            catch (error) {
                console.error("Failed to parse command: ", error);
            }
        }
        else {
            console.log(context.player.name + " is not a mod");
            game.chat(context.playerId, [], context.player.map, { contents: ' Sorry! You must be a mod to use this command.' + '\n' + '\n' });
        }
        try {
            //ParseCommand(context, playerSendsCommand.command);
            console.log('hello');
        }
        catch (error) {
            console.error("Failed to parse command: ", error);
        }
    });
};
exports.raidPlayerSendsCommand = raidPlayerSendsCommand;
//# sourceMappingURL=RaidplayerSendsCommand.js.map