const utilsFind = require('utils.find');

const CommandAdvisor = {

  getCreepNeeds: function() {
    let needs = [];
    needs = needs.concat(this.colonize());
    return needs;
  },

  getSpawnNeeds: function(needs) {
    needs = _.filter(needs, n => n.type == "colonize");

    // TODO: Closest room.
    return needs.map(n => {
        type: "spawn",
        role: "upgrade",
        room: utilsFind.findClosestOwnedRoom(n.pos.roomName),
    });
  },

  colonize: function() {
    const needs = []
    const flag = Game.flags["Colony"];
    if (!flag) {
      return needs;
    }

    needs.push({
        type: "colonize",
        pos: flag.pos,
    });

    return needs;
  }
};

module.exports = CommandAdvisor;
