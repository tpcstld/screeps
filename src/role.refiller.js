const utilsHarvest = require('utils.harvest');
const utilsEnergy = require('utils.energy');
const utilsLoad = require('utils.load');
const constants = require('utils.constants');


let roleRefiller = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if (creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
        }
        if (!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
            creep.memory.building = true;
        }

        if (creep.memory.building) {
            if (!utilsEnergy.maybeRefillEnergy(creep)) {
                creep.idle();
            }
        } else {
          if (utilsHarvest.getEnergyFromContainers(creep, true)) {
              return;
          }

          let target = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {
              filter: r => r.amount >= 40
          });
          if (target) {
            if (creep.pickup(target) == ERR_NOT_IN_RANGE) {
                creep.travelTo(target);
            }
            return;
          }

          creep.idle();
        }
    }
};

module.exports = roleRefiller;
