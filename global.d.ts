interface RaidPlayer {
  id: string,
  name: string,
  map_id: string,
  x: number,
  y: number,
  direction: number,
  steps: number,
  helditem?: string,
  team?: string,
  kart?: {
    id: string
    vehicleNormal: string,
    vehicleSpritesheet: string
  }
  role?: string
  rate_limit?: {
    timer: number,
    counter: number,
    max_counter: number,
    cooldown: number,
    remaining: number,
    timeout?: any
  }
}

interface RaidProperties {
  map_id: string,
  behavior: string,
  trigger: boolean,
  tradeable: boolean,
  lootable: boolean,
  swappable: boolean,
  stackable: boolean
}

interface RaidLogic extends RaidProperties {
  logic: string
}

interface RaidText extends RaidProperties {
  persist: boolean
}

interface RaidPasswordEntry {
  type: string
  key: string
  value?: string
  options?: {
    label: string,
    key: string
  }
}

interface RaidPasswordProperties extends RaidProperties {
  password: string,
  answers?: {},
  actions?: {
    pass: string,
    failed: string
  }
  teleport?: {
    map_id: string,
    x: number,
    y: number
  }
}

interface RaidLightsOutProperties extends RaidLogic {
  state: {
    on: string,
    off: string
  },
  linked: string[],
  group: string[],
}

interface RaidEnterProperties extends RaidLogic {
  teleport: {
    x: number,
    y: number,
  }
  map: string,
  closed: string,
  logic_two: {
    map:string,
    x: number,
    y: number
  }
  logic_three: string
}

interface RaidExitProperties extends RaidLogic {
  teleport: {
    x: number,
    y: number,
  }
  map: string,
  logic_two: string
  doors: string
}

interface RaidHintProperties extends RaidProperties {
  hints: string[],
  timers: number[]
}

interface RaidMiroProperties extends RaidProperties {
  board_id: string,
  action: string,
  json_data?: {}
}

interface RaidTeam {
  map: {
    map_id: string, 
    x: number, 
    y: number,
  },
  players?: string[], 
  max_count?: number
}

interface RaidTeamGroup {
  count_override: boolean, 
  teams: RaidTeam[]
}