let utilsHarvest = require('utils.harvest');

let roleMiner = {

  getNeed: function(creep, needs) {
    const target = creep.memory.target;
    needs = _.filter(needs, n => n.type == "mine" && n.target == target);

    if (needs.length == 0) {
      return null;
    }
    return needs[0];
  },

  run: function(creep, need) {
    const target = Game.getObjectById(creep.memory.target);
    if (!target) {
      return;
    }

    let travelTarget = target;
    const containers = target.pos.findInRange(FIND_STRUCTURES, 1, {
        filter: s => s.structureType === STRUCTURE_CONTAINER
    });
    if (containers.length > 0) {
      travelTarget = containers[0];
    }

    if (creep.harvest(target) == ERR_NOT_IN_RANGE) {
      creep.travelTo(travelTarget);
    }

  }
};

module.exports = roleMiner;
