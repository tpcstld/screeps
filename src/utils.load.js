
const utilsLoad = {

    claimTarget: function(creep, target, action) {
        creep.memory.targetId = target.id;
        creep.memory.targetAction = action;
    },

    clearTarget: function(creep) {
        creep.memory.targetId = null;
        creep.memory.targetAction = null;
    },

    findAvailableTargets: function(creep, maxCreeps, action, type, opts) {
        const targets = creep.room.find(type, opts);
        const result = [];
        for (let xx = 0; xx < targets.length; xx++) {
            const target = targets[xx];
            const numPending = this.getTargetCount(creep, target, action);
            if (numPending < maxCreeps) {
                result.push(target);
            }
        }
        return result;
    },

    getTargetCount: function(creep, target, action) {
        if (creep.memory.targetId == target.id && creep.memory.targetAction == action) {
            return -1;
        }

        return _.filter(Game.creeps, c => c.memory.targetId === target.id && c.memory.targetAction === action).length;
    },

    isCreepTarget: function(creep, target) {
        return creep.memory.targetId == target.id;
    },
};

module.exports = utilsLoad;
