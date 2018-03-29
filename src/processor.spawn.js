const KITS = require('constants.kits');

const NEED_ORDER = [
  "spawn",
  "mine",
];

const SpawnProcessor = {

  // TODO: Multiple spawns.
  solveNeeds: function(needs) {
    needs = this.convertNeeds(needs);

    const needsByRoom = _.groupBy(needs, n => n.room);
    for (let name in needsByRoom) {
      const nextCreep = needsByRoom[name][0];
      const spawn = Game.rooms[name].find(FIND_STRUCTURES, {
          filter: s => s.structureType == STRUCTURE_SPAWN
      })[0];

      this.spawnCreep(spawn, nextCreep.role, nextCreep.memory);
    }
  },

  convertNeeds: function(needs) {
    const output = [];
    for (let name in needs) {
      const need = needs[name];

      if (need.type == "spawn") {
        output.push(need);
        return;
      }

      if (need.type == "mine") {
        output.push({
            type: "spawn",
            role: "mine",
            room: Game.getObjectById(need.target).name,
            memory: {
              target: need.target
            },
        });
      }
    }

    return output;
  }

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
