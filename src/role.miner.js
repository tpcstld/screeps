let utilsHarvest = require('utils.harvest');

let roleMiner = {

    /** @param {Creep} creep **/
    run: function(creep) {
        utilsHarvest.harvestRandom(creep, 1);

        const nearbySources = creep.pos.findInRange(FIND_SOURCES, 1);
        const nearbyContainers = creep.pos.findInRange(FIND_STRUCTURES, 0, {
            filter: s => s.structureType === STRUCTURE_CONTAINER
        });
        if (nearbySources.length > 0 && nearbyContainers.length === 0) {
            const nearbyContainers = creep.pos.findInRange(FIND_STRUCTURES, 1, {
                filter: s => s.structureType === STRUCTURE_CONTAINER
            });
            if (nearbyContainers.length > 0) {
                creep.travelTo(nearbyContainers[0]);
            }
        }
    }
};

module.exports = roleMiner;
