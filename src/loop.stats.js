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
          memory: {
            used: RawMemory.get().length
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

      const droppedResources = room.find(FIND_DROPPED_RESOURCES);

      return {
        spawnEnergy: _.sum(spawnStructures, s => s.energy),
        droppedEnergy: _.sum(droppedResources, r => r.amount),
      };
    }
};

module.exports = loopStats;
