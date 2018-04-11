const utilsInfo = require('utils.info');

// Equalize energy across rooms.

const LogisticsAdvisor = {

  RESOURCE_PER_RUNNER: 2500,

  getCreepNeeds: function() {
    let needs = [];

    needs = needs.concat(this.getPickupResourceNeeds());

    return needs;
  },

  getSpawnNeeds: function(needs) {
    needs = _.filter(needs, n => n.type == "transport");
    needs = _.groupBy(needs, n => Game.getObjectById(n.start).room.name);

    const newNeeds = [];
    for (let name in Game.rooms) {
      const totalEnergy = _.sum(needs[name], n => n.amount);
      const numTransporters = _.filter(Game.creeps,
        c => c.memory.role == "transport" && c.memory.homeRoom == name).length;

      const numNewSpawns = Math.floor((totalEnergy / this.RESOURCE_PER_RUNNER) - numTransporters);

      for (let i = 0; i < numNewSpawns; i++) {
        newNeeds.push({
            type: "spawn",
            role: "transport",
            room: name,
        });
      }
    }

    // Disable for now.
    return [];
  },

  getPickupResourceNeeds: function() {
    let needs = [];
    for (let name in Game.rooms) {
      const room = Game.rooms[name];

      // TODO: Remote mining pickup.
      if (!utilsInfo.isRoomOwned(room)) {
        continue;
      }

      const droppedResources = room.find(FIND_DROPPED_RESOURCES, {
          filter: r => r.amount >= 40
      });

      for (let i in droppedResources) {
        const resource = droppedResources[i];
        needs.push({
            type: "gather",
            resource: resource.resourceType,
            start: resource.id,
            target: room.storage.id,
            amount: resource.amount,
        });
      }

      if (room.storage) {
        const containers = room.find(FIND_STRUCTURES, {
            filter: s => s.structureType == STRUCTURE_CONTAINER
              && _.sum(s.store) > 100
        });

        for (let i in containers) {
          const container = containers[i];
          needs.push({
              type: "gather",
              resource: "all",
              start: container.id,
              target: room.storage.id,
              amount: _.sum(container.store)
          });
        }
      }

      return needs;
    }
  },
};

module.exports = LogisticsAdvisor;
