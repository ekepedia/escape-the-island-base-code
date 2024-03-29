export class RaidRace {
  race_name: string
  map_id: string
  start_line: []
  end_line: []
  checkpoints: []
  laps: number
  raidPlayerRaceTracker: { [id: string]: {lap: number, start_time: number, end_time: number, lap_time: number, cp_counter: number}} = {};

  constructor(race_name: string, map_id: string, start_line: [], end_line: [], checkpoints: [], laps: number) {
    this.race_name = race_name;
    this.map_id = map_id;
    this.start_line = start_line;
    this.end_line = end_line;
    this.checkpoints = checkpoints;
    this.laps = laps;
  }

  update(player_id: string, player_name: string, current_pos: {x: number, y: number}, current_map: string) {
    let x = JSON.stringify(current_pos)

    //When player walks over start line, create raidPlayerRaceTracker object of player
    if (JSON.stringify(this.start_line).includes(x) && current_map == this.map_id) {
      if (this.raidPlayerRaceTracker[player_id] == undefined) {
        this.raidPlayerRaceTracker[player_id] = {
          lap: 0,
          start_time: Date.now(),
          end_time: Date.now(),
          lap_time: Date.now(),
          cp_counter:0
        }
        console.log(`${player_name} has entered the trial!`);
      } else {
        this.raidPlayerRaceTracker[player_id].lap_time = Date.now();
      }
    }

    //Checkpoints
    if (this.raidPlayerRaceTracker[player_id] != undefined) {
      if (this.raidPlayerRaceTracker[player_id].cp_counter < this.checkpoints.length) {
        if (JSON.stringify(this.checkpoints[this.raidPlayerRaceTracker[player_id].cp_counter]).includes(x)) {
          console.log(`${player_name} has passed checkpoint ${this.raidPlayerRaceTracker[player_id].cp_counter + 1} of lap ${this.raidPlayerRaceTracker[player_id].lap + 1}! (${(Date.now() - this.raidPlayerRaceTracker[player_id].end_time) / 1000})`);
          this.raidPlayerRaceTracker[player_id].end_time = Date.now();
          this.raidPlayerRaceTracker[player_id].cp_counter++;
        }
      }
    }

    //Finish line
    if (JSON.stringify(this.end_line).includes(x) && this.raidPlayerRaceTracker[player_id].cp_counter == this.checkpoints.length) {
      if (this.raidPlayerRaceTracker[player_id] != undefined) {
        
        console.log(`${player_name} has passed checkpoint ${this.raidPlayerRaceTracker[player_id].cp_counter + 1} of lap ${this.raidPlayerRaceTracker[player_id].lap + 1}! (${(Date.now() - this.raidPlayerRaceTracker[player_id].end_time) / 1000})`);

        this.raidPlayerRaceTracker[player_id].end_time = Date.now();
        console.log(`${player_name} has completed a lap! (${(Date.now() - this.raidPlayerRaceTracker[player_id].lap_time) / 1000})`);
        //console.log(`${player_name} has completed lap ${this.raidPlayerRaceTracker[player_id].lap + 1} in ${(this.raidPlayerRaceTracker[player_id].end_time - this.raidPlayerRaceTracker[player_id].start_time) / 1000}`);

        this.raidPlayerRaceTracker[player_id].lap++;
        this.raidPlayerRaceTracker[player_id].cp_counter = 0;

        if (this.raidPlayerRaceTracker[player_id].lap == this.laps) {
          console.log(`${player_name} has finished the course in ${(this.raidPlayerRaceTracker[player_id].end_time - this.raidPlayerRaceTracker[player_id].start_time) / 1000} ' seconds!`)
          delete this.raidPlayerRaceTracker[player_id];
        }
      }
    }
  }
}