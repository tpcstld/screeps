const constants = require('utils.constants');

const roleHealer = {

    /** @param {Creep} creep **/
    run: function(creep) {
        const targets = creep.room.find(FIND_MY_CREEPS, {
            filter: c => c.hits < c.hitsMax
        });
        if (targets.length > 0) {
            if (creep.heal(targets[0]) == ERR_NOT_IN_RANGE) {
                creep.travelTo(targets[0]);
            }
        }
    }
};

module.exports = roleHealer;