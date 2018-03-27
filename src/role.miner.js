let utilsHarvest = require('utils.harvest');

let roleMiner = {

  getNeed: function(needs) {
    needs = _.filter(needs, n => n.type == "mine");
    if (needs.length > 0) {
      return needs[0];
    }
    return null;
  },

  /** @param {Creep} creep **/
  run: function(creep, need) {
    const target = need.target;
    if (!target) {
      return;
    }

    const travelTarget = target;
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
