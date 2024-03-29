var dirs = [ 3/4*Math.PI, 1/2*Math.PI, 1/4*Math.PI, Math.PI, 0, -3/4*Math.PI, -1/2*Math.PI, -1/4*Math.PI ]
var modifiers = [ 1, 3, 5, 10 ]

// Box-Muller Transform
function randomNormal(mean, std) {
  let u = 1 - Math.random()
  let v = Math.random()
  let z = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)

  return z * std + mean
}

function scanFilesForValue(item) {
  for (let i of ['desert', 'jungle', 'city', 'ocean']) {
    if (resources[item] && resources[item][i]) {
      return resources[item][i].value
    }
  }
  for (let i of ['low', 'mid', 'high']) {
    for (let j of ['weapons', 'armor']) {
      for (let k of ['melee', 'range', 'magic', 'head', 'torso', 'legs', 'ring']) {
        if (equipment[i][j][k] && equipment[i][j][k][item]) {
          return equipment[i][j][k][item].value
        }
      }
    }
  }
  return 0
}

function drop_roll(table) {
  let total = 0
  let keys = Object.keys(table)
  for(let i = 0; i < keys.length; i++) {
    total += table[keys[i]].odds
  }
  let running_total = 0
  let number = Math.floor(Math.random() * total)
  let drop = ''

  for(let i = 0; i < keys.length; i++) {
    running_total += table[keys[i]].odds
    
    if(drop.length == 0 && running_total > number) {
      drop = keys[i]
    }
  }
  return drop
}

class Pathing {
  constructor(start, goal) {
    this.start = start
    this.goal = goal
    
    this.to_visit = []

    this.x = start[0]
    this.y = start[1]

    this.tiles = []
    for (let i = 0; i < C_TILES; i++) {
      this.tiles.push([])
      for (let j = 0; j < C_TILES; j++) {
        this.tiles[this.tiles.length - 1].push([])
      }
    }

    this.tiles = this.resetProperties(this.tiles, [this.x, this.y])
  }
  
  resetProperties(_tiles, pos) {
    for(let i=0; i<_tiles.length; i++) {
      for(let j=0; j<_tiles.length; j++) {
        _tiles[i][j].prev = undefined
        _tiles[i][j].score = 0
        if(i == pos[0] && j == pos[1]) {
          _tiles[i][j].visited = true
        } else {
          _tiles[i][j].visited = false
        }
      }
    }
    return _tiles
  }
  
  cycle(world) {
    let arr = [[this.x, this.y + 1], [this.x - 1, this.y], [this.x + 1, this.y], [this.x, this.y - 1]]

    for (let i=0; i<arr.length; i++) {
      let subsequent = [parseInt(arr[i][0]), parseInt(arr[i][1])]
      
      if(subsequent[0] >= 0 && subsequent[1] >= 0 && subsequent[0] < C_TILES && subsequent[1] < C_TILES) {

        if(JSON.stringify(subsequent) == JSON.stringify(this.goal)) {
          if(JSON.stringify([this.x, this.y]) != JSON.stringify(this.start)) {
            this.tiles[subsequent[0]][subsequent[1]].prev = [this.x, this.y]
          }

          this.tiles[subsequent[0]][subsequent[1]].visited = true

          let path = []
          if(typeof(this.tiles[subsequent[0]][subsequent[1]].prev) != 'undefined') {
            while(typeof(this.tiles[subsequent[0]][subsequent[1]].prev) != 'undefined') {
              let old_x = subsequent[0]
              let old_y = subsequent[1]
              
              subsequent = this.tiles[subsequent[0]][subsequent[1]].prev
              path.push([old_x, old_y])
            }
            path.push(subsequent)
          } else {
            path.push(subsequent)
          }
          let path_job = []
          while (path.length) {
            let p = path.pop()
            if (world.surface[p[0]][p[1]].road) {
              path_job.push(new MoveJob(p[0], p[1], ROAD_MOD))
            } else {
              path_job.push(new MoveJob(p[0], p[1], 1))
            }
          }
          return path_job
        } else if (this.tiles[subsequent[0]][subsequent[1]].visited == false) {
          if(JSON.stringify([this.x, this.y]) != JSON.stringify(this.start)) {
            this.tiles[subsequent[0]][subsequent[1]].prev = [this.x, this.y]
          }

          let tile_score = 1
          if (world.surface[subsequent[0]][subsequent[1]].road == true) {
            tile_score = .45
          }
          this.tiles[subsequent[0]][subsequent[1]].visited = true
          this.tiles[subsequent[0]][subsequent[1]].score = this.tiles[this.x][this.y].score + tile_score
          this.to_visit.push({x: subsequent[0], y: subsequent[1], score: this.tiles[this.x][this.y].score + tile_score})
        }
      }
    }

    this.to_visit = this.to_visit.sort(function(a, b) { return b.score - a.score })
    let coords = this.to_visit.pop()

    if (typeof(coords) == 'undefined') {
      return
    }

    this.x = coords.x
    this.y = coords.y
  }
  
