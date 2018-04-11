const utilsInfo = require('utils.info');

// Equalize energy across rooms.

const LogisticsAdvisor = {

  getCreepNeeds: function() {
    let needs = [];

    needs = needs.concat(this.getPickupResourceNeeds());

    return needs;
  },

  getSpawnNeeds: function(needs) {
    needs = _.filter(needs, n => n.type == "gather");
    needs = _.groupBy(needs, n => Game.getObjectById(n.start).room.name);

    const newNeeds = [];
    for (let name in Game.rooms) {
      const room = Game.rooms[name];
      if (!utilsInfo.isRoomOwned(room)) {
        continue;
      }

      const totalEnergy = _.sum(needs[name], n => n.amount);
      const numRunners = _.filter(Game.creeps,
        c => c.memory.role == "run" && c.memory.homeRoom == name).length;

      const numRequestedRunners = Math.min(Math.ceil((totalEnergy + 1500) / 2000), 3);
      const numNewSpawns = numRequestedRunners - numRunners;

      for (let i = 0; i < numNewSpawns; i++) {
        newNeeds.push({
            type: "spawn",
            role: "run",
            room: name,
        });
      }
    }

    return newNeeds;
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

      const containers = room.find(FIND_STRUCTURES, {
          filter: s => s.structureType == STRUCTURE_CONTAINER
      });

      for (let i in droppedResources) {
        const resource = droppedResources[i];
        needs.push({
            type: "gather",
            resource: resource.resourceType,
            target: resource.id,
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
              target: container.id,
              amount: _.sum(container.store)
          });
        }
      }
    }
    return needs;
  },
};

module.exports = LogisticsAdvisor;
