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
exports.EnterRaidRoomObject = void 0;
var index_js_1 = require("../index.js");
var RaidObject_js_1 = require("./RaidObject.js");
var EnterRaidRoomObject = /** @class */ (function (_super) {
    __extends(EnterRaidRoomObject, _super);
    function EnterRaidRoomObject(gather, raid, game) {
        return _super.call(this, gather, raid, game) || this;
    }
    EnterRaidRoomObject.prototype.interaction = function (player, json_data) {
        var _this = this;
        (0, index_js_1.throttle)(function () {
            if (index_js_1.raidRooms[_this.raid.logic].occupied == false) {
                if (index_js_1.raidRooms[_this.raid.logic].playersWaiting[player.id] != undefined) {
                    Object.keys(index_js_1.raidRooms[_this.raid.logic].playersWaiting).forEach(function (key, index) {
                        console.log("Teleporting ".concat(key, " to ").concat(_this.raid.logic));
                        _this.game.teleport(_this.raid.map, _this.raid.teleport.x, _this.raid.teleport.y, key);
                        var temp = index_js_1.raidRooms[_this.raid.logic].timer / 1000;
                        _this.game.setTextStatus(temp.toString(), key);
                        index_js_1.raidRooms[_this.raid.logic].addPlayer(key, index_js_1.raidRooms[_this.raid.logic].playersWaiting[key]);
                        index_js_1.raidRooms[_this.raid.logic].removePlayerWaiting(key);
                    });
                    index_js_1.raidRooms[_this.raid.logic].occupied = true;
                    _this.setSprite(_this.raid.closed);
                    _this.game.setObject(_this.raid.map_id, _this.raid.logic_three, {
                        "properties": {
                            extensionData: {
                                entries: [
                                    {
                                        type: "header",
                                        value: "Raid Room Instance One Waiting List",
                                        key: "mainHeader1",
                                    },
                                    {
                                        type: "header",
                                        value: "Currently occupied, but you can still join the wait list for the next session.",
                                        key: "mainHeader2",
                                    },
                                    {
                                        type: "radio",
                                        key: "radio_input",
                                        options: [
                                            {
                                                label: "No",
                                                key: "No",
                                            },
                                            {
                                                label: "Yes",
                                                key: "Yes",
                                            },
                                        ],
                                    },
                                ]
                            }
                        }
                    });
                }
                else {
                    console.log('you are not registered');
                }
            }
            else {
                console.log('room is occupied');
            }
        });
        if (index_js_1.raidRooms[this.raid.logic].timer > 0) {
            index_js_1.raidRooms[this.raid.logic].setUp(this.raid.logic_two.map, this.raid.logic_two.x, this.raid.logic_two.y);
        }
    };
    return EnterRaidRoomObject;
}(RaidObject_js_1.RaidObject));
exports.EnterRaidRoomObject = EnterRaidRoomObject;
//# sourceMappingURL=EnterRaidObject.js.map