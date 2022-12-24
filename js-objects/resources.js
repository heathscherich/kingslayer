var resources = {
  dirt: { ocean: { value: 5, odds: 1 }, desert: { value: 5, odds: 1 }, jungle: { value: 5, odds: 5 }, city: { value: 5, odds: 3 } },
  grass: { ocean: { value: 5, odds: 1 }, desert: { value: 5, odds: 0 }, jungle: { value: 5, odds: 5 }, city: { value: 5, odds: 3 } },
  seed: { ocean: { value: 5, odds: 1 }, desert: { value: 5, odds: 1 }, jungle: { value: 5, odds: 5 }, city: { value: 5, odds: 2 } },
  wood: { ocean: { value: 5, odds: 2 }, desert: { value: 5, odds: 1 }, jungle: { value: 5, odds: 5 }, city: { value: 5, odds: 2 } },
  planks: { ocean: { value: 5, odds: 2 }, desert: { value: 5, odds: 0 }, jungle: { value: 5, odds: 1 }, city: { value: 5, odds: 2 } },
  rock: { ocean: { value: 5, odds: 4 }, desert: { value: 5, odds: 2 }, jungle: { value: 5, odds: 2 }, city: { value: 5, odds: 1 } },
  honey: { ocean: { value: 5, odds: 0 }, desert: { value: 5, odds: 0 }, jungle: { value: 5, odds: 5 }, city: { value: 5, odds: 0 } },
  copper: { ocean: { value: 5, odds: 0 }, desert: { value: 5, odds: 5 }, jungle: { value: 5, odds: 1 }, city: { value: 5, odds: 2 } },
  iron: { ocean: { value: 5, odds: 3 }, desert: { value: 5, odds: 0 }, jungle: { value: 5, odds: 0 }, city: { value: 5, odds: 5 } },
  tin: { ocean: { value: 5, odds: 3 }, desert: { value: 5, odds: 5 }, jungle: { value: 5, odds: 0 }, city: { value: 5, odds: 0 } },
  coal: { ocean: { value: 5, odds: 2 }, desert: { value: 5, odds: 2 }, jungle: { value: 5, odds: 5 }, city: { value: 5, odds: 4 } },
  silver: { ocean: { value: 5, odds: 3 }, desert: { value: 5, odds: 1 }, jungle: { value: 5, odds: 4 }, city: { value: 5, odds: 1 } },
  gold: { ocean: { value: 5, odds: 3 }, desert: { value: 5, odds: 0 }, jungle: { value: 5, odds: 3 }, city: { value: 5, odds: 3 } },
  water: { ocean: { value: 5, odds: 10 }, desert: { value: 5, odds: 0 }, jungle: { value: 5, odds: 5 }, city: { value: 5, odds: 3 } },
  polyester: { ocean: { value: 5, odds: 1 }, desert: { value: 5, odds: 0 }, jungle: { value: 5, odds: 0 }, city: { value: 5, odds: 5 } },
  silk: { ocean: { value: 5, odds: 0 }, desert: { value: 5, odds: 0 }, jungle: { value: 5, odds: 3 }, city: { value: 5, odds: 3 } },
  sand: { ocean: { value: 5, odds: 5 }, desert: { value: 5, odds: 10 }, jungle: { value: 5, odds: 2 }, city: { value: 5, odds: 0 } },
  glass: { ocean: { value: 5, odds: 3 }, desert: { value: 5, odds: 0 }, jungle: { value: 5, odds: 2 }, city: { value: 5, odds: 2 } },
  jewels: { ocean: { value: 5, odds: 5 }, desert: { value: 5, odds: 5 }, jungle: { value: 5, odds: 5 }, city: { value: 5, odds: 3 } },
  lava: { ocean: { value: 5, odds: 1 }, desert: { value: 5, odds: 0 }, jungle: { value: 5, odds: 3 }, city: { value: 5, odds: 0 } },
  obsidian: { ocean: { value: 5, odds: 2 }, desert: { value: 5, odds: 1 }, jungle: { value: 5, odds: 1 }, city: { value: 5, odds: 0 } },
  fruits: { ocean: { value: 5, odds: 0 }, desert: { value: 5, odds: 2 }, jungle: { value: 5, odds: 5 }, city: { value: 5, odds: 5 } },
  vegetables: { ocean: { value: 5, odds: 5 }, desert: { value: 5, odds: 5 }, jungle: { value: 5, odds: 5 }, city: { value: 5, odds: 5 } },
  mushroom: { ocean: { value: 5, odds: 0 }, desert: { value: 5, odds: 0 }, jungle: { value: 5, odds: 1 }, city: { value: 5, odds: 1 } },
  meat: { ocean: { value: 5, odds: 5 }, desert: { value: 5, odds: 5 }, jungle: { value: 5, odds: 5 }, city: { value: 5, odds: 5 } },
  fur: { ocean: { value: 5, odds: 1 }, desert: { value: 5, odds: 3 }, jungle: { value: 5, odds: 5 }, city: { value: 5, odds: 0 } },
  leather: { ocean: { value: 5, odds: 0 }, desert: { value: 5, odds: 5 }, jungle: { value: 5, odds: 5 }, city: { value: 5, odds: 0 } },
  batteries: { ocean: { value: 5, odds: 0 }, desert: { value: 5, odds: 0 }, jungle: { value: 5, odds: 0 }, city: { value: 5, odds: 10 } },
  plastic: { ocean: { value: 5, odds: 2 }, desert: { value: 5, odds: 0 }, jungle: { value: 5, odds: 0 }, city: { value: 5, odds: 5 } },
  paper: { ocean: { value: 5, odds: 1 }, desert: { value: 5, odds: 0 }, jungle: { value: 5, odds: 1 }, city: { value: 5, odds: 3 } },
  books: { ocean: { value: 5, odds: 0 }, desert: { value: 5, odds: 0 }, jungle: { value: 5, odds: 2 }, city: { value: 5, odds: 5 } },
  bone: { ocean: { value: 5, odds: 1 }, desert: { value: 5, odds: 1 }, jungle: { value: 5, odds: 1 }, city: { value: 5, odds: 1 } },
  vine: { ocean: { value: 5, odds: 0 }, desert: { value: 5, odds: 5 }, jungle: { value: 5, odds: 5 }, city: { value: 5, odds: 3 } },
  relics: { ocean: { value: 5, odds: 5 }, desert: { value: 5, odds: 5 }, jungle: { value: 5, odds: 5 }, city: { value: 5, odds: 0 } }
}