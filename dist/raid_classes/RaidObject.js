"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RaidObject = void 0;
// import { game, raidObjects } from '../index.js'; // remove game import
var RaidObject = /** @class */ (function () {
    function RaidObject(gather, raid, game) {
        this.gather = gather;
        this.raid = raid;
        this.game = game; // set internal game
    }
    RaidObject.prototype.interaction = function (player, json_data) {
        console.log("base class called for interaction");
    };
    RaidObject.prototype.flip = function () {
        throw new Error("Method not implemented.");
    };
    RaidObject.prototype.setSprite = function (normal) {
        this.game.setObject(this.raid.map_id, this.gather.id, {
            normal: normal,
            highlighted: normal
        });
    };
    return RaidObject;
}());
exports.RaidObject = RaidObject;
//# sourceMappingURL=RaidObject.js.map