  findPath(world) {
    let moveJob
    while (!moveJob) {
      moveJob = this.cycle(world)
    }
    return moveJob
  }
  
  getCoverage() {
    let coverage = []
    for (let x = 0; x < C_TILES; x++) {
      for (let y = 0; y < C_TILES; y++) {
        if (this.tiles[x][y].visited == true) {
          coverage.push([x, y])
        }
      }
    }
    return coverage
  }
}

class Noise {
  constructor(height, width) {
    this.height = height
    this.width = width
    this.my2D = []
    for (let i = 0; i < height; i++) {
      this.my2D.push([])
      for (let j = 0; j < width; j++) {
        this.my2D[i].push(0)
      }
    }
  }
  
  interpolate(a0, a1, w) { return (a1 - a0) * w + a0 }

  dotGridGrad(grads, ix, iy, x, y) {
    let vals = [Math.cos(grads[ix + 1][iy + 1]), Math.sin(grads[ix + 1][iy + 1])]
    
    let dx = x - ix
    let dy = y - iy
    
    return dx * vals[0] + dy * vals[1]
  }

  perlin(rands, x, y) {
    let x0 = Math.floor(x)
    let x1 = x0 + 1
    let y0 = Math.floor(y)
    let y1 = y0 + 1
    
    let sx = x - x0
    let sy = y - y0
    
    let n0 = this.dotGridGrad(rands, x0, y0, x, y)
    let n1 = this.dotGridGrad(rands, x1, y0, x, y)
    let ix0 = this.interpolate(n0, n1, sx)

    n0 = this.dotGridGrad(rands, x0, y1, x, y)
    n1 = this.dotGridGrad(rands, x1, y1, x, y)
    let ix1 = this.interpolate(n0, n1, sx)

    let value = this.interpolate(ix0, ix1, sy)
    return value
  }

  generate() {
    let grads = []
    for (let i = 0; i < this.height + 2; i++) {
      grads.push([])
      for (let j = 0; j < this.width + 2; j++) {
        grads[i].push(Math.random() * 5)
      }
    }
    for (let x = 0; x < this.height; x++) {
      for (let y = 0; y < this.width; y++) {
        this.my2D[x][y] = this.perlin(grads, x / 10, y / 10).toFixed(4)
      }
    }
    return this.my2D
  }
}

/**
* Just an object essentially that takes two arguments
* First, the number of stacks in the inventory
* Second, the capacity of every stack
* HOWTO: Look good
* NOTE2: Many inventories and one for every unit
*/
class Inventory {
  constructor(size, capacity) {
    this.items = {}
    this.size = size
    this.capacity = capacity
  }

  draw(x, y) {
    console.log("Drawing Container..")
  }

  add_item(item, quantity) {
    let item_keys = Object.keys(this.items)
    if (item_keys.length && item_keys.includes(item)) {
      this.items[item] += quantity

      if (this.items[item] >= this.capacity) {
        this.items[item] = this.capacity
      }
      return true
    } else {
      if (item_keys.length < this.size) {
        if (quantity > this.capacity) {
          quantity = this.capacity
        }
        this.items[item] = quantity
        return true
      }
    }
    return false
  }

  remove_item(item, quantity) {
    if (this.items[item] <= quantity) {
      delete this.items[item]
    } else {
      this.items[item] -= quantity
    }
  }
  
  getEqpStats() {
    let stats = { 'attk': 0, 'skill': 0, 'def': 0 }
    
    for (let itemStr in this.items) {
      let item = equipment.find(itemStr)
      if (item) {
        Object.keys(stats).forEach(function(attr) {
          stats[attr] += item[attr] || 0
        })
      }
    }
    
    return stats
  }
  
  getValue() {
    let sum = 0
    
    if (Object.keys(this.items).length) {
      for (let item of Object.keys(this.items)) {
        sum += scanFilesForValue(item) * this.items[item]
      }
    }
    return sum
  }

  getAVG() {
    return this.getValue() / this.items.length
  }
}

class Bag extends Inventory {
	constructor (max) {
		super(9999, 9999)
		this.maxValue = max
	}
}

class Player {
  constructor() {
    this.strength = 1
    this.inventory = new Inventory(9999, 9999)
  }
}

class Party {
  constructor(x, y, id) {
    this.id = id
    this.modifier_idx = 0
    
    this.x = x
    this.y = y
    this.members = {'units': [], 'civilians': [], 'members': [], 'generals': [ new General() ]}
  }
  
  raise_civilian() {
    let civilian = this.members.civilians.pop()
    let member = new Member()
    
    member.inventory = civilian.inventory
    this.members.members.push(member)
  }
  
  get_job_id() {
    return this['members']['generals'][0]['jobs'][0]['id']
  }
  
  increase_modifier() {
    this.modifier_idx += 1
    if (this.modifier_idx == modifiers.length) {
      this.modifier_idx = 0
    }
  }
  
  move_party(x, y) {
    this.x = x
    this.y = y
  }
}

