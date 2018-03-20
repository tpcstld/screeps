const roleAttacker = {

    /** @param {Creep} creep **/
    run: function(creep) {
        const targets = creep.room.find(FIND_HOSTILE_CREEPS);
        if (targets.length > 0) {
            if (creep.attack(targets[0]) == ERR_NOT_IN_RANGE) {
                creep.travelTo(targets[0]);
            }
        }
    }
};

module.exports = roleAttacker;
