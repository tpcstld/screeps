
const EconomyAdvisor = {

  getNeeds: function() {
    let needs = [];
    for (let name in Game.rooms) {
      const room = Game.rooms[name];
      const roomNeeds = this.getNeedsForRoom(room);
      needs = needs.concat(roomNeeds);
    }

    return needs;
  },

  getNeedsForRoom: function(room) {
    if (room.controller.my) {
      return this.getNeedsForSpawnRoom(room);
    }
    return [];
  },

  getNeedsForSpawnRoom: function(room) {
    let needs = [];

    const roomCreeps = room.find(FIND_MY_CREEPS);

    // Every room needs one refiller.
    const refillers = _.filter(roomCreeps, c => c.memory.role == "refill");
    if (refillers.length < 1) {
      needs.push({
          type: "spawn",
          role: "refill",
          room: room.name,
      });
    }

    // Every room should have as many miners as sources.
    const sources = room.find(FIND_SOURCES);
    const miners = _.filter(roomCreeps, c => c.memory.role == "mine");
    const numDifference = sources.length - miners.length;
    for (let i = 0; i < numDifference; i++) {
      needs.push({
          type: "spawn",
          role: "mine",
          room: room.name,
      });
    }

    const numRunners = this.getNumRunners(room);
    for (let i = 0; i < numRunners; i++) {
      needs.push({
          type: "spawn",
          role: "run",
          room: room.name,
      });
    }

    return needs;
  },

  getNumRunners: function(room) {
    // Deploy runners depending on load.
    const storage = room.find(FIND_STRUCTURES, {
        filter: s => s.structureType === STRUCTURE_STORAGE
    });
    let roomStats = Memory.stats.rooms[room.name];

    let energy = roomStats.droppedEnergy;
    if (storage.length > 0) {
      energy = energy + roomStats.containerEnergy;
    }
    return Math.ceil((energy + 1500) / 2000)
  },
}

module.exports = EconomyAdvisor;
