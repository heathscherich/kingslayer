var equipment = {
  "find": function(query) {
    let my_equip = false
    
    for (let i of ['low', 'mid', 'high']) {
      for (let j of ['weapons', 'armor']) {
        for (let k of ['melee', 'range', 'magic', 'head', 'torso', 'legs']) {
          if (equipment[i][j][k] && Object.keys(equipment[i][j][k]).includes(query)) {
            my_equip = equipment[i][j][k][query]
          }
        }
      }
    }
    return my_equip
  },
  "low": {
    "weapons": {
      "melee": {
        "shortsword": {
          value: 5,
          attk: 9.6,
          skill: 30
        },
        "dagger": {
          value: 5,
          attk: 5,
          skill: 45
        },
        "sickle": {
          value: 5,
          attk: 5,
          skill: 30
        }
      },
      "range": {
        "shortbow": {
          value: 5,
          attk: 2.5,
          skill: 100
        },
        "sling": {
          value: 5,
          attk: 2.5,
          skill: 80
        }
      },
      "magic": {
        "staff": {
          value: 5,
          attk: 6.25,
          skill: 50.5
        },
        "crystal": {
          value: 5,
          attk: 10,
          skill: 30
        }
      }
    },
    "armor": {
      "head": {
        "leather helm": {
          value: 5,
          defence: 5
        },
        "baseball cap": {
          value: 5,
          defence: 2
        }
      },
      "torso": {
        "leather torso": {
          value: 5,
          defence: 10
        },
        "bandolier": {
          value: 5,
          defence: 5
        }
      },
      "legs": {
        "leather chaps": {
          value: 5,
          defence: 10
        }
      },
      "rings": {
        "wooden ring": {
          value: 5,
          skill: 100
        }
      }
    }
  },
  "mid": {
    "weapons": {
      "melee": {
        "longsword": {
          value: 10,
          attk: 110,
          skill: 35
        },
        "glaive": {
          value: 10,
          attk: 200,
          skill: 20
        },
        "cutlass": {
          value: 10,
          attk: 100,
          skill: 50
        }
      },
      "range": {
        "longbow": {
          value: 10,
          attk: 30,
          skill: 200
        },
        "smolbow": {
          value: 10,
          attk: 35,
          skill: 200
        },
        "hand crossbow": {
          value: 10,
          attk: 45,
          skill: 150
        }
      },
      "magic": {
        "battlestaff": {
          value: 10,
          attk: 70,
          skill: 75.5
        },
        "catalyst": {
          value: 10,
          attk: 100,
          skill: 100
        },
        "imbued book": {
          value: 10,
          attk: 100,
          skill: 80
        }
      }
    },
    "armor": {
      "head": {
        "med helm": {
          value: 10,
          defence: 25
        },
        "bone helm": {
          value: 10,
          defence: 30
        }
      },
      "torso": {
        "chain torso": {
          value: 10,
          defence: 35
        }
      },
      "legs": {
        "chainskirt": {
          value: 10,
          defence: 30
        }
      },
      "rings": {
        "iron ring": {
          value: 10,
          type: "ring"
        }
      }
    }
  },
  "high": {
    "weapons": {
      "melee": {
        "greatsword": {
          value: 15,
          attk: 1500,
          skill: 40
        },
        "trident": {
          value: 15,
          attk: 1200,
          skill: 240
        },
        "dusters": {
          value: 15,
          attk: 1500,
          skill: 100
        }
      },
      "range": {
        "greatbow": {
          value: 15,
          attk: 550,
          skill: 300.5
        },
        "polaris crossbow": {
          value: 15,
          attk: 650,
          skill: 150
        },
        "hand harpoon": {
          value: 15,
          attk: 500,
          skill: 50
        }
      },
      "magic": {
        "tome": {
          value: 15,
          attk: 375,
          skill: 75
        },
        "wand": {
          value: 15,
          attk: 450,
          skill: 100
        }
      }
    },
    "armor": {
      "head": {
        "full helm": {
          value: 15,
          defence: 75
        }
      },
      "torso": {
        "platebody": {
          value: 15,
          defence: 90
        }
      },
      "legs": {
        "platelegs": {
          value: 15,
          defence: 80
        }
      },
      "rings": {
        "gold ring": {
          value: 15,
          type: "ring"
        }
      }
    }
  }
}