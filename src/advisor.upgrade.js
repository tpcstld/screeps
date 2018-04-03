const utilsInfo = require('utils.info');

const UpgradeAdvisor = {

  getCreepNeeds: function() {
    let needs = [];

    for (let name in Game.rooms) {
      const room = Game.rooms[name];

      needs = needs.concat(this.getNeedsForUpgradeForRoom(room));
    }

    return needs;
  },

  getSpawnNeeds: function(needs) {
    needs = _.filter(needs, n => n.type == "upgrade");

    return needs.map(n => ({
        type: "spawn",
        role: "upgrade",
        room: n.room
    }));
  },

  // TODO: There should be a smarter way to find out how many upgraders to use.
  getNeedsForUpgradeForRoom: function(room) {
    const needs = [];

    if (!utilsInfo.isRoomOwned(room)) {
      return [];
    }

    const link = room.controller.pos.findInRange(FIND_STRUCTURES, 3, {
        filter: s => s.structureType == STRUCTURE_LINK
    })[0];

    const numUpgraders = link ? 2 : 4;
    for (let i = 0; i < numUpgraders; i++) {
      needs.push({
          type: 'upgrade',
          room: room.name,
      });
    }

    return needs;
  },
};

module.exports = UpgradeAdvisor;
