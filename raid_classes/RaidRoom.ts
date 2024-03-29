import { game, raidObjects } from '../index.js';

export class RaidRoom {
  room_name: string
  map_id: string
  x: number
  y: number
  width: number
  height: number
  capacity: number
  timer: number
  interval: number
  timeLeft: number
  objects: {
    sign: string,
    enter: string,
    exit: string
  }
  playersInRoom: { [id: string]: string } = {}
  playersWaiting: { [id: string]: string } = {}
  occupied: boolean
  countdown
  timeLimit

  constructor(room_name: string, map_id: string, x: number, y: number, width: number, height: number, capacity: number, timer: number, interval: number, objects: {sign: string, enter: string, exit: string}) {
    this.room_name = room_name;
    this.map_id = map_id;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.capacity = capacity;
    this.occupied = false;
    this.timer = timer * 1000;
    this.interval = interval * 1000
    this.objects = objects
    this.timeLeft = this.timer;

  }

  addPlayer(player: string, player_name: string) {
    this.playersInRoom[player] = player_name;
  }

  addPlayerWaiting(player: string, player_name: string) {
    this.playersWaiting[player] = player_name;
  }

  removePlayer(player: string) {
    delete this.playersInRoom[player];
  }

  removeAllPlayers(map: string, x: number, y: number) {
    Object.keys(this.playersInRoom).forEach((key, index) => {
      console.log(`Teleporting ${key}`)
      game.teleport(map, x, y, key);
      this.removePlayer(key);
    });
    
  }

  removePlayerWaiting(player: string) {
    delete this.playersWaiting[player];
  }

  numberOfPlayers(): number {
    let x = Object.keys(this.playersInRoom).length;
    
    return x;
  }

  numberOfPlayersWaiting(): number {
    let x = Object.keys(this.playersWaiting).length;
    
    return x;
  }

  isFull(): boolean {
    let full = false;
    if(this.numberOfPlayers() == this.capacity) full = true
    return full;
  }

  isWaitingFull(): boolean {
    let full = false;
    if(this.numberOfPlayersWaiting() == this.capacity) full = true
    return full;
  }

  isEmpty(): boolean {
    let empty = false;
    if (Object.keys(this.playersInRoom).length == 0) empty = true;
    return true;
  }
  

  setUp(map: string, x: number, y: number) {
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

    const timeloop = () => {
      console.log('timeloop initiated at ', this.timeLeft)
      Object.keys(this.playersInRoom).forEach((key, index) => {
        let temp = this.timeLeft / 1000
        game.setTextStatus(temp.toString(), key);
      });

      this.timeLeft -= this.interval;

      if (this.timeLeft < 0) {
        this.removeAllPlayers(map, x, y);
        this.occupied = false;
        raidObjects[this.objects.enter].setSprite(raidObjects[this.objects.enter].gather.normal);

        game.setObject(raidObjects[this.objects.sign].raid.map_id, this.objects.sign, {
          'properties': raidObjects[this.objects.sign].gather.properties
        })

        Object.keys(this.playersInRoom).forEach((key, index) => {
          game.setTextStatus('', key);
        });

        this.timeLeft = this.timer;
        clearInterval(this.timeLimit);
      }
    }

    
    timeloop();
    this.timeLimit = setInterval(function() {
      timeloop();
    }.bind(this), this.interval);

    //setInterval does not run the first loop immeadiately
  }

  cancel() {
    console.log('timer canceled');
    clearTimeout(this.countdown);
    clearInterval(this.timeLimit);

    Object.keys(this.playersInRoom).forEach((key, index) => {
      game.setTextStatus('', key);
    });

    this.timeLeft = this.timer;

  }
}