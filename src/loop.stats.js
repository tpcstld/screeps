const utilsFind = require('utils.find');

const loopStats = {

    run: function() {
        const containers = utilsFind.findInEveryRoom(FIND_STRUCTURES, {
            filter: s => s.structureType === STRUCTURE_CONTAINER
        });

        Memory.stats = {
          storedEnergy: _.sum(containers, s => s.store.energy),
          cpu: {
            bucket: Game.cpu.bucket,
            used: Game.cpu.getUsed()
          },
          gcl: Game.gcl,
          creeps: {
            roles: _.countBy(Game.creeps, c => c.memory.role)
          },
          rooms: _.mapValues(Game.rooms, r => this.getStatsForRoom(r))
        };
    },

    getStatsForRoom: function(room) {
      const spawnStructures = room.find(FIND_STRUCTURES, {
          filter: s => s.structureType === STRUCTURE_EXTENSION || s.structureType === STRUCTURE_SPAWN
      });

      return {
        spawnEnergy: _.sum(spawnStructures, s => s.energy)
      };
    }
};

module.exports = loopStats;
