const utilsFind = require('utils.find');

const loopStats = {

    run: function() {
        Memory.stats = {
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
      const stores = room.find(FIND_STRUCTURES, {
          filter: s => s.structureType === STRUCTURE_CONTAINER || s.structureType === STRUCTURE_STORAGE
      });
      const enemies = room.find(FIND_HOSTILE_CREEPS);

      const droppedResources = room.find(FIND_DROPPED_RESOURCES);

      return {
        spawnEnergy: _.sum(spawnStructures, s => s.energy),
        storedEnergy: _.sum(stores, s => s.store.energy),
        droppedEnergy: _.sum(droppedResources, r => r.amount),
        numEnemies: Object.keys(enemies).length
      };
    }
};

module.exports = loopStats;
