const utilsFind = require('utils.find');

const loopStats = {

    run: function() {
        const containers = utilsFind.findInEveryRoom(FIND_STRUCTURES, {
            filter: s => s.structureType === STRUCTURE_CONTAINER
        });

        Memory.stats = {
          storedEnergy: _.sum(containers, s => s.store.energy),
          cpu: Game.cpu,
          gcl: Game.gcl,
        };
    }
};

module.exports = loopStats;
