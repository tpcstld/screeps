
const roleLink = {

  run: function(link) {
    if (link.room.memory.sourceLinkId != link.id) {
      return;
    }

    const targets = link.room.find(FIND_STRUCTURES, {
        filter: s => s.structureType == STRUCTURE_LINK
          && s.id != link.id
          && s.energy < s.energyCapacity / 2
    });

    if (targets.length > 0) {
      link.transferEnergy(targets[0]);
    }
  }
};

module.exports = roleLink;
