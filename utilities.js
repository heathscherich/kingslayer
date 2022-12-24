var dirs = [ 3/4*Math.PI, 1/2*Math.PI, 1/4*Math.PI, Math.PI, 0, -3/4*Math.PI, -1/2*Math.PI, -1/4*Math.PI ]
var modifiers = [ 1, 3, 5, 10 ]

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
    } else {
      if (item_keys.length < this.size) {
        if (quantity > this.capacity) {
          quantity = this.capacity
        }
        this.items[item] = quantity
      }
    }
  }

  remove_item(item, quantity) {
    if (this.items[item] <= quantity) {
      delete this.items[item]
    } else {
      this.items[item] -= quantity
    }
  }
}

class Player {
  constructor() {
    this.strength = 1
    this.storage = new Inventory(9999, 999999)
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
        this.hist[this.hist.length - 1].push(Math.exp(0))
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
    this.jobs = []
    
    this.temp *= 5
    
    this.brief = new Brief()
    this.xp = 0
  }
  
  progresso() {
    this.jobs[0].progresso()
  }
  
  task_done() {
    return this.jobs[0].progress == this.jobs[0].max
  }
}

class Civilian extends Unit {
  constructor() {
    super()
    
    this.temp *= 2
    this.inventory = new Inventory(2, 3)
    this.jobs = []
  }
  