// localstorage class
class History {
  constructor() {
    this.hist = []
    
    for (let ii = 0; ii < 10; ii++) {
      this.hist.push([])
      for (let jj = 0; jj < 8; jj++) {
        this.hist[this.hist.length - 1].push(100)
      }
    }
  }
  
  // return array containing instructions for updating portions of the arena's units' opacity
  read_long_history() {
    let pack = []
    for (let ii = 0; ii < this.hist.length; ii++) {
      pack.push([])
      for (let jj = 0; jj < this.hist[ii].length; jj++) {
        pack[pack.length - 1].push(this.hist[ii][jj])
      }
    }
    return pack
  }
  
  add_elm(elm) {
    this.hist.push(elm)
    
    if (this.hist.length > 10) {
      this.hist.shift()
    }
  }
}

/*function initialize(prev, stat_tag) {
	this.tag = stat_tag
	this.prev = prev
	this.goal = Math.floor(Math.random() * 10) + 5
}
function check(statistics) {
	if (statistics[this.tag] - this.prev > this.goal) {
		return true
	}
	return false
} try harder below */

class Intel {
  constructor(func) {
    this.func = func
  }
}

// Knowing you'll need multiple briefs....
class Brief {
  constructor() {
    this.intels = []
  }
  
  check_brief() {
    for (let ii = 0; ii < this.funcs.length; ii++) {
      this.intels[ii].func()
    }
  }
  
  add_func(func) {
    this.intels.push(new Intel(func))
  }
}

class Unit {
  constructor() {
    this.temp = 100 // amount of currency
    this.habit = 70
    this.momentum = 0 // opposite of resistance to change in this.exvar    
  }
  
  change_habit() {
    this.momentum += .5 - Math.random()
    
    if (Math.abs(this.momentum) > 3.5) {
      this.momentum = this.momentum / 2
    }
    
    this.habit += this.momentum
  }
}

// 
class General extends Unit {
  constructor() {
    super()
    
    this.inventory = new Inventory(3, 5)
    this.inventory.add_item('dagger', 1)
    this.inventory.add_item('seed', 5)
    this.jobs = []
    
    this.temp *= 5
    
    this.brief = new Brief()
    this.xp = 0
  }
  
  getLevel() {
    return Math.floor(Math.log10(this.xp + 10))
  }
  
  progresso() {
    this.jobs[0].progresso(this)
  }
  
  task_done() {
    return this.jobs[0].progress == this.jobs[0].max
  }
}

class Civilian extends Unit {
  constructor() {
    super()
    
    this.xp = 0
    this.health = 100
    this.maxhealth = 100
    this.temp *= 2
    this.inventory = new Inventory(2, 3)
    this.jobs = []
  }
  
  getLevel() {
    return Math.floor(Math.log10(this.xp + 10))
  }
  
  progresso() {
    this.jobs[0].progresso(this)
  }
  
  task_done() {
    return this.jobs[0].progress == this.jobs[0].max
  }
}

class Member extends Civilian {
  constructor() {
    super()
    
    this.temp *= 2
  }
}

class Job {
  constructor(max) {
    this.progress = 0
    this.max = max
  }
  
  progresso(amount) {
    this.progress += amount
    if (this.progress > this.max) {
      this.progress = this.max
    }
  }
}

class BuildJob extends Job {
  constructor(x, y, amount) {
    super(100)
    this.id = 'build'
    this.x = x
    this.y = y
    
    this.amount = amount
  }
  
  progresso() {
    super.progresso(this.amount)
  }
}

class MoveJob extends Job {
  constructor(x, y, mod) {
    super(20)
    this.id = 'move'
    this.x = x
    this.y = y
    
    this.mod = mod
  }
  
  progresso() {
    super.progresso(10 / this.mod)
  }
}

class BattleJob extends Job {
  constructor(x, y, biome) {
    let enemies = []
    let ks = Object.keys(biomes[biome]['enemies'])
    let level = Math.floor(1 + Math.sqrt((x - places['base'][0])**2 + (y - places['base'][1])**2)/3.5)
    level += Math.abs(world.height[places['base'][0]][places['base'][1]] - world.height[x][y])
    let total_health = 0
    for (let i = 0; i < 5; i++) {
      let tag = ks[Math.floor(ks.length * Math.random())]
      enemies.push(Object.assign({}, biomes[biome]['enemies'][tag]))
      let health = enemies[i]['maxhealth'] * (1 + 2 * (level - 1))
      enemies[i]['health'] = health
      enemies[i]['maxhealth'] = health
      total_health += health
      enemies[i]['name'] = tag
    }
    super(total_health)
    
    this.id = 'battle'
    this.index = 0
    this.x = x
    this.y = y
    this.biome = biome
    this.level = level
    this.enemies = enemies
  }
  
