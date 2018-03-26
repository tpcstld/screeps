
const UpgradeAdvisor = {

  getNeeds: function() {
    let needs = [];

    for (let name in Game.rooms) {
      const room = Game.rooms[name];

      needs = needs.concat(this.getNeedsForUpgradeForRoom(room));
    }

    return needs;
  },

  // TODO: There should be a smarter way to find out how many upgraders to use.
  getNeedsForUpgradeForRoom: function(room) {
    const needs = [];

    for (let i = 0; i < 2; i++) {
      needs.push({
          type: 'upgrade',
          room: room.name,
      });
    }

    return needs;
  },
};

module.exports = UpgradeAdvisor;
