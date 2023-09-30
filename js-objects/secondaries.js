var components = {
  'plank': { value: 8, make: function(res, inventory, unit) { if (res[0] == 'wood' && res[1] >= 3) { inventory.add_item('plank', Math.floor(res[1] / 3)); unit.inventory.remove_item(res[0], Math.floor(res[1] / 3) * 3) } }, check: function(item) { if (item == 'wood') { return true } else { return false } } },
  'nail': { value: 2, make: function(res, inventory, unit) { if (res[0] in ['iron', 'bone', 'bronze'] && res[1] >= 3) { inventory.add_item('nail', Math.floor(res[1])); unit.inventory.remove_item(res[0], Math.floor(res[1] / 3) * 3) } }, check: function(item) { if (item in ['iron', 'bone', 'bronze']) { return true } else { return false } } },
  'block': { value: 5, make: function(res, inventory, unit) { if (res[0] == 'rock' && res[1] >= 3) { inventory.add_item('block', Math.floor(res[1] / 3)); unit.inventory.remove_item(res[0], Math.floor(res[1] / 3) * 3) } }, check: function(item) { if (item == 'rock') { return true } else { return false } } },
  'bundle': { value: 2, make: function(res, inventory, unit) { if (res[0] == 'grass' && res[1] >= 3) { inventory.add_item('bundle', Math.floor(res[1] / 3)); unit.inventory.remove_item(res[0], Math.floor(res[1] / 3) * 3) } }, check: function(item) { if (item == 'grass') { return true } else { return false } } },
  'seed bag': { value: 10, make: function(res, inventory, unit) { if (res[0] == 'seed' && res[1] >= 5) { inventory.add_item('seed bag', Math.floor(res[1] / 5)); unit.inventory.remove_item(res[0], Math.floor(res[1] / 5) * 5) } }, check: function(item) { if (item == 'seed') { return true } else { return false } } },
  'fabric': { value: 3, make: function(res,inventory, unit) { if (res[0] == 'silk' && res[1] >= 2) { inventory.add_item('fabric', Math.floor(res[1] / 2)); unit.inventory.remove_item(res[0], Math.floor(res[1] / 2) * 2) } }, check: function(item) { if (item == 'silk') { return true } else { return false } } },
  'leather': { value: 4, make: function(res, inventory, unit) { if (res[0] == 'fur' && res[1] >= 2) { inventory.add_item('leather', Math.floor(res[1] / 2)); unit.inventory.remove_item(res[0], Math.floor(res[1] / 2) * 2) } }, check: function(item) { if (item == 'fur') { return true } else { return false } } },
  'glass': { value: 4, make: function(res, inventory, unit) { if (res[0] == 'sand' && res[1] >= 4) { inventory.add_item('glass', Math.floor(res[1] / 4)); unit.inventory.remove_item(res[0], Math.floor(res[1] / 4) * 4) } }, check: function(item) { if (item == 'sand') { return true } else { return false } } },
  'jewelry': { value: 10, make: function(res, inventory, unit) { if (res[0] == 'jewels' && res[1] >= 3) { inventory.add_item('jewelry', Math.floor(res[1] / 3)); unit.inventory.remove_item(res[0], Math.floor(res[1] / 3) * 3) } }, check: function(item) { if (item == 'jewels') { return true } else { return false } } },
  'book': { value: 50, make: function(res, inventory, unit) { if (res[0] == 'paper' && res[1] >= 5) { inventory.add_item('book', Math.floor(res[1] / 5)); unit.inventory.remove_item(res[0], Math.floor(res[1] / 5) * 5) } }, check: function(item) { if (item == 'paper') { return true } else { return false } } }
}

function make(name, reqs, inventory) {
  let req_tags = Object.keys(reqs)
  let reqsCount = 0
  let items = Object.keys(inventory.items)
  for (let i of items) {
    if (req_tags.includes(i)) {
      if (reqs[i] <= inventory['items'][i]) {
        reqsCount += 1
      }
    }
  }
  if (reqsCount == req_tags.length) {
    for (let i of req_tags) {
      inventory.remove_item(i, reqs[i])
    }
    inventory.add_item(name, 1)
  }
}

