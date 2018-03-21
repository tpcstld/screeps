const utilsHarvest = require('utils.harvest');

var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var state = creep.memory.state || 'gather';

        if (state == 'gather') {
            const nearbyLinks = creep.pos.findInRange(FIND_STRUCTURES, 1, {
                s => s.structureType == STRUCTURE_LINK
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
            creep.upgradeController(creep.room.controller);
            creep.travelTo(creep.room.controller, {
                stuckValue: 8
            });

            if (creep.carry.energy == 0) {
                state = 'gather';
            }
        }
        creep.memory.state = state;
    }
};

module.exports = roleUpgrader;
