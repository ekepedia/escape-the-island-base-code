import { WireObject, Player, MapObject, Game } from "@gathertown/gather-game-client";
import { raidObjects, throttle } from '../index.js'; // remove game
import { RaidObject } from "./RaidObject.js";

export class RaidSpawnZone {
  name: string
  map_id: string
  spawn_rate: number
  id_prefix: string
  id_suffix_counter: number
  item_id_list: string[]
  item_max: number
  items: Object
  zones: Object
  game: Game // add Game

  constructor(name: string, map_id: string, spawn_rate: number, id_prefix: string, id_suffix_counter: number, item_max: number, items: Object, zones: Object, game: Game) { // add Game
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

  spawn() {
    console.log(this.item_id_list.length, this.item_max);
    throttle(() => {
      if (this.item_id_list.length < this.item_max) {
        let obj_list = this.game.partialMaps[this.map_id].objects; // set to this.game

        const mesh_array = this.mesh_spawns();
        const new_coords = this.findSpawn(obj_list, mesh_array);

        let new_x = new_coords.x;
        let new_y = new_coords.y;
        let new_biome = new_coords.biome;

        //Generate list of animals that have not reached full capacity 
        let temp_animals = [];
        Object.keys(this.items).forEach((key, value) => {
          if (this.items[key].counter < this.items[key].capacity) {
            temp_animals[key] = this.items[key].chance;
          }
        });

        //Randomly choose an animal from the list based on their weights & biome
        //Adjust spawn rates based off biome
        let animal = 'none';
        if (Object.keys(temp_animals).length != 0) {
          let total = 0;

          Object.keys(temp_animals).forEach((key, value) => {
            temp_animals[key] *= this.zones[new_biome].spawn_weights[key];
            total += temp_animals[key];
          });

          let rand = Math.floor(Math.random() * total);

          //console.log(total, rand)

          Object.keys(temp_animals).every((key, value) => {
            animal = key;
            if (rand < temp_animals[key]) {
              return false;
            }

            rand -= temp_animals[key];
            return true;
          });
        }

        if (animal != 'none') {
          let temp_id = this.id_prefix + this.id_suffix_counter.toString();
          this.id_suffix_counter++;
          this.items[animal].counter++;

          let new_spawn_gather: MapObject = {
            id: temp_id,
            type: 5,
            x: new_x,
            y: new_y,
            width: 1,
            height: 1,
            zIndex: 1,
            distThreshold: 0,
            previewMessage: 'press x to kidnap the animal',
            normal: this.items[animal].image,
            highlighted: this.items[animal].image,
            customState: animal,
            properties: {},
            spritesheet: this.items[animal].spritesheet ?? undefined
          }

          this.game.setObject(this.map_id, temp_id + 'a', new_spawn_gather); // set to this.game

          raidObjects[temp_id] = new RaidObject(
            new_spawn_gather,
            {
              map_id: this.map_id,
              behavior: 'none',
              trigger: false,
              tradeable: false,
              lootable: false,
              swappable: true,
              stackable: false
            }, this.game // set to this.game
          );

          this.item_id_list.push(temp_id);
          console.log(animal, temp_id, 'was placed in', this.map_id, 'at:', new_x, new_y);

          // Add DB stuff here
          //
          //


        } else {
          console.log('something went wrong with animal:', animal);
          console.log('if animal: none, item_max must be higher than total capacity of all zones together')
        }

      } else {
        console.log('max capacity reached for', this.name);
      }
    });
  }

  //Combine all possible spawn locations (x, y) of each zone into a single array
  mesh_spawns() {
    let new_array = [];
    let ex_array = [];
    let return_array = [];

    Object.keys(this.zones).forEach((key, value) => {
      for (let i = this.zones[key].min.x; i <= this.zones[key].max.x; i++) {
        for (let j = this.zones[key].min.y; j <= this.zones[key].max.y; j++) {
          new_array.push({ x: i, y: j, biome: key });
        }
      }

      if (this.zones[key].exclusions.length > 0) {
        for (let i = 0; i < this.zones[key].exclusions.length; i++) {
          for (let j = this.zones[key].exclusions[i].min.x; j <= this.zones[key].exclusions[i].max.x; j++) {
            for (let k = this.zones[key].exclusions[i].min.y; k <= this.zones[key].exclusions[i].max.y; k++) {
              ex_array.push({ x: j, y: k, biome: key });
            }
          }
        }
      }
    });

    return_array = new_array.filter((a) => !ex_array.map(b => JSON.stringify(b)).includes(JSON.stringify(a)));

    return return_array;
  }

  //Searches for an empty spawn location based from the array generated by mesh_spawns
  findSpawn(obj_list: Object, mesh_array: { x: number, y: number, biome: string }[]) {
    let rand_coords: { x: number, y: number, biome: string }
    rand_coords = mesh_array[Math.floor(Math.random() * mesh_array.length)];

    for (const key of Object.keys(obj_list)) {
      if (obj_list[key].x == rand_coords.x && obj_list[key].y == rand_coords.y) {
        rand_coords = this.findSpawn(obj_list, mesh_array);
      }
    }

    return rand_coords;
  }

  //Delete all objects with the suffix
  delete_objects() {
    const map_objects = this.game.partialMaps[this.map_id].objects; // set to this.game

    let key_array = []

    Object.keys(map_objects).forEach((key, index) => {
      if (map_objects[key].id.includes(this.id_prefix)) {
        let obj_id = map_objects[key].id;
        let obj_key = key;

        key_array.push(obj_key);
        console.log(`${obj_key} marked for deletion`);
      }
    });

    let x = 0;
    for (let i = key_array.length - 1; i >= 0; i--) {
      throttle(() => {
        this.game.deleteObjectByKey(this.map_id, key_array[i]); // set to this.game
        console.log(`Object ${key_array[i]} has been deleted.`)
      });
      x++;
    }

    console.log(`Deleted all spawned objects in ${this.map_id}`);
  }

  //Delete one object by key
  delete_object(key: string, obj: MapObject) {
    throttle(() => {
      this.game.deleteObjectByKey(this.map_id, key); // set to this.game
      this.items[obj.customState].counter--;
      this.item_id_list.splice(this.item_id_list.indexOf[obj.id], 1);
      console.log(`Object ${key} has been deleted.`);
    });
  }
}
