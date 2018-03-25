let utilsHarvest = require('utils.harvest');

let roleMiner = {

    /** @param {Creep} creep **/
    run: function(creep) {
        const source = utilsHarvest.harvestRandom(creep, 1);

        const containers = source.pos.findInRange(FIND_STRUCTURES, 1, {
            filter: s => s.structureType === STRUCTURE_CONTAINER
        });
        if (containers.length > 0) {
          const container = containers[0];
          if (!creep.pos.isEqualTo(container.pos)) {
            creep.travelTo(container);
          }
        }
    }
};

module.exports = roleMiner;
