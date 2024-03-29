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
exports.RaidHintObject = void 0;
// import { game, raidObjects, raidRooms, throttle } from '../index.js';
var index_js_1 = require("../index.js");
var RaidObject_js_1 = require("./RaidObject.js");
var RaidHintObject = /** @class */ (function (_super) {
    __extends(RaidHintObject, _super);
    function RaidHintObject(gather, raid, game) {
        var _this = _super.call(this, gather, raid, game) || this;
        _this.tracker = 0;
        _this.timer = 0;
        return _this;
    }
    RaidHintObject.prototype.interaction = function (player, json_data) {
        var _this = this;
        (0, index_js_1.throttle)(function () {
            console.log("Hint ".concat(_this.gather.id, " has been activated by ").concat(player.name));
            var temp = Date.now();
            if (temp - _this.timer >= _this.raid.timers[_this.tracker]) {
                if (_this.tracker < _this.raid.hints.length) {
                    console.log(_this.raid.hints[_this.tracker]);
                    _this.tracker++;
                    _this.timer = temp;
                }
            }
            else {
                //Comment this line out if you don't want repeating hints
                console.log(_this.raid.hints[_this.tracker - 1]);
                //Time remaining - *FIXED*
                if (_this.tracker == _this.raid.hints.length) {
                    console.log('There are no more hints available.');
                }
                else {
                    var currentTimer = temp - _this.timer;
                    var timeDuration = _this.raid.timers[_this.tracker];
                    console.log(timeDuration - currentTimer, 'ms left until your next hint');
                }
            }
        });
    };
    return RaidHintObject;
}(RaidObject_js_1.RaidObject));
exports.RaidHintObject = RaidHintObject;
//# sourceMappingURL=RaidHintObject.js.map