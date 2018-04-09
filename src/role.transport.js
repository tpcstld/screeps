
const roleTransport = {

  getNeed: function(creep, needs) {
    const target = creep.memory.target;

    const homeStorageId = Game.rooms[creep.memory.homeRoom].storage.id;

    if (target) {
      return _.filter(needs, n => n.type == "transport"
        && n.target == target
        && n.start == homeStorageId)[0];
    }

    return _.filter(needs, n => n.type == "transport"
      && n.start == homeStorageId)[0];
  },

  run: function(creep, need) {
    if (!need) {
      return;
    }

    creep.memory.target = need.target;

    if (creep.memory.working && creep.carry.energy == 0) {
      creep.memory.working = false;
    }
    if (!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
      creep.memory.working = true;
    }

    if (creep.memory.working) {
      const target = Game.getObjectById(need.target);
      if (creep.transfer(target, need.resource) == ERR_NOT_IN_RANGE) {
        creep.travelTo(target);
      }
    } else {
      const target = Game.getObjectById(need.start);
      if (creep.withdraw(target, need.resource) == ERR_NOT_IN_RANGE) {
        creep.travelTo(target);
      }
    }
  }
};

module.exports = roleTransport;