  progresso() {
    this.jobs[0].progresso()
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
  
  roll(table) {
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
  
  reward_item() {
    return this.roll(biomes[this.biome]['tables']['monster'])
  }
  
  progresso() {
    let dam = 50
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

class Arena {
  constructor(count) {
    this.units = {'units': [], 'civilians': [], 'members': [], 'generals': []}
    this.parties = {}
    
    this.hist = new History()
    
    this.road = false
    this.biome = 'desert'
    
    for (let i = 0; i < count; i++) {
      this.units['units'].push(new Unit())
    }
  }
  
  total_habit() {
    let sum = 0
    for (let ii = 0; ii < this.units.civilians.length; ii++) {
      sum += Math.abs(this.units.civilians[ii].habit)
    }
    for (let ii = 0; ii < this.units.members.length; ii++) {
      sum += Math.abs(this.units.members[ii].habit)
    }
    for (let ii = 0; ii < this.units.generals.length; ii++) {
      sum += Math.abs(this.units.generals[ii].habit)
    }
    for (let ii = 0; ii < this.units.units.length; ii++) {
      sum += Math.abs(this.units.units[ii].habit)
    }
    for (let k in this.parties) {
      for (let ii = 0; ii < this.parties[k]['members'].civilians.length; ii++) {
        sum += Math.abs(this.parties[k]['members'].civilians[ii].habit)
      }
      for (let ii = 0; ii < this.parties[k]['members'].members.length; ii++) {
        sum += Math.abs(this.parties[k]['members'].members[ii].habit)
      }
      for (let ii = 0; ii < this.parties[k]['members'].generals.length; ii++) {
        sum += Math.abs(this.parties[k]['members'].generals[ii].habit)
      }
      for (let ii = 0; ii < this.parties[k]['members'].units.length; ii++) {
        sum += Math.abs(this.parties[k]['members'].units[ii].habit)
      }
    }
    return sum
  }
  
  change_habit() {
    for (let ii = 0; ii < this.units['units'].length; ii++) {
      this.units['units'][ii].change_habit()
    }
    for (let ii = 0; ii < this.units['civilians'].length; ii++) {
      this.units['civilians'][ii].change_habit()
    }
    for (let ii = 0; ii < this.units['members'].length; ii++) {
      this.units['members'][ii].change_habit()
    }
     for (let k in this.parties) {
      for (let ii = 0; ii < this.parties[k]['members'].civilians.length; ii++) {
        this.parties[k]['members'].civilians[ii].change_habit()
      }
      for (let ii = 0; ii < this.parties[k]['members'].members.length; ii++) {
        this.parties[k]['members'].members[ii].change_habit()
      }
      for (let ii = 0; ii < this.parties[k]['members'].generals.length; ii++) {
        this.parties[k]['members'].generals[ii].change_habit()
      }
      for (let ii = 0; ii < this.parties[k]['members'].units.length; ii++) {
        this.parties[k]['members'].units[ii].change_habit()
      }
    }
  }
  
  total_item_value() {
    let sum = 0
    for (let k in this.parties) {
      if (this.parties[k]['members'].generals[0]['inventory']['items'].length) {
        let items = this.parties[k]['members'].civilians[0]['inventory']['items']
        for (let item of items) {
          sum += item.value * 50
        }
      }
      
      for (let ii = 0; ii < this.parties[k]['members'].members.length; ii++) {
        if (this.parties[k]['members'].members[ii]['inventory']['items'].length) {
          let items = this.parties[k]['members'].members[ii]['inventory']['items']
          for (let item of items) {
            sum += item.value * 50
          }
        }
      }
      
      for (let ii = 0; ii < this.parties[k]['members'].civilians.length; ii++) {
        if (this.parties[k]['members'].civilians[ii]['inventory']['items'].length) {
          let items = this.parties[k]['members'].civilians[ii]['inventory']['items']
          for (let item of items) {
            sum += item.value * 50
          }
        }
      }
    }
    return sum
  }
  
  total_temperature() {
    let sum = 0
    for (let ii = 0; ii < this.units.civilians.length; ii++) {
      sum += this.units.civilians[ii].temp
    }
    for (let ii = 0; ii < this.units.members.length; ii++) {
      sum += this.units.members[ii].temp
    }
    for (let ii = 0; ii < this.units.generals.length; ii++) {
      sum += this.units.generals[ii].temp
    }
    for (let ii = 0; ii < this.units.units.length; ii++) {
      sum += this.units.units[ii].temp
    }
    
    for (let k in this.parties) {
      sum += Math.abs(this.parties[k]['members'].generals[0].temp)
      
      for (let ii = 0; ii < this.parties[k]['members'].members.length; ii++) {
        sum += Math.abs(this.parties[k]['members'].members[ii].temp)
      }
      
      for (let ii = 0; ii < this.parties[k]['members'].civilians.length; ii++) {
        sum += Math.abs(this.parties[k]['members'].civilians[ii].temp)
      }
      
      for (let ii = 0; ii < this.parties[k]['members'].units.length; ii++) {
        sum += Math.abs(this.parties[k]['members'].units[ii].temp)
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
    return temp_sum / ( party_membs + this.units.units.length + this.units.generals.length + this.units.members.length + this.units.civilians.length )
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
    let total_t = 0, total_habit = 0
    total_t = this.total_temperature()
    total_habit = this.total_habit()
    for (let ii = 0; ii < this.units.civilians.length; ii++) {
      this.units.civilians[ii].temp = total_t * (Math.abs(this.units.civilians[ii].habit) / total_habit)
    }
    for (let ii = 0; ii < this.units.members.length; ii++) {
      this.units.members[ii].temp = total_t * (Math.abs(this.units.members[ii].habit) / total_habit)
    }
    for (let ii = 0; ii < this.units.generals.length; ii++) {
      this.units.generals[ii].temp = total_t * (Math.abs(this.units.generals[ii].habit) / total_habit)
    }
    for (let ii = 0; ii < this.units.units.length; ii++) {
      this.units.units[ii].temp = total_t * (Math.abs(this.units.units[ii].habit) / total_habit)
    }
    
    for (let k in this.parties) {
      for (let ii = 0; ii < this.parties[k]['members'].civilians.length; ii++) {
        this.parties[k]['members'].civilians[ii].temp = total_t * (Math.abs(this.parties[k]['members'].civilians[ii].habit) / total_habit)
      }
      for (let ii = 0; ii < this.parties[k]['members'].members.length; ii++) {
        this.parties[k]['members'].members[ii].temp = total_t * (Math.abs(this.parties[k]['members'].members[ii].habit) / total_habit)
      }
      for (let ii = 0; ii < this.parties[k]['members'].generals.length; ii++) {
        this.parties[k]['members'].generals[ii].temp = total_t * (Math.abs(this.parties[k]['members'].generals[ii].habit) / total_habit)
      }
      for (let ii = 0; ii < this.parties[k]['members'].units.length; ii++) {
        this.parties[k]['members'].units[ii].temp = total_t * (Math.abs(this.parties[k]['members'].units[ii].habit) / total_habit)
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
  
  add_party_battle_jobs(job) {
    for (let j in this.parties) {
      for (let k in this.parties[j]['members']) {
        for (let l in this.parties[j]['members'][k]) {
          if (!this.parties[j]['members'][k][l]['jobs'].length || (this.parties[j]['members'][k][l]['jobs'].length && this.parties[j]['members'][k][l]['jobs'][0].id != 'battle')) {
            this.parties[j]['members'][k][l]['jobs'].splice(0, 0, job)
          }
        }
      }
    }
  }
  
  add_battle_jobs(job) {
    this.add_party_battle_jobs(job)
    
    for (let j in this.units.members) {
      if (!this.units.members[j]['jobs'].length || (this.units.members[j]['jobs'].length && this.units.members[j]['jobs'][0].id != 'battle')) {
        this.units.members[j]['jobs'].splice(0, 0, job)
      }
    }
    for (let j in this.units.civilians) {
      if (!this.units.civilians[j]['jobs'].length || (this.units.civilians[j]['jobs'].length && this.units.civilians[j]['jobs'][0].id != 'battle')) {
        this.units.civilians[j]['jobs'].splice(0, 0, job)
      }
    }
  }
  
  remove_jobs() {
    for (let j in this.parties) {
      for (let k in this.parties[j]['members']) {
        for (let l in this.parties[j]['members'][k]) {
          if (this.parties[j]['members'][k][l]['jobs'].length && this.parties[j]['members'][k][l]['jobs'][0].id == 'battle') {
            this.parties[j]['members'][k][l]['jobs'].splice(0, 1)
          }
        }
      }
    }
    for (let j in this.units.members) {
      if (this.units.members[j]['jobs'].length && this.units.members[j]['jobs'][0].id == 'battle') {
        this.units.members[j]['jobs'].splice(0, 1)
      }
    }
    for (let j in this.units.civilians) {
      if (this.units.civilians[j]['jobs'].length && this.units.civilians[j]['jobs'][0].id == 'battle') {
        this.units.civilians[j]['jobs'].splice(0, 1)
      }
    }
  }
  
  update_units_jobs(units) {
    let movers = []
    let remove_idxs = []
    
    for (let i in units) {
      let unit = units[i]
      if (unit.jobs.length) {
        switch (unit['jobs'][0].id) {
          case 'battle':
            unit.progresso()
            if (unit['jobs'][0].index == unit['jobs'][0].enemies.length) {
              let item = unit['jobs'][0].reward_item()
              unit.inventory.add_item(item, 1)
              unit['jobs'].splice(0, 1)
              
              this.remove_jobs()
            }
            break
          case 'build':
            if (this.check_progress('build')) {
              unit['jobs'][0] = this.find_progress('build')
            }
            this.build_road(unit)
            break
          case 'move':
            unit.progresso()
            if (unit.task_done()) {
              let x = unit['jobs'][0].x
              let y = unit['jobs'][0].y
              
              unit['jobs'].splice(0, 1)
              
              remove_idxs.push(i)
              movers.push([x, y, unit])
            }
            break
        }
      }
    }
    
    remove_idxs.sort(function(a, b) { return parseInt(b) - parseInt(a) })
    for (let i in remove_idxs) {
      units.splice(remove_idxs[i], 1)
    }
    
    return movers
  }
}

class Economy {
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
      if (parseFloat(Math.abs(my_dir - dirs[i]).toFixed(3)) <= Math.PI/8) {
        return [i, Math.sqrt(summationx**2 + summationy**2)]
      }
    }
  }
  
  update(x, y) {
    this.state[x][y] += 1
  }
}

class World {
  constructor(size, unit_count) {
    this.size = size
    this.unit_count = unit_count
    this.economy = new Economy(size)
    this.party_ids = []
    
    this.surface = []
    for (let i = 0; i < size; i++) {
      this.surface.push([])
      
      for (let j = 0; j < size; j++) {
        this.surface[this.surface.length - 1].push(new Arena(unit_count))
      }
    }
  }
  
  // Class copy from stackoverflow given current ES6 standards
  funcopy(myclass) {
    return Object.assign(Object.create(Object.getPrototypeOf(myclass)), myclass)
  }
  
  path(start, goal) {
    let paths = []
    let to_visit = []

    let my_x = start[0]
    let my_y = start[1]

    function resetTileProps(_tiles, pos) {
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

    let tiles = []
    for (let i = 0; i < C_TILES; i++) {
      tiles.push([])
      for (let j = 0; j < C_TILES; j++) {
        tiles[tiles.length - 1].push([])
      }
    }

    tiles = resetTileProps(tiles, [my_x, my_y])

    let x = start[0]
    let y = start[1]

    while(paths.length == 0) {
      let arr = [[x, y + 1], [x - 1, y], [x + 1, y], [x, y - 1]]

      for (let i=0; i<arr.length; i++) {
        let subsequent = [parseInt(arr[i][0]), parseInt(arr[i][1])]
        
        if(subsequent[0] >= 0 && subsequent[1] >= 0 && subsequent[0] < C_TILES && subsequent[1] < C_TILES) {

          if(JSON.stringify(subsequent) == JSON.stringify(goal)) {
            if(JSON.stringify([x, y]) != JSON.stringify(start)) {
              tiles[subsequent[0]][subsequent[1]].prev = [x, y]
            }

            tiles[subsequent[0]][subsequent[1]].visited = true

            let path = []
            if(typeof(tiles[subsequent[0]][subsequent[1]].prev) != 'undefined') {
              while(typeof(tiles[subsequent[0]][subsequent[1]].prev) != 'undefined') {
                let old_x = subsequent[0]
                let old_y = subsequent[1]
                
                subsequent = tiles[subsequent[0]][subsequent[1]].prev
                path.push([old_x, old_y])
              }
              path.push(subsequent)
            } else {
              path.push(subsequent)
            }
            paths.push(path)
          } else if (tiles[subsequent[0]][subsequent[1]].visited == false) {
            if(JSON.stringify([x, y]) != JSON.stringify(start)) {
              tiles[subsequent[0]][subsequent[1]].prev = [x, y]
            }

            let tile_score = 1
            if (this.surface[subsequent[0]][subsequent[1]].road == true) {
              tile_score = .45
            }
            tiles[subsequent[0]][subsequent[1]].visited = true
            tiles[subsequent[0]][subsequent[1]].score = tiles[x][y].score + tile_score
            to_visit.push({x: subsequent[0], y: subsequent[1], score: tiles[x][y].score + tile_score})
          }
        }
      }

      to_visit = to_visit.sort(function(a, b) { return b.score - a.score })
      let coords = to_visit.pop()

      if (typeof(coords) == 'undefined') {
        return
      }

      x = coords.x
      y = coords.y
    }
    
    let path_job = []
    while (paths[0].length) {
      let p = paths[0].pop()
      if (this.surface[p[0]][p[1]].road) {
        path_job.push(new MoveJob(p[0], p[1], ROAD_MOD))
      } else {
        path_job.push(new MoveJob(p[0], p[1], 1))
      }
    }
    return path_job
  }
  
  update_arena_economy(god, x, y) {
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
    arenas = center_arena.add_history(arenas, god)
    
    // Reads all history entries and returns a ( hist.length, 8 ) array
    let instructs = center_arena.hist.read_long_history()
    
    let [idx, mag] = this.economy.std_dir_idx(instructs)
    
    if (mag > 1) {
      this.economy.update(x + Math.round(Math.cos(dirs[idx])), y - Math.round(Math.sin(dirs[idx])))
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
    let movers = this.surface[x][y].update_units_jobs(this.surface[x][y].units.civilians)
    
    if (movers.length) {
      for (let i = 0; i < movers.length; i++) {
        if (this.surface[movers[i][0]][movers[i][1]].check_progress('battle')) {
          movers[i][2]['jobs'][0] = this.surface[movers[i][0]][movers[i][1]].find_progress('battle')
        } else {
          if (Math.random() < .25) {
            let job = new BattleJob(movers[i][0], movers[i][1], this.surface[movers[i][0]][movers[i][1]].biome)
            movers[i][2]['jobs'].splice(0, 0, job)
            this.surface[movers[i][0]][movers[i][1]].add_battle_jobs(job)
          }
        }
        this.surface[movers[i][0]][movers[i][1]].units.civilians.push(movers[i][2])
      }
    }
    
    movers = this.surface[x][y].update_units_jobs(this.surface[x][y].units.members)
    if (movers.length) {
      for (let i = 0; i < movers.length; i++) {
        if (this.surface[movers[i][0]][movers[i][1]].check_progress('battle')) {
          movers[i][2]['jobs'][0] = this.surface[movers[i][0]][movers[i][1]].find_progress('battle')
        } else {
          if (Math.random() < .25) {
            let job = new BattleJob(movers[i][0], movers[i][1], this.surface[movers[i][0]][movers[i][1]].biome)
            movers[i][2]['jobs'].splice(0, 0, job)
            this.surface[movers[i][0]][movers[i][1]].add_battle_jobs(job)
          }
        }
        this.surface[movers[i][0]][movers[i][1]].units.members.push(movers[i][2])
      }
    }
  }
  
  update_party_jobs(party) {
    for (let k in party['members']) {
      let movers = this.surface[party.x][party.y].update_units_jobs(party['members'][k])
      if (movers.length) {
        party['members'][k].push(movers[0][2])
        this.move_party(party, movers[0][0], movers[0][1])
        if (this.surface[movers[0][0]][movers[0][1]].check_progress('battle')) {
          this.surface[movers[0][0]][movers[0][1]].add_party_battle_jobs(this.surface[movers[0][0]][movers[0][1]].find_progress('battle'))
        } else {
          if (Math.random() < .25) {
            let job = new BattleJob(movers[0][0], movers[0][1], this.surface[movers[0][0]][movers[0][1]].biome)
            movers[0][2]['jobs'].splice(0, 0, job)
            this.surface[movers[0][0]][movers[0][1]].add_party_battle_jobs(job)
          }
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
}

// The whole game: God balances generals against the economy
// Theoretical considerations:
//  How goes adding new units/generals
//  Do we even need generals
//  Are the mathematics general enough

// How do we add generals

// Consider the following:
// move_units(x,y) considers a general in the (x, y) arena and surround arenas
// the general considers the 8 arenas octile the center for avg temperature
// each of the 8 arenas is incremented based on the general's hypothesis of history[-1]
// ??? the [center arena/economy] is updated based on the whole of the arena's history ???

// 1. General reading of 1-history -> returns value
// 2. Redistribute temperatures
// 3. Increment exvar based on clipping based on value
// 4. Change opacity based on 10-history
// and somehow the general's reading matters

// Generals lift resources and communicate with the player. 
// The player furnishes equipment out of the resources and
// oversees operations on the ground

// Might implement skills that are basically buffs