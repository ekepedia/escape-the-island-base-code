"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExitRaidRoomObject = void 0;
// import { game, raidObjects, raidRooms, throttle } from '../index.js';
var index_js_1 = require("../index.js"); // remove game import
var RaidObject_js_1 = require("./RaidObject.js");
var ExitRaidRoomObject = /** @class */ (function (_super) {
    __extends(ExitRaidRoomObject, _super);
    function ExitRaidRoomObject(gather, raid, game) {
        return _super.call(this, gather, raid, game) || this; // pass game object to set internal game
    }
    ExitRaidRoomObject.prototype.interaction = function (player, json_data) {
        var _this = this;
        (0, index_js_1.throttle)(function () {
            console.log("Object ".concat(_this.gather.id, " has teleported ").concat(player));
            // Object.keys(raidRooms[this.LOGIC].playersInRoom).forEach((key, index) => {
            //   console.log(`Teleporting ${key}`)
            //   this.game.teleport(this.MAP, this.TELEPORT.x, this.TELEPORT.y, key);
            //   raidRooms[this.LOGIC].removePlayer(key);
            // });
            if (index_js_1.raidRooms[_this.raid.logic].timer > 0) {
                index_js_1.raidRooms[_this.raid.logic].cancel();
            }
            index_js_1.raidRooms[_this.raid.logic].removeAllPlayers(_this.raid.map, _this.raid.teleport.x, _this.raid.teleport.y);
            if (index_js_1.raidRooms[_this.raid.logic].isEmpty()) {
                index_js_1.raidObjects[_this.raid.doors].setSprite(index_js_1.raidObjects[_this.raid.doors].gather.normal);
                index_js_1.raidRooms[_this.raid.logic].occupied = false;
                if (index_js_1.raidRooms[_this.raid.logic].numberOfPlayersWaiting() == 0) {
                    _this.game.setObject(index_js_1.raidObjects[_this.raid.logic_two].raid.map_id, index_js_1.raidObjects[_this.raid.logic_two].gather.id, {
                        'properties': index_js_1.raidObjects[_this.raid.logic_two].gather.properties
                    });
                }
            }
        });
    };
    return ExitRaidRoomObject;
}(RaidObject_js_1.RaidObject));
exports.ExitRaidRoomObject = ExitRaidRoomObject;
//# sourceMappingURL=ExitRaidObject.js.map