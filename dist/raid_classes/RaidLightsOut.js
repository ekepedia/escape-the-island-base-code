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
exports.RaidLightsOut = void 0;
var index_js_1 = require("../index.js");
var RaidObject_js_1 = require("./RaidObject.js");
var RaidLightsOut = /** @class */ (function (_super) {
    __extends(RaidLightsOut, _super);
    function RaidLightsOut(gather, raid, game) {
        var _this = _super.call(this, gather, raid, game) || this;
        _this.activated = false;
        return _this;
    }
    RaidLightsOut.prototype.interaction = function (player, json_data) {
        console.log('Lights out called', this.gather.id);
        this.flip();
        for (var i = 0; i < this.raid.linked.length; i++) {
            index_js_1.raidObjects[this.raid.linked[i]].flip();
        }
        var solved = true;
        for (var i = 0; i < this.raid.group.length; i++) {
            if (!index_js_1.raidObjects[this.raid.group[i]].activated)
                solved = false;
        }
        if (solved) {
            console.log('You win', player.name, '!');
        }
    };
    RaidLightsOut.prototype.flip = function () {
        if (this.gather.normal == this.raid.state.off) {
            this.gather.normal = this.raid.state.on;
            this.gather.highlighted = this.raid.state.on;
            this.activated = true;
        }
        else {
            this.gather.normal = this.raid.state.off;
            this.gather.highlighted = this.raid.state.off;
            this.activated = false;
        }
        this.game.setObject(this.raid.map_id, this.gather.id, this.gather);
    };
    return RaidLightsOut;
}(RaidObject_js_1.RaidObject));
exports.RaidLightsOut = RaidLightsOut;
//# sourceMappingURL=RaidLightsOut.js.map