function check(reqs, inventory) {
  reqs = Object.keys(reqs)
  let reqsCount = 0
  let items = Object.keys(inventory.items)
  for (let i of items) {
    if (reqs.includes(i)) {
      reqsCount += 1
    }
  }
  if (reqsCount == reqs.length) {
    return true
  } else {
    return false
  }
}

var technology = {
  'woodworking': {
    'bow': { 
      value: 5,
      requirements: {'plank': 1, 'string': 2}
    },
    'wooden ring': { 
      value: 5,
      requirements: {'plank': 2, 'jewelry': 1}
    },
    'carriage': { 
      value: 25,
      requirements: {'plank': 10, 'bundle': 2, 'fabric': 2, 'nail': 2}
    },
    'book': { 
      value: 15,
      requirements: {'page': 10}
    },
    'farm': { 
      value: 50,
      requirements: {'plank': 4, 'bundle': 4, 'seed bag': 2},
      begin: function() {
        return {'inventory': new Inventory(5, 1), 'progress': new Job(100)}
      },
      cycle: function() {
        this.details.progress.progresso(10)
        if (this.details.progress.progress == this.details.progress.max) {
          this.details.inventory.add_item('vegetable', 1)
          this.details.progress = new Job(100)
        }
      },
      crossed: function(inventory) {
        for (let i = Object.keys(this.details.inventory.items).length - 1; i >= 0; i--) {
          let item = Object.keys(this.details.inventory.items)[i]
          inventory.add_item(item, this.details.inventory.items[item])
          this.details.inventory.remove_item(item, this.details.inventory.items[item])
        }
      }
    },
    'fishing hut': { 
      value: 50,
      requirements: {'plank': 8, 'string': 2, 'block': 1},
      begin: function() {
        return {'inventory': new Inventory(10, 1)}
      },
      crossed: function(inventory) {
        if (inventory.items['worm']) {
          this.details.inventory.add_item('fish', inventory.items['fish'])
          inventory.remove_item('fish', inventory.items['fish'])
        } else {
          inventory.add_item('fish', this.details.inventory['fish'])
          this.details.inventory.remove_item('fish', tihs.details.inventory['fish'])
        }
      }
    },
    'zoo': { 
      value: 100,
      requirements: {'plank': 25, 'glass': 25, 'nail': 5}
    },
    'seed generator': { 
      value: 50,
      job: new Job(100),
      complete: function(inventory) {
        inventory.add_item('seed', 1)
      },
      requirements: {'seed bag': 5, 'glass': 10, 'plank': 10}
    },
    'paper generator': { 
      value: 100,
      job: new Job(100),
      complete: function(inventory) {
        inventory.add_item('paper', 1)
      },
      requirements: {'book': 5, 'glass': 10, 'plank': 10}
    }
  },
  'stoneworking': {
    'civilian idol': { 
      value: 1,
      requirements: {'block': 1}
    },
    'statue': { 
      value: 50,
      requirements: {'block': 50}
    },
    'sphinx': { 
      value: 100,
      requirements: {'block': 100}
    },
    'henge': { 
      value: 200,
      requirements: {'block': 200}
    },
    'sand generator': { 
      job: new Job(100),
      complete: function(inventory) {
        inventory.add_item('sand', 1)
      },
      value: 50,
      requirements: {'glass': 10, 'block': 5}
    }
  },
  'clothier': {
    'leather helm': { 
      value: 8,
      requirements: {'leather': 1, 'string': 1}
    },
    'leather torso': { 
      value: 20,
      requirements: {'leather': 5, 'string': 2}
    },
    'leather chaps': { 
      value: 15,
      requirements: {'leather': 3, 'string': 2}
    },
    'fur generator': { 
      value: 100,
      job: new Job(100),
      complete: function(inventory) {
        inventory.add_item('fur', 1)
      },
      requirements: {'leather': 10, 'glass': 5}
    }
  },
  'crafting': {
    'sling': { 
      value: 10,
      requirements: {'fabric': 2, 'leather': 1}
    },
    'bone helm': { 
      value: 15,
      requirements: {'bone': 3, 'jewelry': 2}
    },
    'basket': { 
      value: 5,
      requirements: {'bundle': 5}
    },
    'chisel': { 
      value: 5,
      requirements: {'glass': 1}
    },
    'scarecrow': { 
      value: 20,
      requirements: {'bundle': 2, 'string': 3, 'fabric': 3},
      begin: function() {
        let NUM_PARTS = 150
        let radius = 5
        
        radii = [0]
        polars = [-Math.PI]
        for (let i = 0; i < NUM_PARTS; i++) {
          radii.push(radii[radii.length - 1] + radius / NUM_PARTS)
          polars.push(polars[polars.length - 1] + 2 * Math.PI / NUM_PARTS)
        }
        for (let i = 0; i < NUM_PARTS; i++) {
          for (let j = 0; j < NUM_PARTS; j++) {
            let x = Math.floor(radii[i] * Math.cos(polars[j]))
            let y = Math.floor(radii[i] * Math.sin(polars[j]))
            
            world.surface[parseInt(this.x) + x][parseInt(this.y) + y].battleChance = .5
          }
        }
      }
    },
    'wood generator': { 
      value: 50,
      job: new Job(100),
      complete: function(inventory) {
        inventory.add_item('wood', 1)
      },
      requirements: {'plank': 15, 'glass': 10}
    },
    'rock generator': { 
      value: 50,
      job: new Job(100),
      complete: function(inventory) {
        inventory.add_item('rock', 1)
      },
      requirements: {'glass': 10, 'block': 10}
    }
  },
  'outdoors': {
    "rabbit's foot": { 
      value: 10,
      requirements: {'rabbit': 1, 'string': 1}
    },
    'sleeping bag': { 
      value: 30,
      requirements: {'bundle': 3, 'fabric': 3}
    },
    'lure': { 
      value: 15,
      requirements: {'jewelry': 1, 'string': 2}
    },
    'scanner': { 
      value: 50,
      requirements: {'block': 1, 'jewelry': 2, 'glass': 1}
    },
    'attractive totem': { 
      value: 25,
      requirements: {'plank': 5, 'fish': 5, 'string': 2},
      begin: function() {
        let NUM_PARTS = 150
        let radius = 5
        
        radii = [0]
        polars = [-Math.PI]
        for (let i = 0; i < NUM_PARTS; i++) {
          radii.push(radii[radii.length - 1] + radius / NUM_PARTS)
          polars.push(polars[polars.length - 1] + 2 * Math.PI / NUM_PARTS)
        }
        for (let i = 0; i < NUM_PARTS; i++) {
          for (let j = 0; j < NUM_PARTS; j++) {
            let x = Math.floor(radii[i] * Math.cos(polars[j]))
            let y = Math.floor(radii[i] * Math.sin(polars[j]))
            
            if (world.surface.check_civ(x, y) || world.surface.check_members(x, y) || (x == troupes[0].x && y == troupes[0].y)) {
              world.surface[x][y].attractionChance = .1
            }
          }
        }
      }
    }
  },
  'alchemy': {
    'crystal': { 
      value: 15,
      requirements: {'jewelry': 2, 'block': 2}
    },
    'staff': { 
      value: 5,
      requirements: {'plank': 1, 'glass': 2}
    },
    'minor attack potion': { 
      value: 5,
      requirements: {'book': 1, 'jewelry': 2}
    },
    'minor defence potion': { 
      value: 5,
      requirements: {'leather': 1, 'jewelry': 2}
    }
  }
}

var enchantments = {
  'hp': { value: 10, odds: 5 },
  'attk': { value: 15, odds: 5 },
  'def': { value: 10, odds: 5 }
}

var reinforcements = {
  'scrap': { value: 10, odds: 10 },
  'patch': { value: 25, odds: 5 },
  'chrome': { value: 50, odds: 2 },
  'nanotubes': { value: 100, odds: 1 }
}