const utilsHarvest = require('utils.harvest');

let roleBuilder = {

  getNeed: function(creep, needs) {
    const target = creep.memory.target;

    if (!creep.memory.working) {
      return null;
    }

    if (target) {
      return _.filter(needs, n => n.type == "build" && n.target == target)[0];
    }

    const need = _.filter(needs, n => n.type == "build")[0];
    if (need) {
      creep.memory.target = need.target;
    }
    return need;
  },

  run: function(creep, need) {
    if (creep.memory.working && creep.carry.energy == 0) {
      creep.memory.target = null;
      creep.memory.working = false;
    }
    if (!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
      creep.memory.working = true;
    }

    if (creep.memory.working) {
      const target = Game.getObjectById(creep.memory.target);
      if (!target) {
        creep.memory.target = null;
        return;
      }

      if (creep.build(target) == ERR_NOT_IN_RANGE) {
        creep.travelTo(target);
      }
    } else {
      const spawnConstruction = creep.room.find(FIND_CONSTRUCTION_SITES, {
        filter: c => c.structureType == STRUCTURE_SPAWN
      })[0];
      if (spawnConstruction) {
        utilsHarvest.harvestRandom(creep, 5);
      } else {
        if (!utilsHarvest.getEnergyFromContainers(creep)) {
            creep.idle();
        }
      }
    }
  }
};

module.exports = roleBuilder;
