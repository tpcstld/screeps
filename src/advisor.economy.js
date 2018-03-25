
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
    const needs = [];

    const roomCreeps = room.find(FIND_MY_CREEPS);

    // Every room needs one refiller.
    const refillers = _.filter(roomCreeps, c => c.memory.role == "refill");
    if (refillers.length < 0) {
      needs.push({
          type: "spawn",
          role: "refill",
          roomId: room.id,
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
          roomId: room.id,
      });
    }

    return needs;
  }
}

module.exports = EconomyAdvisor;