  reward_items(value, difficulty) {
    let bag = new Bag(value)
    
    while (bag.getValue() < bag.maxValue) {
      let roll = Math.random()
      if (roll < .95) {
        let item = drop_roll(biomes[this.biome]['tables']['monster'])
        bag.add_item(item, 1)
      } else if (roll < .99) {
        let item = drop_roll(biomes[this.biome]['tables']['rare'])
        bag.add_item(item, 1)
      } else {
        let tier = 'low'
        if (difficulty < 10) {
          tier = 'low'
        } else if (difficulty < 20) {
          tier = 'mid'
        } else if (difficulty < 30) {
          tier = 'high'
        }
        let item = drop_roll(biomes[this.biome]['tables']['equipment'][tier])
        bag.add_item(item, 1)
      }
    }
    
    return bag
  }
  
  reward_trap() {
    return drop_roll(biomes[this.biome]['tables']['trap'])
  }
  
  progresso(unit) {
    let stats = unit.inventory.getEqpStats()
    stats = { 'attk': stats['attk'] + unit.getLevel() * 2 + 100, 'skill': stats['skill'] + unit.getLevel() * 2, 'def': stats['def'] + unit.getLevel() * 2 }
    
    let dam = randomNormal(stats['attk'], stats['skill'])
    
    while (dam > stats['attk'] + stats['attk'] / (this.enemies[this.index].defence / 250) || dam < 0) {
      dam = randomNormal(stats['attk'], stats['skill'])
    }
    
    if (this.enemies[this.index].health < dam) {
      dam = this.enemies[this.index].health
    }
    
    super.progresso(dam)
    this.enemies[this.index].health -= dam
    if (this.enemies[this.index].health <= 0) {
      this.enemies[this.index].health = 0
      this.index += 1
    }
  }
}

class TrapJob extends Job {
  constructor(x, y, biome) {
    this.id = 'trap'
    this.x = x
    this.y = y
    this.biome = biome
    
    super(100)
  }
  
  progresso() {
    super.progresso(10)
  }
}

class Superstructure {
  constructor(x, y, begin, cycle, crossed) {
    this.x = x
    this.y = y
    this.details = begin()
    this.func = cycle
    this.stepped = crossed
  }
  
  cycle() {
    if (this.func) {
      this.func()
    }
  }
  
  crossed(inventory) {
    if (this.stepped) {
      this.stepped(inventory)
    }
  }
}

class Arena {
  constructor(count, biome) {
    this.units = {'units': [], 'civilians': [], 'members': [], 'generals': []}
    this.parties = {}
    
    this.hist = new History()
    
    this.superstructure = undefined
    
    this.road = false
    this.road_inventory = new Inventory(10, 3)
    this.road_gain = new Job(100)
    this.biome = biome
    
    this.battleChance = 1
    this.attractionChance = undefined
    
    for (let i = 0; i < count; i++) {
      this.units['units'].push(new Unit())
    }
  }
  
  total_habit() {
    let sum = 0
    
    let units = this.units.civilians.concat(this.units.members).concat(this.units.units)
    for (let unit of units) {
      sum += Math.abs(unit.habit)
    }
    
    for (let k in this.parties) {
      let units = this.parties[k]['members'].civilians.concat(this.parties[k]['members'].members).concat(this.parties[k]['members'].units).concat(this.parties[k]['members']['generals'])
      for (let unit of units) {
        sum += Math.abs(unit.habit)
      }
    }
    return sum
  }
  
  change_habit() {
    let units = this.units.civilians.concat(this.units.members).concat(this.units.units)
    for (let unit of units) {
      unit.change_habit()
    }
    
    for (let k in this.parties) {
      units = this.parties[k]['members'].civilians.concat(this.parties[k]['members'].members).concat(this.parties[k]['members'].units).concat(this.parties[k]['members']['generals'])
      for (let unit of units) {
        unit.change_habit()
      }
    }
  }
  
  total_item_value() {
    let sum = 0
    
    let units = this.units.civilians.concat(this.units.members)
    for (let unit of units) {
      if (unit['inventory']['items'].length) {
        let items = unit['inventory']['items']
        for (let item of items) {
          sum += item.value
        }
      }
    }
    
    for (let k in this.parties) {
      units = this.parties[k]['members'].civilians.concat(this.parties[k]['members'].members).concat(this.parties[k]['members'].units).concat(this.parties[k]['members']['generals'])
      for (let unit of units) {
        if (unit['inventory']['items'].length) {
          let items = unit['inventory']['items']
          for (let item of items) {
            sum += item.value
          }
        }
      }
    }
    
    return sum
  }
  
  total_temperature() {
    let sum = 0
    
    let units = this.units.civilians.concat(this.units.members).concat(this.units.units)
    for (let unit of units) {
      sum += unit.temp
    }
    
    for (let k in this.parties) {
      units = this.parties[k]['members'].civilians.concat(this.parties[k]['members'].members).concat(this.parties[k]['members'].units).concat(this.parties[k]['members']['generals'][0])
      for (let unit of units) {
        sum += unit.temp
      }
    }
    return sum
  }
  
