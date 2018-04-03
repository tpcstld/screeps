const utilsHarvest = require('utils.harvest');
const constants = require('utils.constants');
const utilsLoad = require('utils.load');
const utilsFind = require('utils.find');

const roleRepairer = {

  getNeed: function(creep, needs) {
    const target = creep.memory.target;

    if (!creep.memory.working) {
      return null;
    }

    if (target) {
      return _.filter(needs, n => n.type == "repair" && n.target == target)[0];
    }

    const need = _.filter(needs, n => n.type == "repair")[0];
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

    if (!creep.memory.working) {
      utilsHarvest.getEnergyFromContainers(creep);
    }

    const target = Game.getObjectById(creep.memory.target);
    if (!target) {
      creep.memory.target = null;
      creep.idle();
      return;
    }

    const maxHp = constants.MAX_HP[target.structureType] || target.hitsMax;
    if (target.hits >= maxHp) {
      creep.memory.target = null;
      return;
    }

    if (creep.repair(target) == ERR_NOT_IN_RANGE) {
      creep.travelTo(target);
    }
  }
};

module.exports = roleRepairer;
