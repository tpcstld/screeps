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
      const storages = room.find(FIND_STRUCTURES, {
          filter: s => s.structureType === STRUCTURE_STORAGE
      });
      const containers = room.find(FIND_STRUCTURES, {
          filter: s => s.structureType === STRUCTURE_CONTAINER
      });
      const constructionSites = room.find(FIND_CONSTRUCTION_SITES);
      const enemies = room.find(FIND_HOSTILE_CREEPS);

      const droppedResources = room.find(FIND_DROPPED_RESOURCES);

      return {
        storageEnergy: _.sum(storages, s => s.store.energy),
        containerEnergy: _.sum(containers, c => c.store.energy),
        spawnEnergy: _.sum(spawnStructures, s => s.energy),
        droppedEnergy: _.sum(droppedResources, r => r.amount),
        numConstructionSites: Object.keys(constructionSites).length,
        numEnemies: Object.keys(enemies).length
      };
    }
};

module.exports = loopStats;