  avg_temp() {
    let temp_sum = this.total_temperature() + this.total_item_value()
    
    let party_membs = 0
    for (let ii in this.parties) {
      for (let j in this.parties[ii]['members']) {
        party_membs += this.parties[ii]['members'][j].length
      }
    }
    
    let units_length = party_membs + this.units.units.length + this.units.generals.length + this.units.members.length + this.units.civilians.length
    let denom = units_length
    if (temp_sum == 0 && units_length == 0) {
      denom = 1
    }
    return temp_sum / denom
  }
  
  check_road() {
    if (this.road) {
      return true
    } else {
      return false
    }
  }
  
  update_road() {
    if (this.road_gain.progress >= this.road_gain.max) {
      let item = drop_roll(biomes[this.biome]['tables']['standard'])
      this.road_inventory.add_item(item, 1)
      this.road_gain.progress = 0
    } else {
      this.road_gain.progresso(2)
    }
   
  }
  
  check_civilian() {
    for (let i in this.parties) {
      if (this.parties[i]['members'].civilians.length) {
        return true
      }
    }
    if (this.units.civilians.length) {
      return true
    }
    return false
  }
  
  check_member() {
    for (let i in this.parties) {
      if (this.parties[i]['members'].members.length) {
        return true
      }
    }
    if (this.units.members.length) {
      return true
    }
    return false
  }
  
  check_general() {
    for (let i in this.parties) {
      if (this.parties[i]['members'].generals.length) {
        return true
      }
    }
    if (this.units.generals.length) {
      return true
    }
    return false
  }
  
  redistribute_temperature() {
    let total_t = this.total_temperature()
    let total_habit = this.total_habit()
    
    let units = this.units.civilians.concat(this.units.members).concat(this.units.units)
    for (let unit of units) {
      unit.temp = total_t * (Math.abs(unit.habit) / total_habit)
    }
    
    for (let k in this.parties) {
      units = this.parties[k]['members'].civilians.concat(this.parties[k]['members'].members).concat(this.parties[k]['members'].units).concat(this.parties[k]['members']['generals'])
      for (let unit of units) {
        unit.temp = total_t * (Math.abs(unit.habit) / total_habit)
      }
    }
  }
  
  add_history(arenas) {
    let entries = []
    for (let i = 0; i < arenas.length; i++) {
      
      entries.push(arenas[i].avg_temp())
    }
    this.hist.add_elm(entries)
    return arenas
  }
  
  build_road(unit) {
    if (this.road) {
      unit['jobs'].splice(0, 1)
    } else {
      unit.progresso()
            
      if (unit.task_done()) {
        this.road = true
        this.road_type = unit['jobs'][0].road_type
        creationPoints += 50
        unit['jobs'].splice(0, 1)
      }
    }
  }
  
  find_progress(id) {
    let units = this.units.members.concat(this.units.civilians)
    for (let i in units) {
      if (units[i].jobs.length) {
        if (units[i].jobs[0].id == id && units[i].jobs[0].progress != 0) {
          return units[i].jobs[0]
        }
      }
    }
    for (let i in this.parties) {
      if (this.parties[i].members.generals[0].jobs.length) {
        if (this.parties[i].members.generals[0].jobs[0].id == id && this.parties[i].members.generals[0].jobs[0].progress != 0) {
          return this.parties[i].members.generals[0].jobs[0]
        }
      }
    }
    return false
  }
  
  check_progress(id) {
    if (this.find_progress(id)) {
      return true
    } else {
      return false
    }
  }
  
  add_party_jobs(job) {
    for (let j in this.parties) {
      for (let k in this.parties[j]['members']) {
        for (let member of this.parties[j]['members'][k]) {
          member['jobs'].splice(0, 0, job)
        }
      }
    }
  }
  
  add_jobs(job) {
    let units = this.units.members.concat(this.units.civilians)
    for (let unit of units) {
      unit['jobs'].splice(0, 0, job)
    }
  }
  
  remove_jobs() {
    for (let j in this.parties) {
      for (let k in this.parties[j]['members']) {
        for (let member of this.parties[j]['members'][k]) {
          if (member['jobs'].length) {
            member['jobs'].splice(0, 1)
          }
        }
      }
    }
    
    let units = this.units.members.concat(this.units.civilians)
    for (let unit of units) {
      if (unit['jobs'].length) {
        unit['jobs'].splice(0, 1)
      }
    }
  }
  
