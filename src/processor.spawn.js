const KITS = require('constants.kits');

const SpawnProcessor = {

  filterNeeds: function(needs) {
    return _.filter(needs, n => n.type == "spawn");
  },

  // TODO: Multiple spawns.
  solveNeeds: function(needs) {
    const needsByRoom = _.groupBy(needs, n => n.room);
    for (let name in needsByRoom) {
      const nextCreep = needsByRoom[name][0];
      const spawn = Game.rooms[name].find(FIND_STRUCTURES, {
          filter: s => s.structureType == STRUCTURE_SPAWN
      })[0];

      this.spawnCreep(spawn, nextCreep.role);
    }
  },

  spawnCreep: function(spawn, role) {
    const spawnStructures = room.find(FIND_STRUCTURES, {
        filter: s => s.structureType === STRUCTURE_EXTENSION || s.structureType === STRUCTURE_SPAWN
    });
    const capacity = _.sum(spawnStructures, s => s.energyCapacity);

    return spawn.spawnCreep(KITS[role](capacity), "Bot" + Game.time, {
        memory: {
          role: role,
          homeRoom: spawn.room.name,
          home: spawn.id,
        }
    });
  },
};

module.exports = SpawnProcessor;
