// Interactable Object for Miro app
import { WireObject, Player, MapObject, Game } from "@gathertown/gather-game-client";
import { raidObjects, raidRooms, throttle, miro_sdk } from '../index.js';
import { RaidObject } from "./RaidObject.js";

export class RaidMiroObject extends RaidObject {
  raid: RaidMiroProperties
  temp: string[] = [];

  constructor(gather: MapObject, raid: RaidMiroProperties, game: Game) {
    super(gather, raid, game);

    this.storeItems();
  }

  interaction(player: Partial<Player>, json_data?: string) {
    throttle(() => {
      switch (this.raid.action) {
        case 'SHAPE':
          // this.getBoardItems();
          // this.addShapeItem();

          //for (let i = 0; i < 100; i++) this.addShapeItem2();
          this.deleteFirstItem();
          break;
        default:
          console.log(`no action found for ${this.gather.id}`);
      }
    });
  }

  getBoardItems() {
    miro_sdk.getItems({ board_id: this.raid.board_id })
      .then(({ data }: any) => console.log(data))
      .catch((err: any) => console.error(err));
  }

  addShapeItem() {
    miro_sdk.createShapeItem(this.raid.json_data, { board_id: this.raid.board_id })
      .then(({ data }: any) => console.log(data))
      .catch((err: any) => {
        console.error(err)
        console.error(err.data.context.fields)
      });
  }

  addShapeItem2() {
    miro_sdk.createShapeItem({
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
      .then(({ data }: any) => console.log(data))
      .catch((err: any) => {
        console.error(err)
        console.error(err.data.context.fields)
      });
  }

  deleteFirstItem() {

    throttle(() => {
      for (let i = 0; i < this.temp.length; i++) {
        miro_sdk.deleteItem({ board_id: 'uXjVN9D3R0g=', item_id: this.temp[i] })
          .then(({ data }: any) => console.log(this.temp[i], 'has been deleted'))
          .catch((err: any) => console.error(err.data.context));
      }
    })

    this.storeItems();
  }

  storeItems() {

    throttle(() => {
      this.temp = [];

      miro_sdk.getItems({ limit: 50, board_id: this.raid.board_id })
        .then(({ data }: any) => {
          //console.log(data);
          let temp_limit = data.data.length < 50 ? data.data.length : 50;

          for (let i = 0; i < temp_limit; i++) {
            if (data.data[i].id != undefined) this.temp.push(data.data[i].id);
            //temp.push(data.data[i].id);
            // console.log(data.data[i].id);
          }

          console.log('stored', this.temp.length, 'items');
        })
        .catch((err: any) => console.error(err));
    })
  }
}