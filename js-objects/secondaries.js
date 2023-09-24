var components = {
  'plank': { value: 8, make: function(res) { if (Object.keys(res)[0] == 'wood') { player.inventory.add_item('plank', Math.floor(res / 3)) } } },
  'nail': { value: 2, make: function(res) { if (Object.keys(res)[0] in ['iron', 'bone', 'bronze']) { player.inventory.add_item('nail', Math.floor(res)) } } },
  'block': { value: 5, make: function(res) { if (Object.keys(res)[0] == 'stone') { player.inventory.add_item('block', Math.floor(res / 3)) } } },
  'bundle': { value: 2, make: function(res) { if (Object.keys(res)[0] == 'grass') { player.inventory.add_item('bundle', Math.floor(res / 3)) } } },
  'seed bag': { value: 10, make: function(res) { if (Object.keys(res)[0] == 'seed') { player.inventory.add_item('seed bag', Math.floor(res / 5)) } } },
  'fabric': { value: 3, make: function(res) { if (Object.keys(res)[0] == 'silk') { player.inventory.add_item('fabric', Math.floor(res / 2)) } } },
  'leather': { value: 4, make: function(res) { if (Object.keys(res)[0] == 'fur') { player.inventory.add_item('leather', Math.floor(res / 2)) } } },
  'glass': { value: 4, make: function(res) { if (Object.keys(res)[0] == 'sand') { player.inventory.add_item('glass', Math.floor(res / 4)) } } },
  'jewelry': { value: 10, make: function(res) { if (Object.keys(res)[0] == 'jewels') { player.inventory.add_item('jewelry', Math.floor(res / 3)) } } },
  'book': { value: 50, make: function(res) { if (Object.keys(res)[0] == 'paper') { player.inventory.add_item('book', Math.floor(res / 5)) } } }
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