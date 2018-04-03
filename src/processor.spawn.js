const KITS = require('constants.kits');

const SpawnProcessor = {

  // TODO: Multiple spawns.
  solveNeeds: function(needs) {
    needs = _.filter(needs, n => n.type == "spawn");

    const needsByRoom = _.groupBy(needs, n => n.room);
    for (let name in needsByRoom) {
      const nextCreep = needsByRoom[name][0];

      const spawn = Game.rooms[name].find(FIND_STRUCTURES, {
          filter: s => s.structureType == STRUCTURE_SPAWN
      })[0];

      this.spawnCreep(spawn, nextCreep.role, nextCreep.memory);
    }
  },

  getSpawnBuilderNeeds: function(needs) {
    const buildNeeds = _.filter(needs, n => n.type == "build");
  },

  spawnCreep: function(spawn, role, memory) {
    const spawnStructures = spawn.room.find(FIND_STRUCTURES, {
        filter: s => s.structureType === STRUCTURE_EXTENSION || s.structureType === STRUCTURE_SPAWN
    });
    const capacity = _.sum(spawnStructures, s => s.energyCapacity);

    if (!memory) {
      memory = {};
    }

    memory["role"] = role;
    memory["homeRoom"] = spawn.room.name;

    return spawn.spawnCreep(KITS[role](capacity), "Bot" + Game.time, {
      memory: memory
    });
  },
};

module.exports = SpawnProcessor;
