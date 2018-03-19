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
};


module.exports = utilsInfo;
