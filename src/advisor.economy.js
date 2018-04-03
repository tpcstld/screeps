
const EconomyAdvisor = {

  getCreepNeeds: function() {
    let needs = [];
    for (let name in Game.rooms) {
      const room = Game.rooms[name];
      const roomNeeds = this.getNeedsForRoom(room);
      needs = needs.concat(roomNeeds);
    }

    return needs;
  },

  getSpawnNeeds: function(needs) {
    const mineNeeds = _.filter(needs, n => n.type == "mine");

    return mineNeeds.map(n => {
        type: "spawn",
        role: "mine",
        room: Game.getObjectById(n.target).room.name,
        memory: {
          target: n.target
        },
    });
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

    if (roomCreeps.length < 3) {
      needs.push({
          type: "spawn",
          role: "general",
          room: room.name,
      });
    }

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
    for (let i in sources) {
      const source = sources[i];
      needs.push({
          type: 'mine',
          target: source.id,
      });
    }

    needs = needs.concat(this.requestRunnersForRoom(room));
    needs = needs.concat(this.requestLinkRefillersForRoom(room));

    return needs;
  },

  // Deploy runners depending on load.
  requestRunnersForRoom: function(room) {
    const storage = room.find(FIND_STRUCTURES, {
        filter: s => s.structureType === STRUCTURE_STORAGE
    });
    let roomStats = Memory.stats.rooms[room.name];

    let energy = roomStats.droppedEnergy;
    if (storage.length > 0) {
      energy = energy + roomStats.containerEnergy;
    }
    const numRunners = Math.ceil((energy + 1500) / 2000);

    return this.fillSpawnNeedForRoom(room, numRunners, "run");
  },

  requestLinkRefillersForRoom: function(room) {
    const links = room.find(FIND_STRUCTURES, {
        filter: s => s.structureType == STRUCTURE_LINK
    });

    if (links.length >= 2) {
      return this.fillSpawnNeedForRoom(room, 1, "link_refiller");
    }
    return [];
  },

  // TODO: Move to some utils.
  fillSpawnNeedForRoom: function(room, num, role) {
    const needs = [];
    const current = _.filter(Game.creeps, c => c.memory.role == role
      && c.memory.homeRoom == room.name);

    const numDifference = num - current.length;
    for (let i = 0; i < numDifference; i++) {
      needs.push({
          type: "spawn",
          role: role,
          room: room.name,
      });
    }
    return needs;
  }
}

module.exports = EconomyAdvisor;
