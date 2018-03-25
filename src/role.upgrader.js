const utilsHarvest = require('utils.harvest');

var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var state = creep.memory.state || 'gather';

        if (state == 'gather') {
            const nearbyLinks = creep.pos.findInRange(FIND_STRUCTURES, 1, {
                filter: s => s.structureType == STRUCTURE_LINK
            });
            if (nearbyLinks.length > 0) {
                creep.withdraw(nearbyLinks[0], RESOURCE_ENERGY);
            } else {
                utilsHarvest.getEnergyFromContainers(creep);
            }

            if (creep.carry.energy >= creep.carryCapacity) {
                state = 'upgrade';
            }
        }
        if (state == 'upgrade') {
          const home = Game.getObjectById(creep.memory.home);
          const controller = home.room.controller;
          if (creep.upgradeController(controller) == ERR_NOT_IN_RANGE) {
            creep.travelTo(controller);
          }

          if (creep.carry.energy == 0) {
              state = 'gather';
          }
        }
        creep.memory.state = state;
    }
};

module.exports = roleUpgrader;
