const utilsFind = require('utils.find');

const DefendAdvisor = {

  getCreepNeeds: function() {
    const needs = [];

    for (let name in Game.rooms) {
      const room = Game.rooms[name];

      const enemies = room.find(FIND_HOSTILE_CREEPS);

      for (let i = 0; i < enemies.length; i++) {
        needs.push({
            type: "attack",
            target: enemies[i].id
        });
      }
    }

    return needs;
  },

  getSpawnNeeds: function(needs) {
    needs = _.filter(needs, n => n.type == "attack");

    return needs.map(n => ({
          type: "spawn",
          role: "invader",
          room: utilsFind.findClosestOwnedRoom(n.room).name
    }));
  },
};
