"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.raidPlayerMoves = void 0;
var index_js_1 = require("../index.js");
exports.raidPlayerMoves = (function () {
    index_js_1.game.subscribeToEvent("playerMoves", function (data, context) {
        console.log('test');
    });
});
//# sourceMappingURL=RaidplayerMoves.js.map