  update_units_jobs(units) {
    let movers = []
    let moved = false
    let remove_idxs = []
    let ongoing_battles = []
    
    for (let i in units) {
      let unit = units[i]
      if (unit.jobs.length) {
        switch (unit['jobs'][0].id) {
          case 'battle':
            if (!ongoing_battles.length) {
              ongoing_battles.push([unit['jobs'][0].x, unit['jobs'][0].y])
            }
            for (let j in ongoing_battles) {
              if (unit['jobs'][0].x != ongoing_battles[j][0] && unit['jobs'][0].y != ongoing_battles[j][1]) {
                ongoing_battles.push([unit['jobs'][0].x, unit['jobs'][0].y])
              }
            }
            
            unit.progresso()
            if (unit['jobs'][0].index == unit['jobs'][0].enemies.length) {
              let items = unit['jobs'][0].reward_items(10 * unit['jobs'][0].level, unit['jobs'][0].level)
              for (let item of Object.keys(items.items)) {
                unit.inventory.add_item(item, items.items[item])
              }
              let xp_drop = 0
              for (let enemy of unit['jobs'][0].enemies) {
                xp_drop += enemy.maxhealth / units.length
              }
              for (let person of units) {
                person.xp += xp_drop
              }
              
              for (let i in ongoing_battles) {
                if (unit['jobs'][0].x == ongoing_battles[i][0] && unit['jobs'][0].y == ongoing_battles[i][1]) {
                  ongoing_battles.splice(i, 1)
                }
              }
              
              this.remove_jobs()
            }
            break
          case 'build':
            //if (this.check_progress('build')) {
            //  unit['jobs'][0] = this.find_progress('build')
            //}
            this.build_road(unit)
            break
          case 'trap':
            unit.progresso()
            
            if (unit.task_done()) {
              let item = unit['jobs'][0].reward_trap()
              unit.inventory.add_item(item, 1)
              
              this.remove_jobs()
            }
            break
          case 'move':
            if (moved == false) {
              unit.progresso()
              moved = true
            }
              
            if (unit.task_done()) {
              let x = unit['jobs'][0].x
              let y = unit['jobs'][0].y
              
              unit['jobs'].splice(0, 1)
              
              movers.push([x, y, unit])
            }
            break
        }
      }
    }
    
    for (let i in ongoing_battles) {
      let hit = false
      for (let unit of units) {
        if (hit == false && unit['jobs'][0]['id'] == 'battle' && unit['jobs'][0].x == ongoing_battles[i][0] && unit['jobs'][0].y == ongoing_battles[i][1]) {
          hit = true
          let attk = unit['jobs'][0].enemies[unit['jobs'][0].index].attk
          let dam = randomNormal(attk, unit['jobs'][0].enemies[unit['jobs'][0].index].skill)
          
          let stats = unit['inventory'].getEqpStats()
          while (dam > attk + attk / (stats['defence'] / 250) || dam < 0) {
            dam = randomNormal(attk, unit['jobs'][0].enemies[unit['jobs'][0].index].skill)
          }
          
          unit.health -= dam
          
          if (unit.health / unit.maxhealth < .5) {
            for (let item of Object.keys(unit.inventory.items)) {
              if (edible.includes(item)) {
                unit.inventory.remove_item(item, 1)
                unit.health += 25
              }
            }
          }
          
          if (unit.health <= 0) {
            unit.health = 0
            
            movers.push([unit['jobs'][0].x, unit['jobs'][0].y, unit])
          }
        }
      }
    }
    
    return movers
  }
}

class EconomySmall {
  constructor(size) {
    this.state = []
    for (let i = 0; i < size; i++) {
      this.state.push([])
      for (let j = 0; j < size; j++) {
        this.state[this.state.length - 1].push(10)
      }
    }
  }
  
  std_dir_idx(instructs) {
    let averages = [], medians = [], std_ds = []
    
    for (let i = 0; i < instructs.length; i++) {
      averages.push([0])
      std_ds.push([])
      
      
      let sum = 0
      for (let j = 0; j < instructs[i].length; j++) {
        sum += instructs[i][j]/instructs[i].length
      }
      averages[i][averages[i].length - 1] = sum
    }
    
    let summationx = 0, summationy = 0
    for (let i = 0; i < instructs.length; i++) {
      for (let j = 0; j < instructs[i].length; j++) {
        summationx += Math.cos(dirs[j]) * (((instructs[i][j] - averages[i])**2) / instructs[i].length)
        summationy += Math.sin(dirs[j]) * (((instructs[i][j] - averages[i])**2) / instructs[i].length)
      }
    }
    
    let my_dir = Math.atan2(summationy, summationx)
    if (my_dir < -Math.PI + Math.PI/8) {
      return [3, Math.sqrt(summationx**2 + summationy**2)]
    }
    for (let i = 0; i < dirs.length; i++) {
      if (Math.abs(my_dir - dirs[i]) <= Math.PI/8) {
        return [i, Math.sqrt(summationx**2 + summationy**2)]
      }
    }
  }
  
  update(x, y) {
    this.state[x][y] += 1
  }
}

