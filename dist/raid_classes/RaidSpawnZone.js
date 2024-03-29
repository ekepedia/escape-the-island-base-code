"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RaidSpawnZone = void 0;
var index_js_1 = require("../index.js"); // remove game
var RaidObject_js_1 = require("./RaidObject.js");
var RaidSpawnZone = /** @class */ (function () {
    function RaidSpawnZone(name, map_id, spawn_rate, id_prefix, id_suffix_counter, item_max, items, zones, game) {
        this.name = name;
        this.map_id = map_id;
        this.spawn_rate = spawn_rate;
        this.id_prefix = id_prefix;
        this.id_suffix_counter = id_suffix_counter;
        this.item_id_list = [];
        this.item_max = item_max;
        this.items = items;
        this.zones = zones;
        this.game = game; // set game
    }
    RaidSpawnZone.prototype.spawn = function () {
        var _this = this;
        console.log(this.item_id_list.length, this.item_max);
        (0, index_js_1.throttle)(function () {
            var _a;
            if (_this.item_id_list.length < _this.item_max) {
                var obj_list = _this.game.partialMaps[_this.map_id].objects; // set to this.game
                var mesh_array = _this.mesh_spawns();
                var new_coords = _this.findSpawn(obj_list, mesh_array);
                var new_x = new_coords.x;
                var new_y = new_coords.y;
                var new_biome_1 = new_coords.biome;
                //Generate list of animals that have not reached full capacity 
                var temp_animals_1 = [];
                Object.keys(_this.items).forEach(function (key, value) {
                    if (_this.items[key].counter < _this.items[key].capacity) {
                        temp_animals_1[key] = _this.items[key].chance;
                    }
                });
                //Randomly choose an animal from the list based on their weights & biome
                //Adjust spawn rates based off biome
                var animal_1 = 'none';
                if (Object.keys(temp_animals_1).length != 0) {
                    var total_1 = 0;
                    Object.keys(temp_animals_1).forEach(function (key, value) {
                        temp_animals_1[key] *= _this.zones[new_biome_1].spawn_weights[key];
                        total_1 += temp_animals_1[key];
                    });
                    var rand_1 = Math.floor(Math.random() * total_1);
                    //console.log(total, rand)
                    Object.keys(temp_animals_1).every(function (key, value) {
                        animal_1 = key;
                        if (rand_1 < temp_animals_1[key]) {
                            return false;
                        }
                        rand_1 -= temp_animals_1[key];
                        return true;
                    });
                }
                if (animal_1 != 'none') {
                    var temp_id = _this.id_prefix + _this.id_suffix_counter.toString();
                    _this.id_suffix_counter++;
                    _this.items[animal_1].counter++;
                    var new_spawn_gather = {
                        id: temp_id,
                        type: 5,
                        x: new_x,
                        y: new_y,
                        width: 1,
                        height: 1,
                        zIndex: 1,
                        distThreshold: 0,
                        previewMessage: 'press x to kidnap the animal',
                        normal: _this.items[animal_1].image,
                        highlighted: _this.items[animal_1].image,
                        customState: animal_1,
                        properties: {},
                        spritesheet: (_a = _this.items[animal_1].spritesheet) !== null && _a !== void 0 ? _a : undefined
                    };
                    _this.game.setObject(_this.map_id, temp_id + 'a', new_spawn_gather); // set to this.game
                    index_js_1.raidObjects[temp_id] = new RaidObject_js_1.RaidObject(new_spawn_gather, {
                        map_id: _this.map_id,
                        behavior: 'none',
                        trigger: false,
                        tradeable: false,
                        lootable: false,
                        swappable: true,
                        stackable: false
                    }, _this.game // set to this.game
                    );
                    _this.item_id_list.push(temp_id);
                    console.log(animal_1, temp_id, 'was placed in', _this.map_id, 'at:', new_x, new_y);
                    // Add DB stuff here
                    //
                    //
                }
                else {
                    console.log('something went wrong with animal:', animal_1);
                    console.log('if animal: none, item_max must be higher than total capacity of all zones together');
                }
            }
            else {
                console.log('max capacity reached for', _this.name);
            }
        });
    };
    //Combine all possible spawn locations (x, y) of each zone into a single array
    RaidSpawnZone.prototype.mesh_spawns = function () {
        var _this = this;
        var new_array = [];
        var ex_array = [];
        var return_array = [];
        Object.keys(this.zones).forEach(function (key, value) {
            for (var i = _this.zones[key].min.x; i <= _this.zones[key].max.x; i++) {
                for (var j = _this.zones[key].min.y; j <= _this.zones[key].max.y; j++) {
                    new_array.push({ x: i, y: j, biome: key });
                }
            }
            if (_this.zones[key].exclusions.length > 0) {
                for (var i = 0; i < _this.zones[key].exclusions.length; i++) {
                    for (var j = _this.zones[key].exclusions[i].min.x; j <= _this.zones[key].exclusions[i].max.x; j++) {
                        for (var k = _this.zones[key].exclusions[i].min.y; k <= _this.zones[key].exclusions[i].max.y; k++) {
                            ex_array.push({ x: j, y: k, biome: key });
                        }
                    }
                }
            }
        });
        return_array = new_array.filter(function (a) { return !ex_array.map(function (b) { return JSON.stringify(b); }).includes(JSON.stringify(a)); });
        return return_array;
    };
    //Searches for an empty spawn location based from the array generated by mesh_spawns
    RaidSpawnZone.prototype.findSpawn = function (obj_list, mesh_array) {
        var rand_coords;
        rand_coords = mesh_array[Math.floor(Math.random() * mesh_array.length)];
        for (var _i = 0, _a = Object.keys(obj_list); _i < _a.length; _i++) {
            var key = _a[_i];
            if (obj_list[key].x == rand_coords.x && obj_list[key].y == rand_coords.y) {
                rand_coords = this.findSpawn(obj_list, mesh_array);
            }
        }
        return rand_coords;
    };
    //Delete all objects with the suffix
    RaidSpawnZone.prototype.delete_objects = function () {
        var _this = this;
        var map_objects = this.game.partialMaps[this.map_id].objects; // set to this.game
        var key_array = [];
        Object.keys(map_objects).forEach(function (key, index) {
            if (map_objects[key].id.includes(_this.id_prefix)) {
                var obj_id = map_objects[key].id;
                var obj_key = key;
                key_array.push(obj_key);
                console.log("".concat(obj_key, " marked for deletion"));
            }
        });
        var x = 0;
        var _loop_1 = function (i) {
            (0, index_js_1.throttle)(function () {
                _this.game.deleteObjectByKey(_this.map_id, key_array[i]); // set to this.game
                console.log("Object ".concat(key_array[i], " has been deleted."));
            });
            x++;
        };
        for (var i = key_array.length - 1; i >= 0; i--) {
            _loop_1(i);
        }
        console.log("Deleted all spawned objects in ".concat(this.map_id));
    };
    //Delete one object by key
    RaidSpawnZone.prototype.delete_object = function (key, obj) {
        var _this = this;
        (0, index_js_1.throttle)(function () {
            _this.game.deleteObjectByKey(_this.map_id, key); // set to this.game
            _this.items[obj.customState].counter--;
            _this.item_id_list.splice(_this.item_id_list.indexOf[obj.id], 1);
            console.log("Object ".concat(key, " has been deleted."));
        });
    };
    return RaidSpawnZone;
}());
exports.RaidSpawnZone = RaidSpawnZone;
//# sourceMappingURL=RaidSpawnZone.js.map