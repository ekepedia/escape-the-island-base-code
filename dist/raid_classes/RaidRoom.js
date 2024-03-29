"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RaidRoom = void 0;
var index_js_1 = require("../index.js");
var RaidRoom = /** @class */ (function () {
    function RaidRoom(room_name, map_id, x, y, width, height, capacity, timer, interval, objects) {
        this.playersInRoom = {};
        this.playersWaiting = {};
        this.room_name = room_name;
        this.map_id = map_id;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.capacity = capacity;
        this.occupied = false;
        this.timer = timer * 1000;
        this.interval = interval * 1000;
        this.objects = objects;
        this.timeLeft = this.timer;
    }
    RaidRoom.prototype.addPlayer = function (player, player_name) {
        this.playersInRoom[player] = player_name;
    };
    RaidRoom.prototype.addPlayerWaiting = function (player, player_name) {
        this.playersWaiting[player] = player_name;
    };
    RaidRoom.prototype.removePlayer = function (player) {
        delete this.playersInRoom[player];
    };
    RaidRoom.prototype.removeAllPlayers = function (map, x, y) {
        var _this = this;
        Object.keys(this.playersInRoom).forEach(function (key, index) {
            console.log("Teleporting ".concat(key));
            index_js_1.game.teleport(map, x, y, key);
            _this.removePlayer(key);
        });
    };
    RaidRoom.prototype.removePlayerWaiting = function (player) {
        delete this.playersWaiting[player];
    };
    RaidRoom.prototype.numberOfPlayers = function () {
        var x = Object.keys(this.playersInRoom).length;
        return x;
    };
    RaidRoom.prototype.numberOfPlayersWaiting = function () {
        var x = Object.keys(this.playersWaiting).length;
        return x;
    };
    RaidRoom.prototype.isFull = function () {
        var full = false;
        if (this.numberOfPlayers() == this.capacity)
            full = true;
        return full;
    };
    RaidRoom.prototype.isWaitingFull = function () {
        var full = false;
        if (this.numberOfPlayersWaiting() == this.capacity)
            full = true;
        return full;
    };
    RaidRoom.prototype.isEmpty = function () {
        var empty = false;
        if (Object.keys(this.playersInRoom).length == 0)
            empty = true;
        return true;
    };
    RaidRoom.prototype.setUp = function (map, x, y) {
        var _this = this;
        console.log('timer set');
        // this.countdown = setTimeout(function() {
        //   this.removeAllPlayers(map, x, y);
        //   this.occupied = false;
        //   raidObjects[this.objects.enter].setSprite(raidObjects[this.objects.enter].normal);
        //   game.setObject(raidObjects[this.objects.sign].map_id, this.objects.sign, {
        //     'properties': raidObjects[this.objects.sign].properties
        //   })
        //   Object.keys(this.playersInRoom).forEach((key, index) => {
        //     game.setTextStatus('', key);
        //   });
        //   this.timeLeft = this.timer;
        // }.bind(this), this.timer);
        var timeloop = function () {
            console.log('timeloop initiated at ', _this.timeLeft);
            Object.keys(_this.playersInRoom).forEach(function (key, index) {
                var temp = _this.timeLeft / 1000;
                index_js_1.game.setTextStatus(temp.toString(), key);
            });
            _this.timeLeft -= _this.interval;
            if (_this.timeLeft < 0) {
                _this.removeAllPlayers(map, x, y);
                _this.occupied = false;
                index_js_1.raidObjects[_this.objects.enter].setSprite(index_js_1.raidObjects[_this.objects.enter].gather.normal);
                index_js_1.game.setObject(index_js_1.raidObjects[_this.objects.sign].raid.map_id, _this.objects.sign, {
                    'properties': index_js_1.raidObjects[_this.objects.sign].gather.properties
                });
                Object.keys(_this.playersInRoom).forEach(function (key, index) {
                    index_js_1.game.setTextStatus('', key);
                });
                _this.timeLeft = _this.timer;
                clearInterval(_this.timeLimit);
            }
        };
        timeloop();
        this.timeLimit = setInterval(function () {
            timeloop();
        }.bind(this), this.interval);
        //setInterval does not run the first loop immeadiately
    };
    RaidRoom.prototype.cancel = function () {
        console.log('timer canceled');
        clearTimeout(this.countdown);
        clearInterval(this.timeLimit);
        Object.keys(this.playersInRoom).forEach(function (key, index) {
            index_js_1.game.setTextStatus('', key);
        });
        this.timeLeft = this.timer;
    };
    return RaidRoom;
}());
exports.RaidRoom = RaidRoom;
//# sourceMappingURL=RaidRoom.js.map