const utilsHarvest = require('utils.harvest');

var roleUpgrader = {

  getNeed: function(creep, needs) {
    const homeRoom = Game.rooms[creep.memory.homeRoom];

    needs = _.filter(needs, n => n.type == "upgrade" && n.room == homeRoom.name);

    if (needs.length == 0) {
      return null;
    }
    return needs[0];
  },

  run: function(creep, need) {
      var state = creep.memory.state || 'gather';

      if (state == 'gather') {
          const nearbyLinks = creep.pos.findInRange(FIND_STRUCTURES, 1, {
              filter: s => s.structureType == STRUCTURE_LINK
          });
          if (nearbyLinks.length > 0) {
              creep.withdraw(nearbyLinks[0], RESOURCE_ENERGY);
          } else {
              utilsHarvest.getEnergyFromContainers(creep);
          }

          if (creep.carry.energy >= creep.carryCapacity) {
              state = 'upgrade';
          }
      }
      if (state == 'upgrade') {
        const homeRoom = Game.rooms[creep.memory.homeRoom];
        const controller = homeRoom.controller;
        if (creep.upgradeController(controller) == ERR_NOT_IN_RANGE) {
          creep.travelTo(controller);
        }

        if (creep.carry.energy == 0) {
            state = 'gather';
        }
      }
      creep.memory.state = state;
  }
};

module.exports = roleUpgrader;
