
const utilsFind = {

    findInEveryRoom: function(type, opts) {
        let total = [];
        for (let name in Game.rooms) {
            const room = Game.rooms[name];

            const targets = room.find(type, opts);
            total = total.concat(targets);
        }
        return total;
    }
};

module.exports = utilsFind;
