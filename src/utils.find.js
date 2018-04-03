
const utilsFind = {

    findInEveryRoom: function(type, opts) {
        let total = [];
        for (let name in Game.rooms) {
            const room = Game.rooms[name];

            const targets = room.find(type, opts);
            total = total.concat(targets);
        }
        return total;
    },

    findClosestOwnedRoom: function(targetRoom, opts) {
      if (!opts) {
        opts = {};
      }

      if (!opts.filter) {
        opts.filter = () => true;
      }

      let rooms = _.filter(Game.rooms, opts.filter);
      rooms = _.map(rooms, r => ({
          room: r,
          route: Game.map.findRoute(r, targetRoom)
      }));
      rooms = _.filter(rooms, r => r.route != ERR_NO_PATH);

      const closestRoom = _.minBy(rooms, r => r.route.length);
      return closestRoom.room;
    },
};

module.exports = utilsFind;
