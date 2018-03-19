let utilsCmdline = {
    countRoles: function() {
        return JSON.stringify(_.countBy(Game.creeps, c => c.memory.role));
    },
    
    showRole: function(role) {
        for (const name in Game.creeps) {
            const creep = Game.creeps[name];
            if (creep.memory.role === role) {
                creep.say(role);
            }
        }
    },
    
    clearHarvestIndex: function() {
        for (var name in Game.creeps) {
            let creep = Game.creeps[name];
            creep.memory.harvestIndex = null;
        }
    },
    
    getBodyCost: function(parts) {
        let total = 0;
        for (const index in parts) {
            const part = parts[index];
            total = total + BODYPART_COST[part];
        }
        return total;
    }
}

module.exports = utilsCmdline;