class World {
  constructor(noise, size, unit_count) {
    this.height = Object.assign({}, noise)
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        this.height[i][j] = Math.floor(this.height[i][j] / .05)
      }
    }
    this.size = size
    this.unit_count = unit_count
    this.economy = new EconomySmall(size)
    this.party_ids = []
    
    this.surface = []
    for (let i = 0; i < size; i++) {
      this.surface.push([])
      
      for (let j = 0; j < size; j++) {
        this.surface[this.surface.length - 1].push([])
      }
    }
    
    let firstNode = [5, 5]
    let nodes = [ firstNode ]
    for (let i = 1; i < Math.floor(this.size / (2 * firstNode[0])); i++) {
      for (let j = 0; j <= i; j++) {
        nodes.push([firstNode[0] + j * firstNode[0], i * 2 * firstNode[1]])
        if (j != i) {
          nodes.push([firstNode[0] + i * firstNode[0], j * 2 * firstNode[1]])
        }
      }
    }
    
    let blooms = []
    for (let node of nodes) {
      blooms.push(new Pathing(node))
    }
    
    let mod_dif
    let counter = 500
    while (counter) {
      let roll = Math.floor(Math.random() * 5)
      if (roll < 2) {
        mod_dif = 0
      } else if (roll < 4) {
        mod_dif = 1
      } else if (roll < 5) {
        mod_dif = 2
      }
      for (let i = 0; i <= Math.floor(blooms.length / 3); i++) {
        if (3 * i + mod_dif < blooms.length) {
          blooms[3 * i + mod_dif].cycle(this)
        }
      }
      
      counter -= 1
    }
    
    for (let bloom of blooms) {
      let biome_roll = Object.keys(biomes)[Math.floor(Math.random() * (Object.keys(biomes).length - 1))]
      
      for (let i = 0; i < this.size; i++) {
        for (let j = 0; j < this.size; j++) {
          if (bloom.tiles[i][j].visited) {
            this.surface[i][j] = new Arena(unit_count, biome_roll)
          }
        }
      }        
    }
    
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (JSON.stringify(this.surface[i][j]) == '[]') {
          this.surface[i][j] = new Arena(unit_count, 'desert')
        }
      }
    }
  }
  
  // Class copy from stackoverflow given current ES6 standards
  funcopy(myclass) {
    return Object.assign(Object.create(Object.getPrototypeOf(myclass)), myclass)
  }
  
  update_arena_economy(player, x, y) {
    let arenas = []
    let center_arena = this.surface[x][y]
    
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i != 0 || j != 0) {
          if ((x + i > 0 && y + j > 0) && (x + i < this.size && y + j < this.size)) {
            arenas.push(this.surface[x + i][y + j])
          } else {
            // Boundary Conditions
            arenas.push(new Arena(this.unit_count))
          }
        }
      }
    }
    
    center_arena.redistribute_temperature()
    
    // Adds an entry of surrounding average temperatures to the center arena's hist stack
    arenas = center_arena.add_history(arenas, player)
    
    // Reads all history entries and returns a ( hist.length, 8 ) array
    let instructs = center_arena.hist.read_long_history()
    
    let [idx, mag] = this.economy.std_dir_idx(instructs)
    
    if (mag > 1) {
      this.economy.update(x - Math.round(Math.sin(dirs[idx])), y + Math.round(Math.cos(dirs[idx])))
    }
    
    let count = 0
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if ((i != 0 || j != 0) && ((x + i > 0 && y + j > 0) && (x + i < this.size && y + j < this.size))) {
          this.surface[x + i][y + j] = this.funcopy(arenas[count])
        }
        if (i != 0 || j != 0) {
          count += 1
        }
      }
    }
  }
  
  update_units_jobs(x, y) {
    let units = this.surface[x][y].units.civilians.concat(this.surface[x][y].units.members)
    let removes = []
    for (let i = 0; i < units.length; i++) {
      if (units[i].health == 0) {
        removes.push(i)
      }
    }
    removes.sort(function(a, b) { b - a })
    for (let i = 0; i < removes.length; i++) {
      units.splice(removes[i], 1)
    }
    
    let movers = this.surface[x][y].update_units_jobs(units)
    let arena = this.surface[x][y]
    
    if (movers.length) {
      /*if (this.surface[movers[0][0]][movers[0][1]].check_progress('battle')) {
        for (let i = 0; i < movers.length; i++) {
          movers[i][2]['jobs'][0] = this.surface[movers[i][0]][movers[i][1]].find_progress('battle')
        }
      }*/
      
      let removes = []
      for (let i = 0; i < movers.length; i++) {        
        for (let j = 0; j < arena['units']['civilians'].length; j++) {
          if (JSON.stringify(movers[i][2]) == JSON.stringify(arena['units']['civilians'][j])) {
            removes.push([j, 'civilians'])
          }
        }
        
        for (let j = 0; j < arena['units']['members'].length; j++) {
          if (JSON.stringify(movers[i][2]) == JSON.stringify(arena['units']['members'][j])) {
            removes.push([j, 'members'])
          }
        }
        
        this.surface[movers[i][0]][movers[i][1]]['units'][movers[i][2].constructor.name.toLowerCase() + 's'].push(movers[i][2])
        if (this.surface[movers[i][0]][movers[i][1]].check_road()) {
          let road_inv = this.surface[movers[i][0]][movers[i][1]].road_inventory
          for (let j of Object.keys(road_inv.items)) {
            if (movers[i][2]['inventory'][j] < movers[i][2]['inventory'].capacity) {
              movers[i][2]['inventory'].add_item(road_inv.remove_item(j))
            }
          }
        }
      }
      removes.sort(function(a, b) { return parseInt(b[0]) - parseInt(a[0]) })
      for (let j in removes) {
        arena['units'][removes[j][1]].splice(removes[j][0], 1)
      }
      
      if (Math.random() < .25 * this.surface[movers[0][0]][movers[0][1]].battleChance) {
        let job = new BattleJob(movers[0][0], movers[0][1], this.surface[movers[0][0]][movers[0][1]].biome)
        this.surface[movers[0][0]][movers[0][1]].add_jobs(job)
      } else if (this.surface[movers[0][0]][movers[1][0]].attractionChance && Math.random() < this.surface[movers[0][0]][movers[0][1]].attractionChance) {
        let job = new TrapJob(movers[0][0], movers[0][1], this.surface[movers[0][0]][movers[0][1]].biome)
        movers[0][2]['jobs'].splice(0, 0, job)
        this.surface[movers[0][0]][movers[0][1]].add_jobs(job)
      }
    }
  }
  
  update_party_jobs(party) {
    let movers = this.surface[party.x][party.y].update_units_jobs(party['members']['civilians'].concat(party['members']['members']).concat(party['members']['generals']))
    if (movers.length) {
      for (let i = 0; i < movers.length; i++) {
        if (movers[i][2].health == 0) {
          for (let j of ['civilians', 'members']) {
            for (let k = 0; k < party['members'][j].length; k++) {
              if (movers.length && JSON.stringify(party['members'][j][k]) == JSON.stringify(movers[i][2])) {
                let unit = party['members'][j][k]
                party['members'][j].splice(k, 1)
                unit['jobs'].splice(0)
                this.surface[party.x][party.y]['units'][j].push(unit)
                movers.splice(i, 1)
              }
            }
          }
        }
      }
      if (movers.length && movers[0][0] && movers[0][1]) {
        this.move_party(party, movers[0][0], movers[0][1])
        
        if (this.surface[movers[0][0]][movers[0][1]].check_road()) {
          let road_inv = this.surface[movers[0][0]][movers[0][1]].road_inventory
          for (let j of Object.keys(road_inv.items)) {
            if (!movers[0][2]['inventory'][j] || (movers[0][2]['inventory'][j] && movers[0][2]['inventory'][j] < movers[0][2]['inventory'].capacity)) {
              movers[0][2]['inventory'].add_item(j, 1)
              road_inv.remove_item(j, 1)
            }
          }
        }
        if (Math.random() < .25 * this.surface[movers[0][0]][movers[0][1]].battleChance) {
          let job = new BattleJob(movers[0][0], movers[0][1], this.surface[movers[0][0]][movers[0][1]].biome)
          this.surface[movers[0][0]][movers[0][1]].add_party_jobs(job)
        } else if (this.surface[movers[0][0]][movers[0][1]].attractionChance && Math.random() < this.surface[movers[0][0]][movers[0][1]].attractionChance) {
          let job = new TrapJob(movers[0][0], movers[0][1], this.surface[movers[0][0]][movers[0][1]].biome)
          movers[0][2]['jobs'].splice(0, 0, job)
          this.surface[movers[0][0]][movers[0][1]].add_party_jobs(job)
        }
      }
    }
  }
  
  change_habit(x, y) {
    this.surface[x][y].change_habit()
  }
  
  check_civ(x, y) {
    return this.surface[x][y].check_civilian()
  }
  
  check_member(x, y) {
    return this.surface[x][y].check_member()
  }
  
  check_general(x, y) {
    return this.surface[x][y].check_general()
  }
  
  add_party(party) {
    let gen_id = Math.floor(1000 * Math.random())
    while (this.party_ids.includes(gen_id)) {
      gen_id = Math.floor(1000 * Math.random())
    }
    party.id = gen_id
    this.party_ids.push(gen_id)
    this.surface[party.x][party.y].parties[gen_id] = party
  }
  
  move_party(party, x, y) {
    delete this.surface[party.x][party.y].parties[party.id]
    party.move_party(x, y)
    this.surface[x][y].parties[party.id] = party
  }
  
  heal_arena(x, y) {
    for (let i of ['civilians', 'members']) {
      for (let j = 0; j < this.surface[x][y]['units'][i].length; j++) {
        if (this.surface[x][y]['units'][i][j]['health'] < 100) {
          this.surface[x][y]['units'][i][j]['health'] += 2.5
          if (this.surface[x][y]['units'][i][j]['health'] > 100) {
            this.surface[x][y]['units'][i][j]['health'] = 100
          }
        }          
      }
    }
  }
}

// How do we add generals

// Consider the following:
// move_units(x,y) considers a general in the (x, y) arena and surround arenas
// the general considers the 8 arenas octile the center for avg temperature
// each of the 8 arenas is incremented based on the general's hypothesis of history[-1]
// ??? the [center arena/economy] is updated based on the whole of the arena's history ???

// Might implement skills that are basically buffs