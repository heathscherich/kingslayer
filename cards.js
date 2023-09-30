function string_id(k, v) {
  if (v.length) {
    let str = ''
    for (let i = 0; i < v.length; i++) {
      str += v[i].id + ': ' + v[i].x + ',' + v[i].y + ' '
    }
    return str
  } else {
    return v
  }
}

function string_type(k, v) {
  if (typeof(v) == 'object') {
    let str = ''
    let ks = Object.keys(v)
    for (let i = 0; i < ks.length; i++) {
      str += ks[i] + ': ' + v[ks[i]].length + ' '
    }
    return str
  } else {
    return ''
  }
}

function assign_jobs(id, number) {
  for (let i = 0; i < troupes.length; i++) {
    if (troupes[i].id == id) {
      troupe = troupes[i]
      let jobs = troupe['members']['generals'][0]['jobs']
      
      has_build = false
      for (job of jobs) {
        if (job.id == 'build') {
          has_build = true
        }
      }
      
      if (jobs.length) {
        troupe['members']['generals'][0]['jobs'] = []
        let l = troupe['members']['members'].length
        let num_members = number
        if (number > l) {
          num_members = l
        }
        for (let i = 0; i < num_members; i++) {
          jobs.forEach(function(a) {
            if(a.id == 'move') {
              troupe['members']['members'][l - i - 1]['jobs'].push(a)
            } else {
              troupe['members']['members'][l - i - 1]['jobs'].push(a)
            }
          })
        }
        for (let i = 0; i < num_members; i++) {
          let unit = troupe['members']['members'].pop()
          world.surface[troupe.x][troupe.y].units['members'].push(unit)
        }
        if (number > l && !has_build) {
          let c = troupe['members']['civilians'].length
          let num_civs = number - num_members
          
          if (num_civs > c) {
            num_civs = c
          }
          for (let i = 0; i < num_civs; i++) {
            jobs.forEach(function(a) {
              if(a.id == 'move') {
                troupe['members']['civilians'][c - i - 1]['jobs'].push(a)
              } else {
                troupe['members']['civilians'][c - i - 1]['jobs'].push(a)
              }
            })
          }
          for (let i = 0; i < num_civs; i++) {
            let unit = troupe['members']['civilians'].pop()
            world.surface[troupe.x][troupe.y].units['civilians'].push(unit)
          }
        }
      }
    }
  }
  draw_map_view()
}

function change_modifier(id) {
  for (let i = 0; i < troupes.length; i++) {
    if (troupes[i].id == id) {
      troupes[i].increase_modifier()
    }
  }
  document.getElementById('view-cards').innerHTML = make_arena_view()
}

function raiseUnit(id, x, y, loc, affil) {
  let units = world.surface[x][y]['units']['civilians'].concat(world.surface[x][y]['units']['members'])
  
  let unit = units.splice(loc, 1)
  unit[0]['jobs'] = world.surface[x][y]['parties'][id]['members']['generals'][0]['jobs']
  
  world.surface[x][y].parties[id]['members'][affil.toLowerCase() + 's'].push(unit[0])
  
  for (let i = 0; i < world.surface[x][y]['units']['civilians'].length; i++) {
    if (JSON.stringify(world.surface[x][y]['units']['civilians'][i]) == JSON.stringify(unit[0])) {
      world.surface[x][y]['units']['civilians'].splice(i, 1)
    }
  }
  for (let i = 0; i < world.surface[x][y]['units']['members'].length; i++) {
    if (JSON.stringify(world.surface[x][y]['units']['members'][i]) == JSON.stringify(unit[0])) {
      world.surface[x][y]['units']['members'].splice(i, 1)
    }
  }
  
  draw_map_view()
}

