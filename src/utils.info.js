const utilsInfo = {

    getFirstCreepByFilter: function(opts) {
        for (const name in Game.creeps) {
            const creep = Game.creeps[name];
            if (opts.filter(creep)) {
                return creep;
            }
        }
        return null;
    },

    isRoomOwned: function(room) {
      if (!room.controller.my) {
        return false;
      }

      return room.find(FIND_STRUCTURES, {
          filter: s => s.structureType == STRUCTURE_SPAWN
      })[0];
    },
};


module.exports = utilsInfo;
