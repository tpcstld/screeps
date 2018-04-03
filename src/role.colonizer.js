const roleColonizer = {

  getNeed: function(creep, needs) {
    return _.filter(needs, n => n.type == "colonize")[0];
  },

  run: function(creep, need) {
    const flag = Game.flags["Colony"];
    if (!flag) {
      return;
    }

    if (flag.room == undefined || flag.room.name != creep.room.name) {
      creep.travelTo(flag.pos);
      return;
    }

    const controller = creep.room.controller;
    if (controller) {
      const result = creep.claimController(controller);
      if (result == ERR_NOT_IN_RANGE) {
        creep.travelTo(controller);
      } else if (result == OK) {
        flag.remove();
      }
    }
  }
};

module.exports = roleColonizer;