function materialize(item, idx) {
  let units = troupes[0]['members']['generals'].concat(troupes[0]['members']['civilians']).concat(troupes[0]['members']['members'])
  let comp = false
  let my_keys = Object.keys(components)
  for (let i = 0; i < my_keys.length; i++) {
    if (components[my_keys[i]].check(item, units[idx]['inventory']['items'][item])) {
      components[my_keys[i]].make([item, units[idx]['inventory']['items'][item]], you['inventory'], units[idx])
      comp = true
    }
  }
  if (comp) {
    console.log(item)
  } else {
    units[idx]['inventory'].remove_item(item, 1)
    let value = scanFilesForValue(item) * 10
    creationPoints += value
  }
  
  document.getElementById('view-cards').innerHTML = make_arena_view()
}

function exchange() {
  troupePoints += Math.floor(creationPoints / 100)
  creationPoints -= Math.floor(creationPoints / 100) * 100
  
  document.getElementById('view-cards').innerHTML = make_creation_view()
}

function draw_map_view() {
  function calculate_width(troupe) {
    if (troupe.members.generals[0].jobs.length) {
      return 250 * (troupe.members.generals[0].jobs[0].progress / troupe.members.generals[0].jobs[0].max )
    } else {
      return 0
    }
  }
  function calculate_width2(troupe) {
    if (troupe.members.generals[0].jobs.length) {
      return 250 * (troupe['members']['generals'][0]['jobs'][0].enemies[troupe['members']['generals'][0]['jobs'][0].index].health / troupe['members']['generals'][0]['jobs'][0].enemies[troupe['members']['generals'][0]['jobs'][0].index].maxhealth)
    } else {
      return 0
    }
  }
  function calculate_width3(troupe) {
    let units = troupe['members']['civilians'].concat(troupe['members']['members']).concat(troupe['members']['generals'][0])
    if (units.length) {
      return 250 * (units[0].health / 100)
    } else {
      return 250
    }
  }
  
  let html = '<div style="display: inline-flex"><div><button id="build-button" onclick="build_button()">Build</button></div>'
  html += '</div></div>'
  for (let i = 0; i < troupes.length; i++) {
    if (i % 2 == 0) {
      html += '<div class="card-row">'
    }
    if (troupes[i]['members']['generals'][0]['jobs'].length && troupes[i]['members']['generals'][0]['jobs'][0].id == 'battle') {
      html += '<div class="general-card">' + 
                  '<div><div>Lv.' + troupes[i]['members']['generals'][0]['jobs'][0].level + ' (' + (troupes[i]['members']['generals'][0]['jobs'][0].index + 1) + '/' + troupes[i]['members']['generals'][0]['jobs'][0].enemies.length + ') ' + troupes[i]['members']['generals'][0]['jobs'][0].enemies[troupes[i]['members']['generals'][0]['jobs'][0].index].name[0].toUpperCase() + troupes[i]['members']['generals'][0]['jobs'][0].enemies[troupes[i]['members']['generals'][0]['jobs'][0].index].name.slice(1) + '</div>' + 
                  '<div style="display: flex">' + 
                  '<div><div style="background-color: black; width: 250px; height: 2px; margin: 0 auto;"><div style="color: white; height: 20px; width: ' + calculate_width(troupes[i]) + 'px;"><div style="margin-left: 4px; background-color: darkgray; height: 2px;"></div></div></div><div style="background-color: black; width: 250px; margin: 0 auto;"><div style="color: white; height: 20px; width: ' + calculate_width2(troupes[i]) + 'px;"><div style="margin-left: 4px; background-color: darkred; white-space: nowrap;">Enemy Health</div></div></div></div>' +
                  '<div><div style="background-color: black; width: 250px; margin: 0 auto;"><div style="color: white; height: 20px; width: ' + calculate_width3(troupes[i]) + 'px;"><div style="margin-left: 4px; background-color: darkgray;">Progress</div></div></div></div>' +
                  '</div></div></div>'
    } else {
      html += '<div class="general-card">' + 
                  '<div>'
                  if (troupes[i]['members']['generals'][0]['jobs'].length) {
                    html += '<div class="jobs-text" onclick="clear_jobs(' + troupes[i].id + ')">Current Job: ' + troupes[i]['members']['generals'][0]['jobs'][0].id + ' ' + troupes[i]['members']['generals'][0]['jobs'][0].x + ',' + troupes[i]['members']['generals'][0]['jobs'][0].y + '</div>'
                  }
                  html += '<div class="jobs-text" onclick="clear_jobs(' + troupes[i].id + ')">Job List: ' + JSON.stringify(troupes[i]['members']['generals'][0]['jobs'].slice(1), string_id) + '</div></div>' +
                  '<div><div style="background-color: black; width: 250px; margin: 0 auto;"><div style="background-color: darkgray; color: white; height: 20px; width: ' + calculate_width(troupes[i]) + ';"><div style="margin-left: 4px; background-color: darkgray;">Progress</div></div></div></div>' +
                  '<div style="display: flex">' + 
                  '<div style="margin-top: 12px; display: flex; flex-direction: column;">'
                  for (let j = -MAPY; j <= MAPY; j++) {
                    html += '<div style="display: inline-flex;">'
                    for (let k = -MAPX; k <= MAPX; k++) {
                      html += '<div class="mapTile" style="height: 14px; width: 14px;" id="' + troupes[i].id + ',' + (troupes[i].x + k) + ',' + (troupes[i].y + j) + '" onclick="fillPath(' + (troupes[i].x + k) + ',' + (troupes[i].y + j) + ',' + troupes[i].id + ')"></div>'
                    }
                    html += '</div>'
                  }
                  html += '<div style="margin: 12 0 0 12; display: flex; flex-direction: row-reverse;">' +
                  '<div><div><button class="crudbutton" onclick="raise_to_party(' + troupes[i].id + ')">Raise Unit</button></div><button class="crudbutton" onclick="raise_civilian(' + troupes[i].id + ')">Raise Civilian</button></div>' +
                  '</div><div style="display: flex; flex-direction: row-reverse;"><button class="crudbutton" onclick="return_to_base(' + troupes[i].id + ')">Return</button></div></div>' +
                  '</div></div>' +
                  '</div>'
    }
    if (i % 2 == 1) {
      html += '</div>'
    }
  }
  
  document.getElementById("kings-cards").innerHTML = html
  
  if (troupes[0].x != places['base'][0] || troupes[0].y != places['base'][1]) {
    creationMenu = false
  }
  if (creationMenu == true) {
    document.getElementById('view-cards').innerHTML = make_creation_view()
  } else {
    document.getElementById('view-cards').innerHTML = make_arena_view()
  }
  
  if (building_flag) {
    document.getElementById('build-button').style.backgroundColor = 'black'
  } else {
    document.getElementById('build-button').style.backgroundColor = 'grey'
  }
  
  
  if (building_flag) {
    document.getElementById('build-button').style.backgroundColor = 'black'
  } else {
    document.getElementById('build-button').style.backgroundColor = 'gray'
  }
  
  let max = 0
  for (let ii = 0; ii < world.height[0].length; ii++) {
    for (let jj = 0; jj < world.height[0].length; jj++) {
      if (Math.abs(world.height[ii][jj]) > max) {
        max = Math.abs(world.height[ii][jj])
      }
    }
  }
  
  for (let i in troupes) {
    if (!troupes[i]['members']['generals'][0]['jobs'].length || (troupes[i]['members']['generals'][0]['jobs'].length && troupes[i]['members']['generals'][0]['jobs'][0].id != 'battle')) {
      for (let j = -MAPY; j <= MAPY; j++) {
        for (let k = -MAPX; k <= MAPX; k++) {
          if (troupes[i].x + k >= 0 && troupes[i].x + k < C_TILES && troupes[i].y + j >= 0 && troupes[i].y + j < C_TILES) {
            if (k != 0 || j != 0) {
              let obf = (world.height[troupes[i].x + k][troupes[i].y + j] - world.height[troupes[i].x][troupes[i].y]) / max * 5
              if (world.surface[troupes[i].x + k][troupes[i].y + j].road) {
                document.getElementById(troupes[i].id + ',' + (troupes[i].x + k) + ',' + (troupes[i]. y + j)).style.backgroundColor = '#888888'
              } else {
                if (world.surface[troupes[i].x + k][troupes[i].y + j].biome == 'desert') {
                  document.getElementById(troupes[i].id + ',' + (troupes[i].x + k) + ',' + (troupes[i].y + j)).style.backgroundColor = '#ccff00'
                } else if (world.surface[troupes[i].x + k][troupes[i].y + j].biome == 'jungle') {
                  document.getElementById(troupes[i].id + ',' + (troupes[i].x + k) + ',' + (troupes[i].y + j)).style.backgroundColor = '#009900'
                } else if (world.surface[troupes[i].x + k][troupes[i].y + j].biome == 'city') {
                  document.getElementById(troupes[i].id + ',' + (troupes[i].x + k) + ',' + (troupes[i].y + j)).style.backgroundColor = '#cccccc'
                } else if (world.surface[troupes[i].x + k][troupes[i].y + j].biome == 'water') {
                  document.getElementById(troupes[i].id + ',' + (troupes[i].x + k) + ',' + (troupes[i].y + j)).style.backgroundColor = '#0000ff'
                }                    
              }
              if (world.check_civ(troupes[i].x + k, troupes[i].y + j) || world.check_member(troupes[i].x + k, troupes[i].y + j)) {
                document.getElementById(troupes[i].id + ',' + (troupes[i].x + k) + ',' + (troupes[i].y + j)).style.backgroundColor = '#ffff00'
              }
              document.getElementById(troupes[i].id + ',' + (troupes[i].x + k) + ',' + (troupes[i].y + j)).style.filter = 'brightness(' + (50 + obf * 10) + '%)'
            } else {
              document.getElementById(troupes[i].id + ',' + (troupes[i].x + k) + ',' + (troupes[i].y + j)).style.backgroundColor = '#000000'
            }
          }
        }
      }
    }
  }
}

