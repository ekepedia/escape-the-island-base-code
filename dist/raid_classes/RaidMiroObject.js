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
exports.RaidMiroObject = void 0;
var index_js_1 = require("../index.js");
var RaidObject_js_1 = require("./RaidObject.js");
var RaidMiroObject = /** @class */ (function (_super) {
    __extends(RaidMiroObject, _super);
    function RaidMiroObject(gather, raid, game) {
        var _this = _super.call(this, gather, raid, game) || this;
        _this.temp = [];
        _this.storeItems();
        return _this;
    }
    RaidMiroObject.prototype.interaction = function (player, json_data) {
        var _this = this;
        (0, index_js_1.throttle)(function () {
            switch (_this.raid.action) {
                case 'SHAPE':
                    // this.getBoardItems();
                    // this.addShapeItem();
                    //for (let i = 0; i < 100; i++) this.addShapeItem2();
                    _this.deleteFirstItem();
                    break;
                default:
                    console.log("no action found for ".concat(_this.gather.id));
            }
        });
    };
    RaidMiroObject.prototype.getBoardItems = function () {
        index_js_1.miro_sdk.getItems({ board_id: this.raid.board_id })
            .then(function (_a) {
            var data = _a.data;
            return console.log(data);
        })
            .catch(function (err) { return console.error(err); });
    };
    RaidMiroObject.prototype.addShapeItem = function () {
        index_js_1.miro_sdk.createShapeItem(this.raid.json_data, { board_id: this.raid.board_id })
            .then(function (_a) {
            var data = _a.data;
            return console.log(data);
        })
            .catch(function (err) {
            console.error(err);
            console.error(err.data.context.fields);
        });
    };
    RaidMiroObject.prototype.addShapeItem2 = function () {
        index_js_1.miro_sdk.createShapeItem({
            data: { content: 'Hello', shape: 'rectangle' },
            style: {
                borderColor: '#ee82ee',
                borderOpacity: '1.0',
                borderStyle: 'normal',
                borderWidth: '5.0',
                color: '#1a1a1a',
                fillColor: '#8fd14f',
                fillOpacity: '1.0',
                fontFamily: 'arial',
                fontSize: '16',
                textAlign: 'left',
                textAlignVertical: 'top'
            },
            position: { x: 100, y: 100 },
            geometry: { height: 60, rotation: Math.floor(Math.random() * 359), width: 320 }
        }, { board_id: this.raid.board_id })
            .then(function (_a) {
            var data = _a.data;
            return console.log(data);
        })
            .catch(function (err) {
            console.error(err);
            console.error(err.data.context.fields);
        });
    };
    RaidMiroObject.prototype.deleteFirstItem = function () {
        var _this = this;
        (0, index_js_1.throttle)(function () {
            var _loop_1 = function (i) {
                index_js_1.miro_sdk.deleteItem({ board_id: 'uXjVN9D3R0g=', item_id: _this.temp[i] })
                    .then(function (_a) {
                    var data = _a.data;
                    return console.log(_this.temp[i], 'has been deleted');
                })
                    .catch(function (err) { return console.error(err.data.context); });
            };
            for (var i = 0; i < _this.temp.length; i++) {
                _loop_1(i);
            }
        });
        this.storeItems();
    };
    RaidMiroObject.prototype.storeItems = function () {
        var _this = this;
        (0, index_js_1.throttle)(function () {
            _this.temp = [];
            index_js_1.miro_sdk.getItems({ limit: 50, board_id: _this.raid.board_id })
                .then(function (_a) {
                var data = _a.data;
                //console.log(data);
                var temp_limit = data.data.length < 50 ? data.data.length : 50;
                for (var i = 0; i < temp_limit; i++) {
                    if (data.data[i].id != undefined)
                        _this.temp.push(data.data[i].id);
                    //temp.push(data.data[i].id);
                    // console.log(data.data[i].id);
                }
                console.log('stored', _this.temp.length, 'items');
            })
                .catch(function (err) { return console.error(err); });
        });
    };
    return RaidMiroObject;
}(RaidObject_js_1.RaidObject));
exports.RaidMiroObject = RaidMiroObject;
//# sourceMappingURL=RaidMiroObject.js.map