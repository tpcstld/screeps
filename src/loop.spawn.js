const loopSpawn = {

    NUM_TYPES: [
        {type: 'attack', num: () => 0},
        {type: 'heal', num: () => 0},
        {type: 'refill', num: () => 1},
        {type: 'mine', num: () => 2},
        {type: 'build', num: () => 2},
        {type: 'upgrade', num: () => Memory.stats.storedEnergy > 4000 ? 2 : 1},
        {type: 'run', num: () => 1},
        {type: 'repair', num: () => 2},
        {type: 'remoteMine', num: () => 1},
        {type: 'remoteRunner', num: () => 2},
        {type: 'general', num: () => 0},
    ],

    KITS: {
        'upgrade': [WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
        'build': [WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
        'repair': [WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
        'mine': [WORK, WORK, WORK, WORK, WORK, MOVE],
        'refill': [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE],
        'run': [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
        'attack': [TOUGH, TOUGH, TOUGH, TOUGH, ATTACK, ATTACK, MOVE, MOVE, MOVE, MOVE],
        'remoteMine': [WORK, WORK, WORK, MOVE],
        'remoteRunner': [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
        'heal': [HEAL, HEAL, MOVE],
        'general': [WORK, CARRY, MOVE],
    },

    run: function(spawn) {
        let nextCreepType = this.getNextCreepType();
        if (nextCreepType) {
            spawn.spawnCreep(this.KITS[nextCreepType], "Bot" + Game.time, {
                memory: {
                    role: nextCreepType
                }
            });
        }
    },

    getNextCreepType: function() {
        let creepsCount = _.countBy(Game.creeps, c => c.memory.role);

        // Avoid dead base.
        if (Object.keys(creepsCount).length <= 1) {
            if (!creepsCount["general"] || creepsCount["general"] < 3) {
                return "general";
            }
        }

        for (let index in this.NUM_TYPES) {
            const creepType = this.NUM_TYPES[index];

            if (creepType.num() === 0) {
                continue;
            }
            if (creepsCount[creepType.type] === undefined || creepsCount[creepType.type] < creepType.num()) {
                return creepType.type;
            }
        }
        return null;
    }
}
module.exports = loopSpawn;
