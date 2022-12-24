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
        'planks': resources.planks.jungle,
        'honey': resources.honey.jungle,
        'silk': resources.silk.jungle,
        'mushroom': resources.mushroom.jungle,
        'paper': resources.paper.jungle,
        'books': resources.books.jungle
      },
      rare: {
        'relics': resources.relics.jungle,
        'paper': resources.paper.jungle,
        'plastic': resources.plastic.jungle,
        'fruits': resources.fruits.jungle,
        'vegetables': resources.vegetables.jungle,
        'obsidian': resources.obsidian.jungle,
        'lava': resources.lava.jungle,
        'jewels': resources.jewels.jungle,
        'glass': resources.glass.jungle,
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
        'planks': resources.planks.city,
        'jewels': resources.jewels.city,
        'coal': resources.coal.city,
        'polyester': resources.polyester.city,
        'paper': resources.paper.city,
        'books': resources.books.city
      },
      rare: {
        'relics': resources.relics.city,
        'paper': resources.paper.city,
        'plastic': resources.plastic.city,
        'fruits': resources.fruits.city,
        'mushroom': resources.mushroom.city,
        'batteries': resources.batteries.city,
        'vegetables': resources.vegetables.city,
        'obsidian': resources.obsidian.city,
        'lava': resources.lava.city,
        'jewels': resources.jewels.city,
        'glass': resources.glass.city,
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
        'glass': resources.glass.city,
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
      rare: {
        'relics': resources.relics.ocean,
        'paper': resources.paper.ocean,
        'plastic': resources.plastic.ocean,
        'vegetables': resources.vegetables.ocean,
        'obsidian': resources.obsidian.ocean,
        'lava': resources.lava.ocean,
        'jewels': resources.jewels.ocean,
        'glass': resources.glass.ocean,
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