var showSkillsMenu = false
function flipShowSkillsMenu() {
  showSkillsMenu = !showSkillsMenu
  if (showSkillsMenu) {
    make_skills_view()
  } else {
    draw_map_view()
  }
}

var listener = []
function chooseArena(skill, tech) {
  let req_tags = Object.keys(technology[skill][tech].requirements)
  for (let i of req_tags) {
    you['inventory'].remove_item(i, technology[skill][tech]['requirements'][i])
  }
  
  let tiles = document.getElementsByClassName('mapTile')
  flipShowSkillsMenu()
  for (let i = 0; i < tiles.length; i++) {
    l = tiles[i].addEventListener('click', function(e) {
      [id, x, y] = this.id.split(',')
      let spec = technology[skill][tech]
      
      if (!world.surface[x][y].superstructure) {
        world.surface[x][y].superstructure = new Superstructure(x, y, spec['begin'], spec['cycle'], spec['crossed'])
        for (let i = 0; i < listener.length; i++) {
          removeEventListener('click', listener[i])
        }
      }
    })
    listener.push(l)
  }
}

function makeTech(skill, tech) {
  if (check(technology[skill][tech].requirements, you['inventory'])) {
    let html = ''
    if (technology[skill][tech].hasOwnProperty('begin') || technology[skill][tech].hasOwnProperty('cycle') || technology[skill][tech].hasOwnProperty('crossed')) {
      html += '<div><button class="crudButton" onclick="chooseArena(\'' + skill + '\',\'' + tech + '\')">Place</button></div>'
    } else {
      make(tech, technology[skill][tech].requirements, you['inventory'])
    }
    document.getElementById('view-cards').innerHTML = make_creation_view()
    document.getElementById('skillMenu').innerHTML += html
  }
}

