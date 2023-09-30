function extend(A, B) {
  for (let key of Object.keys(B)) {
    if (!Object.keys(A).includes(key)) {
      A[key] = B[key]
    }
  }
  return A
}

var biomes = {
  desert: {
    enemies: {
      "jackal": enemies.jackal,
      "camel": enemies.camel,
      "swarm": enemies.swarm,
      "snake": enemies.snake,
      "giant scorpion": enemies['giant scorpion']
    },
    tables: {
      monster: {
        'fur': resources.fur.desert,
        'meat': resources.meat.desert,
        'jewels': resources.jewels.desert,
        'bone': resources.bone.desert
      },
      trap: {
        'salamander': { 'value': 15, 'odds': 10},
        'snake': {'value': 30, 'odds': 5}
      },
      equipment: {
        'low': {
          'sling': extend(equipment.low.weapons.range['sling'], { odds: 5 }),
          'staff': extend(equipment.low.weapons.magic['staff'], { odds: 5 }),
          'baseball cap': extend(equipment.low.armor.head['baseball cap'], { odds: 5 }),
          'leather torso': extend(equipment.low.armor.torso['leather torso'], { odds: 5 })
        },
        'mid': {
          'longbow': extend(equipment.mid.weapons.range['longbow'], { odds: 3 }),
          'cutlass': extend(equipment.mid.weapons.melee['cutlass'], { odds: 3 }),
          'bone helmet': extend(equipment.mid.armor.head['bone helm'], { odds: 3 }),
          'chain torso': extend(equipment.mid.armor.torso['chain torso'], { odds: 3 })
        },
        'high': {
          'tome': extend(equipment.high.weapons.magic['tome'], { odds: 2 }),
          'full helm': extend(equipment.high.armor.head['full helm'], { odds: 2 }),
          'platebody': extend(equipment.high.armor.torso['platebody'], { odds: 2 })
        }
      },
      reinforcements: reinforcements,
      rare: {
        'relics': resources.relics.desert,
        'vegetables': resources.vegetables.desert,
        'fruits': resources.fruits.desert,
        'obsidian': resources.obsidian.desert,
        'jewels': resources.jewels.desert,
        'tin': resources.tin.desert,
        'copper': resources.copper.desert,
        'coal': resources.coal.desert,
        'silver': resources.silver.desert,
        'iron': resources.iron.desert
      },
      standard: {
        'dirt': resources.dirt.desert,
        'seed': resources.seed.desert,
        'wood': resources.wood.desert,
        'rock': resources.rock.desert,
        'sand': resources.sand.desert
      }
    }
  },
  jungle: {
    enemies: {
      "gorilla": enemies.gorilla,
      "buzzard": enemies.buzzard,
      "mosquito": enemies.mosquito,
      "deer": enemies.deer,
      "leopard": enemies.leopard
    },
    tables: {
      monster: {
        'fur': resources.fur.jungle,
        'meat': resources.meat.jungle,
        'bone': resources.bone.jungle,
        'jewels': resources.polyester.jungle,
        'honey': resources.honey.jungle,
        'silk': resources.silk.jungle,
        'mushroom': resources.mushroom.jungle,
        'paper': resources.paper.jungle
      },
      trap: {
        'spider': { 'value': 15, 'odds': 10},
        'scorpion': {'value': 30, 'odds': 5}
      },
      equipment: {
        'low': {
          'shortsword': extend(equipment.low.weapons.melee['shortsword'], { odds: 5 }),
          'dagger': extend(equipment.low.weapons.melee['dagger'], { odds: 5 }),
          'leather helm': extend(equipment.low.armor.head['leather helm'], { odds: 5 }),
          'leather chaps': extend(equipment.low.armor.legs['leather chaps'], { odds: 5 })
        },
        'mid': {
          'longsword': extend(equipment.mid.weapons.melee['longsword'], { odds: 3 }),
          'cutlass': extend(equipment.mid.weapons.melee['cutlass'], { odds: 3 }),
          'bone helmet': extend(equipment.mid.armor.head['bone helm'], { odds: 3 }),
          'chainskirt': extend(equipment.mid.armor.legs['chainskirt'], { odds: 3 })
        },
        'high': {
          'greatsword': extend(equipment.high.weapons.melee['greatsword'], { odds: 2 }),
          'full helm': extend(equipment.high.armor.head['full helm'], { odds: 2 }),
          'platelegs': extend(equipment.high.armor.legs['platelegs'], { odds: 2 })
        }
      },
      reinforcements: reinforcements,
      rare: {
        'relics': resources.relics.jungle,
        'paper': resources.paper.jungle,
        'plastic': resources.plastic.jungle,
        'fruits': resources.fruits.jungle,
        'vegetables': resources.vegetables.jungle,
        'obsidian': resources.obsidian.jungle,
        'jewels': resources.jewels.jungle,
        'gold': resources.gold.jungle,
        'silver': resources.silver.jungle,
        'coal': resources.coal.jungle,
        'tin': resources.tin.jungle,
        'copper': resources.copper.jungle,
        'iron': resources.iron.jungle
      },
      standard: {
        'dirt': resources.dirt.jungle,
        'grass': resources.grass.jungle,
        'seed': resources.seed.jungle,
        'wood': resources.wood.jungle,
        'rock': resources.rock.jungle,
        'water': resources.water.jungle,
        'sand': resources.sand.jungle
      }
    }
  },
  city: {
    enemies: {
      "dogdroid": enemies.dogdroid,
      "roflcopter": enemies.roflcopter,
      "bionico": enemies.bionico,
      "robocop": enemies.robocop,
      "machina": enemies.machina
    },
    tables: {
      monster: {
        'fur': resources.fur.city,
        'meat': resources.meat.city,
        'bone': resources.bone.city,
        'jewels': resources.jewels.city,
        'coal': resources.coal.city,
        'polyester': resources.polyester.city,
        'paper': resources.paper.city
      },
      trap: {
        'rat': { 'value': 15, 'odds': 10},
        'seagull': {'value': 30, 'odds': 5}
      },
      equipment: {
        'low': {
          'shortbow': extend(equipment.low.weapons.range['shortbow'], { odds: 5 }),
          'crystal': extend(equipment.low.weapons.magic['crystal'], { odds: 5 }),
          'bandolier': extend(equipment.low.armor.torso['bandolier'], { odds: 5 }),
          'leather chaps': extend(equipment.low.armor.legs['leather chaps'], { odds: 5 })
        },
        'mid': {
          'glaive': extend(equipment.mid.weapons.melee['glaive'], { odds: 3 }),
          'hand crossbow': extend(equipment.mid.weapons.range['hand crossbow'], { odds: 3 }),
          'catalyst': extend(equipment.mid.weapons.magic['catalyst'], { odds: 3 }),
          'chainskirt': extend(equipment.mid.armor.legs['chainskirt'], { odds: 3 })
        },
        'high': {
          'hand harpoon': extend(equipment.high.weapons.range['hand harpoon'], { odds: 2 }),
          'full helm': extend(equipment.high.armor.head['full helm'], { odds: 2 }),
          'polaris crossbow': extend(equipment.high.weapons.range['polaris crossbow'], { odds: 2 })
        }
      },
      reinforcements: reinforcements,
      rare: {
        'relics': resources.relics.city,
        'paper': resources.paper.city,
        'plastic': resources.plastic.city,
        'fruits': resources.fruits.city,
        'mushroom': resources.mushroom.city,
        'batteries': resources.batteries.city,
        'vegetables': resources.vegetables.city,
        'obsidian': resources.obsidian.city,
        'jewels': resources.jewels.city,
        'gold': resources.gold.city,
        'copper': resources.copper.city,
        'iron': resources.iron.city
      },
      standard: {
        'dirt': resources.dirt.city,
        'grass': resources.grass.city,
        'seed': resources.seed.city,
        'wood': resources.wood.city,
        'rock': resources.rock.city,
        'water': resources.water.city,
        'plastic': resources.plastic.city,
        'vine': resources.vine.city
      }
    }
  },
  ocean: {
    enemies: {
      'crabs': enemies.crabs,
      'lobsters': enemies.lobsters,
      'snails': enemies.snails,
      'flounder': enemies.flounder,
      'animated coral': enemies['animated coral']
    },
    tables: {
      monster: {
        'fur': resources.fur.ocean,
        'meat': resources.meat.ocean,
        'bone': resources.bone.ocean,
        'silver': resources.silver.ocean,
        'coal': resources.coal.ocean,
        'polyester': resources.polyester.ocean
      },
      trap: {
        'snail': { 'value': 15, 'odds': 10},
        'coral': {'value': 30, 'odds': 5}
      },
      equipment: {
        'low': {
          'shortsword': extend(equipment.low.weapons.melee['shortsword'], { odds: 5 }),
          'sickle': extend(equipment.low.weapons.melee['sickle'], { odds: 5 }),
          'leather helm': extend(equipment.low.armor.head['leather helm'], { odds: 5 }),
          'leather chaps': extend(equipment.low.armor.legs['leather chaps'], { odds: 5 })
        },
        'mid': {
          'smolbow': extend(equipment.mid.weapons.range['smolbow'], { odds: 3 }),
          'imbued book': extend(equipment.mid.weapons.magic['imbued book'], { odds: 3 }),
          'bone helmet': extend(equipment.mid.armor.head['bone helm'], { odds: 3 }),
          'chainskirt': extend(equipment.mid.armor.legs['chainskirt'], { odds: 3 })
        },
        'high': {
          'greatsword': extend(equipment.high.weapons.melee['greatsword'], { odds: 2 }),
          'trident': extend(equipment.high.weapons.melee['trident'], { odds: 2 }),
          'wand': extend(equipment.high.weapons.magic['wand'], { odds: 2 }),
          'platelegs': extend(equipment.high.armor.legs['platelegs'], { odds: 2 })
        }
      },
      reinforcements: reinforcements,
      rare: {
        'relics': resources.relics.ocean,
        'paper': resources.paper.ocean,
        'plastic': resources.plastic.ocean,
        'vegetables': resources.vegetables.ocean,
        'obsidian': resources.obsidian.ocean,
        'jewels': resources.jewels.ocean,
        'gold': resources.gold.ocean,
        'tin': resources.tin.ocean,
        'iron': resources.iron.ocean
      },
      standard: {
        'dirt': resources.dirt.ocean,
        'grass': resources.grass.ocean,
        'seed': resources.seed.ocean,
        'rock': resources.rock.ocean,
        'water': resources.water.ocean,
        'sand': resources.sand.ocean
      }
    }
  }
}