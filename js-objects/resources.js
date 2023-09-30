var resources = {
  dirt: { ocean: { value: 1, odds: 1 }, desert: { value: 1, odds: 1 }, jungle: { value: 1, odds: 5 }, city: { value: 1, odds: 3 } },
  grass: { ocean: { value: 2, odds: 1 }, desert: { value: 2, odds: 0 }, jungle: { value: 2, odds: 5 }, city: { value: 2, odds: 3 } },
  seed: { ocean: { value: 5, odds: 1 }, desert: { value: 5, odds: 1 }, jungle: { value: 5, odds: 5 }, city: { value: 5, odds: 2 } },
  wood: { ocean: { value: 4, odds: 2 }, desert: { value: 4, odds: 1 }, jungle: { value: 4, odds: 5 }, city: { value: 4, odds: 2 } },
  rock: { ocean: { value: 2, odds: 4 }, desert: { value: 2, odds: 2 }, jungle: { value: 2, odds: 2 }, city: { value: 2, odds: 1 } },
  honey: { ocean: { value: 4, odds: 0 }, desert: { value: 4, odds: 0 }, jungle: { value: 4, odds: 5 }, city: { value: 4, odds: 0 } },
  copper: { ocean: { value: 9, odds: 0 }, desert: { value: 9, odds: 5 }, jungle: { value: 9, odds: 1 }, city: { value: 9, odds: 2 } },
  iron: { ocean: { value: 9, odds: 3 }, desert: { value: 9, odds: 0 }, jungle: { value: 9, odds: 0 }, city: { value: 9, odds: 5 } },
  tin: { ocean: { value: 5, odds: 3 }, desert: { value: 5, odds: 5 }, jungle: { value: 5, odds: 0 }, city: { value: 5, odds: 0 } },
  coal: { ocean: { value: 9, odds: 2 }, desert: { value: 9, odds: 2 }, jungle: { value: 9, odds: 5 }, city: { value: 9, odds: 4 } },
  silver: { ocean: { value: 9, odds: 3 }, desert: { value: 9, odds: 1 }, jungle: { value: 9, odds: 4 }, city: { value: 9, odds: 1 } },
  gold: { ocean: { value: 9, odds: 3 }, desert: { value: 9, odds: 0 }, jungle: { value: 9, odds: 3 }, city: { value: 9, odds: 3 } },
  water: { ocean: { value: 4, odds: 10 }, desert: { value: 4, odds: 0 }, jungle: { value: 4, odds: 5 }, city: { value: 4, odds: 3 } },
  string: { ocean: { value: 2, odds: 2 }, desert: { value: 2, odds: 4 }, jungle: { value: 2, odds: 1 }, city: { value: 2, odds: 0 } },
  polyester: { ocean: { value: 6, odds: 1 }, desert: { value: 6, odds: 0 }, jungle: { value: 6, odds: 0 }, city: { value: 6, odds: 5 } },
  silk: { ocean: { value: 7, odds: 0 }, desert: { value: 7, odds: 0 }, jungle: { value: 7, odds: 3 }, city: { value: 7, odds: 3 } },
  sand: { ocean: { value: 2, odds: 5 }, desert: { value: 2, odds: 10 }, jungle: { value: 2, odds: 2 }, city: { value: 2, odds: 0 } },
  glass: { ocean: { value: 4, odds: 3 }, desert: { value: 4, odds: 0 }, jungle: { value: 4, odds: 2 }, city: { value: 4, odds: 2 } },
  jewels: { ocean: { value: 9, odds: 5 }, desert: { value: 9, odds: 5 }, jungle: { value: 9, odds: 5 }, city: { value: 9, odds: 3 } },
  obsidian: { ocean: { value: 9, odds: 2 }, desert: { value: 9, odds: 1 }, jungle: { value: 9, odds: 1 }, city: { value: 9, odds: 0 } },
  fruits: { ocean: { value: 5, odds: 0 }, desert: { value: 5, odds: 2 }, jungle: { value: 5, odds: 5 }, city: { value: 5, odds: 5 } },
  vegetables: { ocean: { value: 5, odds: 5 }, desert: { value: 5, odds: 5 }, jungle: { value: 5, odds: 5 }, city: { value: 5, odds: 5 } },
  mushroom: { ocean: { value: 5, odds: 0 }, desert: { value: 5, odds: 0 }, jungle: { value: 5, odds: 1 }, city: { value: 5, odds: 1 } },
  meat: { ocean: { value: 5, odds: 5 }, desert: { value: 5, odds: 5 }, jungle: { value: 5, odds: 5 }, city: { value: 5, odds: 5 } },
  fur: { ocean: { value: 5, odds: 1 }, desert: { value: 5, odds: 3 }, jungle: { value: 5, odds: 5 }, city: { value: 5, odds: 0 } },
  leather: { ocean: { value: 7, odds: 0 }, desert: { value: 7, odds: 5 }, jungle: { value: 7, odds: 5 }, city: { value: 7, odds: 0 } },
  batteries: { ocean: { value: 7, odds: 0 }, desert: { value: 7, odds: 0 }, jungle: { value: 7, odds: 0 }, city: { value: 7, odds: 10 } },
  plastic: { ocean: { value: 7, odds: 2 }, desert: { value: 7, odds: 0 }, jungle: { value: 7, odds: 0 }, city: { value: 7, odds: 5 } },
  paper: { ocean: { value: 8, odds: 1 }, desert: { value: 8, odds: 0 }, jungle: { value: 8, odds: 1 }, city: { value: 8, odds: 3 } },
  bone: { ocean: { value: 5, odds: 1 }, desert: { value: 5, odds: 1 }, jungle: { value: 5, odds: 1 }, city: { value: 5, odds: 1 } },
  vine: { ocean: { value: 2, odds: 0 }, desert: { value: 2, odds: 5 }, jungle: { value: 2, odds: 5 }, city: { value: 2, odds: 3 } },
  relics: { ocean: { value: 9, odds: 5 }, desert: { value: 9, odds: 5 }, jungle: { value: 9, odds: 5 }, city: { value: 9, odds: 0 } }
}