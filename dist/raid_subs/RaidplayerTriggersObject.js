"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.raidPlayerTriggers = void 0;
// import { game, raidObjects, raidPlayers, throttle } from '../index.js';
var index_js_1 = require("../index.js");
var raidLib_1 = require("../raid_lib/raidLib");
exports.raidPlayerTriggers = (function (game) {
    game.subscribeToEvent("playerTriggersObject", function (data, context) {
        var temp_key = data.playerTriggersObject.key;
        var object_id = Object.keys(index_js_1.raidObjects).find(function (key) { return index_js_1.raidObjects[key].key === temp_key; });
        // Cooldown Code
        if ((0, raidLib_1.playerRateLimit)(index_js_1.raidPlayers[context.playerId]))
            return;
        // Store the coords of the space in front of the player
        var front = {
            x: index_js_1.raidPlayers[context.playerId].x,
            y: index_js_1.raidPlayers[context.playerId].y,
            direction: index_js_1.raidPlayers[context.playerId].direction
        };
        switch (front.direction) {
            case 3:
            case 4:
                front.y--;
                break;
            case 7:
            case 8:
                front.x++;
                break;
            case 1:
            case 2:
                front.y++;
                break;
            case 5:
            case 6:
                front.x--;
                break;
            default:
                console.log('invalid direction?');
        }
        // Check for any players in front of player
        var front_player = 'none';
        Object.keys(index_js_1.raidPlayers).every(function (key, index) {
            if (index_js_1.raidPlayers[key].x == front.x && index_js_1.raidPlayers[key].y == front.y && key != context.playerId) {
                front_player = key;
                return false;
            }
            return true;
        });
        //Checks if the player is already holding an item
        if (index_js_1.raidPlayers[context.playerId].helditem != undefined) {
            if (index_js_1.raidObjects[index_js_1.raidPlayers[context.playerId].helditem] != undefined) {
                var player_obj_1 = index_js_1.raidObjects[index_js_1.raidPlayers[context.playerId].helditem];
                // Determine how an object is placed/traded depending on their raid properties
                if (front_player != 'none' && player_obj_1.raid.tradeable) {
                    if (index_js_1.raidPlayers[front_player].helditem != undefined) {
                        // Tradeable property is true, trade another tradeable item with a player or give them your item if they don't have any items
                        var front_player_obj_1 = index_js_1.raidObjects[index_js_1.raidPlayers[front_player].helditem];
                        if (front_player_obj_1.raid.tradeable) {
                            var temp_obj_1 = index_js_1.raidPlayers[context.playerId].helditem;
                            (0, index_js_1.throttle)(function () {
                                console.log('1');
                                index_js_1.raidPlayers[context.playerId].helditem = index_js_1.raidPlayers[front_player].helditem;
                                game.setItem("closestObjectTemplate", front_player_obj_1.gather.normal, context.playerId);
                            });
                            (0, index_js_1.throttle)(function () {
                                index_js_1.raidPlayers[front_player].helditem = temp_obj_1;
                                game.setItem("closestObjectTemplate", player_obj_1.gather.normal, front_player);
                                console.log("".concat(index_js_1.raidPlayers[context.playerId].name, " has traded with ").concat(index_js_1.raidPlayers[front_player].name, " (").concat(index_js_1.raidPlayers[front_player].helditem, " for ").concat(index_js_1.raidPlayers[context.playerId].helditem, ")"));
                                return;
                            });
                        }
                    }
                    else {
                        (0, index_js_1.throttle)(function () {
                            index_js_1.raidPlayers[front_player].helditem = index_js_1.raidPlayers[context.playerId].helditem;
                            game.setItem("closestObjectTemplate", player_obj_1.gather.normal, front_player);
                            delete index_js_1.raidPlayers[context.playerId].helditem;
                            game.clearItem(context.playerId);
                            console.log("".concat(index_js_1.raidPlayers[context.playerId].name, " has given  ").concat(index_js_1.raidPlayers[front_player].helditem, " to ").concat(index_js_1.raidPlayers[front_player].name));
                            return;
                        });
                    }
                }
                else if (object_id != undefined) {
                    if (index_js_1.raidObjects[object_id] != undefined && index_js_1.raidObjects[object_id].gather != undefined && index_js_1.raidObjects[object_id].gather.x != undefined && index_js_1.raidObjects[object_id].gather.y != undefined) {
                        // swappable property
                        if (player_obj_1.raid.swappable && index_js_1.raidObjects[object_id].raid.swappable) {
                            console.log("".concat(context.player.name, " has swapped ").concat(index_js_1.raidPlayers[context.playerId].helditem, " with ").concat(object_id));
                            swapItem(game, index_js_1.raidPlayers[context.playerId].helditem, object_id, { x: index_js_1.raidObjects[object_id].gather.x, y: index_js_1.raidObjects[object_id].gather.y }, context.playerId, context.player.name, context.player.map, index_js_1.raidObjects[index_js_1.raidPlayers[context.playerId].helditem].key);
                        }
                        if (player_obj_1.raid.stackable && index_js_1.raidObjects[object_id].raid.stackable) {
                            console.log("".concat(context.player.name, " has stacked ").concat(index_js_1.raidPlayers[context.playerId].helditem, " on top of ").concat(object_id));
                            placeItem(game, index_js_1.raidPlayers[context.playerId].helditem, { x: index_js_1.raidObjects[object_id].gather.x, y: index_js_1.raidObjects[object_id].gather.y }, context.playerId, context.player.name, context.player.map);
                        }
                        return;
                    }
                }
                (0, index_js_1.throttle)(function () {
                    if (index_js_1.raidPlayers[context.playerId].helditem != undefined) {
                        console.log("".concat(context.player.name, " has placed down ").concat(index_js_1.raidPlayers[context.playerId].helditem));
                        placeItem(game, index_js_1.raidPlayers[context.playerId].helditem, front, context.playerId, context.player.name, context.player.map);
                    }
                });
            }
            else {
                console.log("held item error");
            }
            return;
        }
        else if (front_player != 'none' && index_js_1.raidPlayers[front_player].helditem != undefined) {
            // lootable property
            var temp_obj_id = index_js_1.raidPlayers[front_player].helditem;
            if (index_js_1.raidObjects[temp_obj_id].raid.lootable) {
                index_js_1.raidPlayers[context.playerId].helditem = index_js_1.raidPlayers[front_player].helditem;
                delete index_js_1.raidPlayers[front_player].helditem;
                game.clearItem(front_player);
                game.setItem("closestObjectTemplate", index_js_1.raidObjects[temp_obj_id].gather.normal, context.playerId);
            }
        }
        if (index_js_1.raidObjects[object_id] != undefined) {
            if (index_js_1.raidObjects[object_id].raid.trigger) {
                if (index_js_1.raidPlayers[context.playerId] != undefined) {
                    takeItem(game, object_id, context.playerId, context.player.name, context.player.map, temp_key);
                    console.log("".concat(context.player.name, " has taken ").concat(object_id));
                }
            }
        }
    });
});
var takeItem = (function (game, obj_id, player_id, player_name, map, key) {
    index_js_1.raidPlayers[player_id].helditem = obj_id;
    (0, index_js_1.throttle)(function () {
        game.setItem("closestObjectTemplate", index_js_1.raidObjects[obj_id].gather.normal, player_id);
        game.deleteObjectByKey(map, key);
    });
});
var placeItem = (function (game, obj_id, front, player_id, player_name, map) {
    index_js_1.raidObjects[obj_id].gather.x = front.x;
    index_js_1.raidObjects[obj_id].gather.y = front.y;
    index_js_1.raidObjects[obj_id].raid.map_id = map;
    (0, index_js_1.throttle)(function () {
        game.clearItem(player_id);
        game.setObject(map, obj_id, index_js_1.raidObjects[obj_id].gather);
    });
    (0, index_js_1.throttle)(function () {
        index_js_1.raidObjects[obj_id].key = game.getObject(obj_id).key;
        delete index_js_1.raidPlayers[player_id].helditem;
    });
});
var swapItem = (function (game, held_id, obj_id, swap, player_id, player_name, map, held_key) {
    (0, index_js_1.throttle)(function () {
        index_js_1.raidObjects[held_id].gather.x = swap.x;
        index_js_1.raidObjects[held_id].gather.y = swap.y;
        index_js_1.raidObjects[held_id].raid.map_id = map;
        game.clearItem(player_id);
        game.setObject(map, held_id, index_js_1.raidObjects[held_id].gather);
    });
    (0, index_js_1.throttle)(function () {
        index_js_1.raidObjects[held_id].key = game.getObject(held_id).key;
        index_js_1.raidPlayers[player_id].helditem = obj_id;
        game.setItem("closestObjectTemplate", index_js_1.raidObjects[obj_id].gather.normal, player_id);
        game.deleteObject(map, obj_id); //deleteObjectByKey hates swappable
    });
});
//# sourceMappingURL=RaidplayerTriggersObject.js.map