"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RaidRace = void 0;
var RaidRace = /** @class */ (function () {
    function RaidRace(race_name, map_id, start_line, end_line, checkpoints, laps) {
        this.raidPlayerRaceTracker = {};
        this.race_name = race_name;
        this.map_id = map_id;
        this.start_line = start_line;
        this.end_line = end_line;
        this.checkpoints = checkpoints;
        this.laps = laps;
    }
    RaidRace.prototype.update = function (player_id, player_name, current_pos, current_map) {
        var x = JSON.stringify(current_pos);
        //When player walks over start line, create raidPlayerRaceTracker object of player
        if (JSON.stringify(this.start_line).includes(x) && current_map == this.map_id) {
            if (this.raidPlayerRaceTracker[player_id] == undefined) {
                this.raidPlayerRaceTracker[player_id] = {
                    lap: 0,
                    start_time: Date.now(),
                    end_time: Date.now(),
                    lap_time: Date.now(),
                    cp_counter: 0
                };
                console.log("".concat(player_name, " has entered the trial!"));
            }
            else {
                this.raidPlayerRaceTracker[player_id].lap_time = Date.now();
            }
        }
        //Checkpoints
        if (this.raidPlayerRaceTracker[player_id] != undefined) {
            if (this.raidPlayerRaceTracker[player_id].cp_counter < this.checkpoints.length) {
                if (JSON.stringify(this.checkpoints[this.raidPlayerRaceTracker[player_id].cp_counter]).includes(x)) {
                    console.log("".concat(player_name, " has passed checkpoint ").concat(this.raidPlayerRaceTracker[player_id].cp_counter + 1, " of lap ").concat(this.raidPlayerRaceTracker[player_id].lap + 1, "! (").concat((Date.now() - this.raidPlayerRaceTracker[player_id].end_time) / 1000, ")"));
                    this.raidPlayerRaceTracker[player_id].end_time = Date.now();
                    this.raidPlayerRaceTracker[player_id].cp_counter++;
                }
            }
        }
        //Finish line
        if (JSON.stringify(this.end_line).includes(x) && this.raidPlayerRaceTracker[player_id].cp_counter == this.checkpoints.length) {
            if (this.raidPlayerRaceTracker[player_id] != undefined) {
                console.log("".concat(player_name, " has passed checkpoint ").concat(this.raidPlayerRaceTracker[player_id].cp_counter + 1, " of lap ").concat(this.raidPlayerRaceTracker[player_id].lap + 1, "! (").concat((Date.now() - this.raidPlayerRaceTracker[player_id].end_time) / 1000, ")"));
                this.raidPlayerRaceTracker[player_id].end_time = Date.now();
                console.log("".concat(player_name, " has completed a lap! (").concat((Date.now() - this.raidPlayerRaceTracker[player_id].lap_time) / 1000, ")"));
                //console.log(`${player_name} has completed lap ${this.raidPlayerRaceTracker[player_id].lap + 1} in ${(this.raidPlayerRaceTracker[player_id].end_time - this.raidPlayerRaceTracker[player_id].start_time) / 1000}`);
                this.raidPlayerRaceTracker[player_id].lap++;
                this.raidPlayerRaceTracker[player_id].cp_counter = 0;
                if (this.raidPlayerRaceTracker[player_id].lap == this.laps) {
                    console.log("".concat(player_name, " has finished the course in ").concat((this.raidPlayerRaceTracker[player_id].end_time - this.raidPlayerRaceTracker[player_id].start_time) / 1000, " ' seconds!"));
                    delete this.raidPlayerRaceTracker[player_id];
                }
            }
        }
    };
    return RaidRace;
}());
exports.RaidRace = RaidRace;
//# sourceMappingURL=RaidRace.js.map