function showTechDetails(skill, tech) {
  let t = technology[skill][tech]
  let details = t.requirements
  
  let html = '<div><div style="color: white; margin-left: 32px; margin-bottom: 42px;"><h1 style="margin-bottom: 12px;">' + tech[0].toUpperCase() + tech.substr(1) + '</h1>'
  for (let i of Object.keys(details)) {
    html += '<div style="padding-left: 24px; font-size: 16px;">' +
              details[i] + ' ' + i[0].toUpperCase() + i.substr(1) + 
              '</div>'
  }
  html += '</div><div><button class="crudButton" onclick="makeTech(\'' + skill + '\',\'' + tech + '\')">Make</button></div></div>'
  
  make_skills_view()
  document.getElementById('skillMenu').innerHTML += html
}

var skillChoice = ''
function make_skillChoice(skill) {
  skillChoice = skill
  
  make_skills_view()
}

function make_skills_view() {
  let elm = document.getElementById('kings-cards')
  let html = '<div style="display: flex; flex-direction: row-reverse;"><button class="crudButton2" style="height: 36px; width: 36px;" onclick="flipShowSkillsMenu();">X</button></div>'
  html += '<div><div style="display: inline-block;"><h1 style="color: white;">Exploration Tree</h1></div><br><div id="skills-menu" style="display: inline-block"><button class="crudButton" onclick="make_skillChoice(\'woodworking\')">Woodworking</button><button class="crudButton" onclick="make_skillChoice(\'stoneworking\')">Stoneworking</button><button class="crudButton" onclick="make_skillChoice(\'clothier\')">Clothier</button><button class="crudButton" onclick="make_skillChoice(\'crafting\')">Crafting</button><button class="crudButton" onclick="make_skillChoice(\'outdoors\')">Outdoors</button><button class="crudButton" onclick="make_skillChoice(\'alchemy\')">Alchemy</button></div></div>'
  
  let counter = 0
  if (skillChoice.length) {
    html += '<div id="skillMenu" style="display: inline-flex"><div>'
    for (let i of Object.keys(technology[skillChoice])) {
      if (counter % 3 == 0) {
        html += '<div>'
      }
      html += '<button class="crudButton" onclick="showTechDetails(\'' + skillChoice + '\',\'' + i + '\')">' + i[0].toUpperCase() + i.substr(1) + '</button>'
      if ((counter + 1) % 3 == 0) {
        html += '</div>'
      }
      counter += 1
    }
    html += '</div></div>'
  }
  
  elm.innerHTML = html
}

