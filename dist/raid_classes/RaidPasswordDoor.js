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
exports.RaidPasswordDoor = void 0;
var RaidObject_js_1 = require("./RaidObject.js");
var RaidPasswordDoor = /** @class */ (function (_super) {
    __extends(RaidPasswordDoor, _super);
    function RaidPasswordDoor(gather, raid, game) {
        var _this = _super.call(this, gather, raid, game) || this;
        _this.json_entries = gather.properties.extensionData.entries;
        return _this;
    }
    RaidPasswordDoor.prototype.interaction = function (player, json_data) {
        if (!json_data)
            return;
        var parsed_JSON = JSON.parse(json_data);
        this.validate(parsed_JSON, player.id);
    };
    RaidPasswordDoor.prototype.validate = function (parsed_JSON, player_id) {
        var parsed_entries = Object.entries(parsed_JSON);
        var isValidated = true;
        for (var i = 0; i < this.json_entries.length; i++) {
            for (var _i = 0, _a = Object.entries(parsed_JSON); _i < _a.length; _i++) {
                var _b = _a[_i], parsed_key = _b[0], parsed_value = _b[1];
                if (parsed_key == this.json_entries[i].key) {
                    switch (this.json_entries[i].type) {
                        case 'text':
                            if (this.raid.answers[parsed_key] instanceof Array) {
                                if (this.raid.answers[parsed_key].includes(parsed_value.toString())) {
                                    console.log(parsed_key, 'is correct');
                                }
                                else {
                                    console.log(parsed_key, 'is incorrect');
                                    isValidated = false;
                                }
                            }
                            else {
                                console.log('not array');
                                isValidated = false;
                            }
                            break;
                        case 'radio':
                            if (parsed_value.toString() == this.raid.answers[parsed_key].toString()) {
                                console.log(parsed_key, 'is correct');
                            }
                            else {
                                console.log(parsed_key, 'is incorrect');
                                isValidated = false;
                            }
                            break;
                        case 'checkbox':
                            var temp = parsed_value;
                            if (this.isEquals(temp, this.raid.answers[parsed_key])) {
                                console.log(parsed_key, 'is correct');
                            }
                            else {
                                console.log(parsed_key, 'is incorrect');
                                isValidated = false;
                            }
                            break;
                        default:
                            console.log('unknown input');
                            break;
                    }
                }
            }
        }
        isValidated ? this.pass(player_id) : this.failed(player_id);
    };
    RaidPasswordDoor.prototype.pass = function (player_id) {
        console.log('pass validation');
        if (this.raid.actions.pass != undefined) {
            switch (this.raid.actions.pass) {
                case 'TELEPORT':
                    this.teleportPlayer(player_id);
                    break;
                default:
                    console.log('no pass behavior found, check ObjectData.ts');
                    break;
            }
        }
    };
    RaidPasswordDoor.prototype.failed = function (player_id) {
        console.log('fail validation');
        if (this.raid.actions.failed != undefined) {
            switch (this.raid.actions.failed) {
                case 'TELEPORT':
                    this.teleportPlayer(player_id);
                    break;
                default:
                    console.log('no failed behavior found, check ObjectData.ts');
                    break;
            }
        }
    };
    RaidPasswordDoor.prototype.isEquals = function (a, b) {
        if (a === b)
            return true;
        if (a == null || b == null)
            return false;
        if (a.length !== b.length)
            return false;
        var temp_a = a.sort();
        var temp_b = b.sort();
        for (var i = 0; i < temp_a.length; ++i) {
            if (temp_a[i] !== temp_b[i])
                return false;
        }
        return true;
    };
    RaidPasswordDoor.prototype.teleportPlayer = function (player_id) {
        if (this.raid.teleport != undefined) {
            this.game.teleport(this.raid.teleport.map_id, this.raid.teleport.x, this.raid.teleport.y, player_id);
        }
        else {
            console.log('teleport property not found for', this.gather.id);
        }
    };
    return RaidPasswordDoor;
}(RaidObject_js_1.RaidObject));
exports.RaidPasswordDoor = RaidPasswordDoor;
//# sourceMappingURL=RaidPasswordDoor.js.map