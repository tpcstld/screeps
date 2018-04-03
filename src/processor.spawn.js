const KITS = require('constants.kits');

const SpawnProcessor = {

  // TODO: Multiple spawns.
  solveNeeds: function(needs) {
    needs = _.filter(needs, n => n.type == "spawn");

    const needsByRoom = _.groupBy(needs, n => n.room);
    for (let name in Game.spawns) {
      const spawn = Game.spawns[name];
      const room = spawn.room;

      const nextCreep = (needsByRoom[room.name] || [])[0];
      if (nextCreep) {
        this.spawnCreep(spawn, nextCreep);
      } else {
      }
    }
  },

  spawnCreep: function(spawn, creepInfo) {
    let memory = creepInfo.memory;
    if (!memory) {
      memory = {};
    }

    const spawnStructures = spawn.room.find(FIND_STRUCTURES, {
        filter: s => s.structureType === STRUCTURE_EXTENSION || s.structureType === STRUCTURE_SPAWN
    });
    const capacity = _.sum(spawnStructures, s => s.energyCapacity);

    memory["role"] = creepInfo.role;
    memory["homeRoom"] = creepInfo.room;

    return spawn.spawnCreep(KITS[role](capacity), "Bot" + Game.time, {
      memory: memory
    });
  },
};

module.exports = SpawnProcessor;