function make_arena_view() {
  let troupe = troupes[0]
  var view = '<div>' +
    '<div style="outline: 2px; outline-offset: 12px; color: white;">' + 
      '<h1 style="width: 400px; text-align: center;">This Arena</h1>' +
      '<div style="margin: 24px;">' +
      '<h2>Units</h2><div style="display: inline-flex">'
      let units = world.surface[troupe.x][troupe.y]['units']['civilians'].concat(world.surface[troupe.x][troupe.y]['units']['members'])
      for (i = 0; i < units.length; i++) {
        view += '<div style="height: 100px; width: 80px; border: 1px solid black; padding: 8px; margin: 0 8px;" onclick="raiseUnit(' + troupe.id + ',' + troupe.x + ',' + troupe.y + ',' + i + ',\'' + units[i].constructor.name + '\')"><div>XP ' + units[i].xp.toFixed(0) + '</div><div>HP ' + units[i].health.toFixed(0) + '</div></div>'
      }
      view += '</div>' +
      '<div class="stripes"><div style="display: inline-flex;"><h2>Troupe</h2>'
      
      if (troupe['members']['civilians'].length || troupe['members']['members'].length) {
        view += '<div class="assignButton"><button class="crudbutton" style="width: 92px" onclick="assign_jobs(' + troupe.id + ',' + modifiers[troupe.modifier_idx] + ')">Assign</button><button class="crudbutton modifierButton" onclick="change_modifier(' + troupe.id + ')">' + modifiers[troupe.modifier_idx] + '</button></div>'
      }
      view += '</div>'
      for (let i of Object.keys(troupe['members'])) {
        view += '<div>' + troupe['members'][i].length + ' ' + i + '</div>'
      }
      view += '</div>' +
      '<div class="stripes"><h2>Items [' + troupe['members']['generals'][0].inventory.capacity + ', ' + troupe['members']['generals'][0].inventory.size + ']</h2>'
      for (let idx = 0; idx < troupe['members']['generals'].concat(troupe['members']['civilians']).concat(troupe['members']['members']).length; idx++) {
        let unit = troupe['members']['generals'].concat(troupe['members']['civilians']).concat(troupe['members']['members'])[idx]
        for (let item of Object.keys(unit['inventory']['items'])) { 
          view += '<div style="display: inline-flex; width: 100%;">' + unit['inventory']['items'][item] + ' ' + item
          if (troupe.x == places['base'][0] && troupe.y == places['base'][1]) {
            view += '<div style="margin-left: auto;"><button style="border: 1px solid black; height: 20px; width: 20px;" onclick="materialize(\'' + item + '\',' + idx + ')">-</button></div></div>'
          } else {
            view += '</div>'
          }
        }
        view += '<hr>'
      }
      view += '</div></div>' +
        '</div>' +
        '</div>'
        
    
    if (troupes[0].x == places['base'][0] && troupes[0].y == places['base'][1]) {
      view += '<div style="display: flex; flex-direction: row-reverse; margin-top: auto;"><button class="crudButton" onclick="flipCreationMenu()">Creation</button></div>'
    }
  
  return view
}

