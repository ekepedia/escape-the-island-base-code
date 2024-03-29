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
exports.SignRaidRoomObject = void 0;
var index_js_1 = require("../index.js");
var RaidObject_js_1 = require("./RaidObject.js");
var SignRaidRoomObject = /** @class */ (function (_super) {
    __extends(SignRaidRoomObject, _super);
    function SignRaidRoomObject(gather, raid, game) {
        return _super.call(this, gather, raid, game) || this;
    }
    SignRaidRoomObject.prototype.interaction = function (player, json_data) {
        var _this = this;
        (0, index_js_1.throttle)(function () {
            if (!json_data)
                return;
            var parsed_JSON = JSON.parse(json_data);
            var sign_in = parsed_JSON.radio_input;
            console.log('json parsed');
            if (index_js_1.raidRooms[_this.raid.logic].isWaitingFull() == false && sign_in == "Yes") {
                console.log('user signed in');
                if (index_js_1.raidRooms[_this.raid.logic].playersWaiting[player.id] == undefined) {
                    index_js_1.raidRooms[_this.raid.logic].addPlayerWaiting(player.id, player.name);
                    _this.game.chat(player.id, [], player.map, { contents: "".concat(player.name, " has signed up for ").concat(_this.raid.logic) });
                    var temp_1 = '';
                    if (index_js_1.raidRooms[_this.raid.logic].numberOfPlayersWaiting() > 0) {
                        Object.keys(index_js_1.raidRooms[_this.raid.logic].playersWaiting).forEach(function (key, index) {
                            temp_1 += index_js_1.raidRooms[_this.raid.logic].playersWaiting[key] + '\n';
                        });
                    }
                    _this.game.setObject(_this.raid.map_id, _this.gather.id, {
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
                                        value: temp_1,
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
                    console.log('you are already registered');
                }
            }
            else {
                console.log("".concat(_this.raid.logic, " is full!"));
            }
        });
    };
    return SignRaidRoomObject;
}(RaidObject_js_1.RaidObject));
exports.SignRaidRoomObject = SignRaidRoomObject;
//# sourceMappingURL=SignRaidRoomObject.js.map