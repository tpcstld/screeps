const utilsHarvest = require('utils.harvest');

var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var state = creep.memory.state || 'gather';

        if (state == 'gather') {
            utilsHarvest.getEnergyFromContainers(creep);
            if (creep.carry.energy >= creep.carryCapacity) {
                state = 'upgrade';
            }
        }
        if (state == 'upgrade') {
            creep.upgradeController(creep.room.controller);
            creep.travelTo(creep.room.controller);
            if (creep.carry.energy == 0) {
                state = 'gather';
            }
        }
        creep.memory.state = state;
    }
};

module.exports = roleUpgrader;
