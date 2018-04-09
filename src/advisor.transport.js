// Equalize energy across rooms.

const TransportAdvisor = {

  getCreepNeeds: function() {
    let needs = [];

    for (let name in Game.rooms) {
      const room = Game.rooms[name];

      const lowEnergy = room.storage && room.storage.store[RESOURCE_ENERGY] < 250000;
      if (lowEnergy) {
        needs = needs.concat(this.getTransportEnergyNeed(room));
      }
    }

    return needs;
  },

  getSpawnNeeds: function(needs) {
    needs = _.filter(needs, n => n.type == "transport");

    return needs.map(n => ({
          type: "spawn",
          role: "transport",
          room: Game.getObjectById(n.start).room.name
    }));
  },

  // Transport some energy to this room.
  getTransportEnergyNeed: function(room) {
    let richRooms = _.filter(Game.rooms, r => r.storage && r.storage.store[RESOURCE_ENERGY] > 250000);
    richRooms = _.sortBy(richRooms, r => -(r.storage.store[RESOURCE_ENERGY]));

    let numTransporters = 1;
    if (room.storage.store[RESOURCE_ENERGY] < 100000) {
      numTransporters = 2;
    }

    for (let name in richRooms) {
      const richRoom = richRooms[name];
      const route = Game.map.findRoute(richRoom, room);
      if (route.length < 2) {
        const output = [];
        for (let i = 0; i < numTransporters; i++) {
          output.push({
            type: "transport",
            resource: RESOURCE_ENERGY,
            start: richRoom.storage.id,
            target: room.storage.id
          });
        }
        return output;
      }
    }

    return [];
  }
};

module.exports = TransportAdvisor;
