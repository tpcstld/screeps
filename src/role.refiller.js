const utilsHarvest = require('utils.harvest');
const utilsEnergy = require('utils.energy');
const utilsLoad = require('utils.load');
const constants = require('utils.constants');


let roleRefiller = {

    /** @param {Creep} creep **/
    run: function(creep) {

      if (creep.goHomeRoom()) {
        return;
      }

      if (creep.memory.working && creep.carry.energy < 50) {
          creep.memory.working = false;
      }
      if (!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
          creep.memory.working = true;
      }

      if (creep.memory.working) {
          if (!utilsEnergy.maybeRefillEnergy(creep)) {
              creep.idle();
          }
      } else {
        if (utilsHarvest.getEnergyFromContainers(creep, true)) {
            return;
        }

        creep.idle();
      }
    }
};

module.exports = roleRefiller;
