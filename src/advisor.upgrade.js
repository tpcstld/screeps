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

    let numUpgraders = 2;
    if (!link) {
      const roomStats = Memory.stats.rooms[room.name];
      const totalEnergy = roomStats.storageEnergy + roomStats.containerEnergy + roomStats.droppedEnergy;

      numUpgraders = Math.min(Math.ceil(totalEnergy / 5000), 5);
    }

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
