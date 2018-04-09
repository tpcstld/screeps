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
    return [];
  },

  // Transport some energy to this room.
  getTransportEnergyNeed: function(room) {
    let richRooms = _.filter(Game.rooms, r => r.storage && r.storage.store[RESOURCE_ENERGY] > 250000);
    richRooms = _.sortBy(richRooms, r => -(r.storage.store[RESOURCE_ENERGY]));

    for (let name in richRooms) {
      const richRoom = richRooms[name];
      const route = Game.map.findRoute(richRoom, room);
      if (route.length < 2) {
        return [{
            type: "transport",
            resource: RESOURCE_ENERGY,
            start: richRoom.storage.id,
            target: room.storage.id
        }];
      }
    }

    return [];
  }
};

module.exports = TransportAdvisor;