creationMenu = false
function flipCreationMenu() {
  creationMenu = !creationMenu
  if (creationMenu) {
    document.getElementById('view-cards').innerHTML = make_creation_view()
  } else {
    document.getElementById('view-cards').innerHTML = make_arena_view()
  }
}
function send(item) {
  let units = troupes[0]['members']['generals'][0].concat(troupes[0]['members']['civilians']).concat(troupes[0]['members']['members'])
  
  for (let unit of units) {
    let success = unit['inventory'].add_item(item, 1)
    if (success) {
      you['inventory'].remove_item(item, 1)
    }
  }
  document.getElementById('view-cards').innerHTML = make_creation_view()
}
function make_creation_view() {
  var view = '<div>' +
    '<div style="display: flex; font-size: 32px; color: white;"><div>' + creationPoints + '</div><div style="margin-left: auto;">' + troupePoints + '</div></div>' +
    '<div style="display: flex; font-size: 32px; color: white;"><div>Creation</div><div style="padding-left: 64px;"><button class="crudbutton2" style="margin-right: 64px;" onclick="exchange()">></button style="margin-right: 64px;">Troupe Points</div></div>' +
    '<div class="stripes" style="color: white"><h1>Items</h1>'
    
    for (let item of Object.keys(you['inventory']['items'])) {
      if (tradeable.includes(item)) {
        view += '<div style="display: inline-flex; width: 100%;"><div>' + you['inventory']['items'][item] + ' ' + item +'</div><div style="margin-left: auto;"><button style="border: 1px solid black; height: 20px; width: 20px;" onclick="send(\'' + item + '\')">-</button></div></div>'
      } else {
        view += '<div style="width: 100%;">' + you['inventory']['items'][item] + ' ' + item +'</div>'
      }
    }
    view += '</div></div><div style="display: flex; flex-direction: row;"><button class="crudbutton" style="margin-left: auto;" onclick="flipShowSkillsMenu()">Upgrades</button><button class="crudButton" onclick="flipCreationMenu()">Arena Menu</button></div>'
    '</div>'
    
  return view
}