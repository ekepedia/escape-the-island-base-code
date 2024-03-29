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
exports.RaidTextObject = void 0;
var RaidObject_js_1 = require("./RaidObject.js");
var RaidTextObject = /** @class */ (function (_super) {
    __extends(RaidTextObject, _super);
    function RaidTextObject(gather, raid, game) {
        return _super.call(this, gather, raid, game) || this;
    }
    RaidTextObject.prototype.display = function (time) {
        var _this = this;
        this.game.setObject(this.raid.map_id, this.gather.id, this.gather);
        if (!this.raid.persist)
            setTimeout(function () { _this.removeText(); }, time);
    };
    RaidTextObject.prototype.removeText = function () {
        this.game.deleteObject(this.raid.map_id, this.gather.id);
    };
    RaidTextObject.prototype.changeText = function (new_text, size, font, color) {
        // this.gather.text.text = new_text;
        // if (size != undefined) this.gather.text.size = size;
        // if (font != undefined) this.gather.text.font = font;
        // if (color != undefined) this.gather.text.color = color;
    };
    return RaidTextObject;
}(RaidObject_js_1.RaidObject));
exports.RaidTextObject = RaidTextObject;
//# sourceMappingURL=RaidTextObject.js.map