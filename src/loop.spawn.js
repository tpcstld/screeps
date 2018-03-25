const loopSpawn = {

    NUM_TYPES: [
        {type: 'invader', refundable: true, num: (spawn) => Math.ceil(_.max(_.map(Memory.stats.rooms, r => r.name != spawn.room.name ? r.numEnemies : 0)) / 5)},
        {type: 'attack', num: (spawn) => 0},
        {type: 'heal', num: (spawn) => 0},
        {type: 'upgrade', num: (spawn) => 2},
        {type: 'build', refundable: true, num: (spawn) => Math.min(2, Memory.stats.rooms[spawn.room.name].numConstructionSites)},
        {type: 'repair', num: (spawn) => 2},
        {type: 'remoteMine', num: (spawn) => 1},
        {type: 'remoteRunner', num: (spawn) => 2},
        {type: 'general', num: (spawn) => 0},
    ],

    KITS: {
        'upgrade': [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE],
        'build': [WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
        'repair': [WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
        'mine': [WORK, WORK, WORK, WORK, WORK, MOVE],
        'refill': [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE],
        'link_refiller': [CARRY, MOVE],
        'run': [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
        'attack': [TOUGH, TOUGH, TOUGH, TOUGH, ATTACK, ATTACK, MOVE, MOVE, MOVE, MOVE],
        'remoteMine': [WORK, WORK, WORK, MOVE],
        'remoteRunner': [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
        'heal': [HEAL, HEAL, MOVE],
        'general': [WORK, CARRY, MOVE],
        'invader': new Array(10).fill(ATTACK).concat(new Array(5).fill(MOVE)),
        'invaderHeal': [HEAL, HEAL, HEAL, HEAL, MOVE, MOVE, MOVE, MOVE],
    },

    run: function(spawn) {
        this.markRefund(spawn);

        const refundCreeps = spawn.pos.findInRange(FIND_MY_CREEPS, 1, {
            filter: c => c.memory.refund
        });
        for (let name in refundCreeps) {
            const creep = refundCreeps[name];
            spawn.recycleCreep(creep);
        }

        let nextCreepType = this.getNextCreepType(spawn);
        if (nextCreepType) {
            this.spawnCreep(spawn, nextCreepType);
        }
    },

    spawnCreep: function(spawn, type) {
      return spawn.spawnCreep(this.KITS[type], "Bot" + Game.time, {
          memory: {
            role: type,
            homeRoom: spawn.room.name,
            home: spawn.id,
          }
      });
    },

    getNextCreepType: function(spawn) {
        let creeps = _.filter(Game.creeps, c => c.memory.home == spawn.id);
        let creepsCount = _.countBy(creeps, c => c.memory.role);

        // Avoid dead base.
        if (Object.keys(creepsCount).length <= 1) {
            if (!creepsCount["general"] || creepsCount["general"] < 3) {
                return "general";
            }
        }

        for (let index in this.NUM_TYPES) {
            const creepType = this.NUM_TYPES[index];

            if (creepType.num(spawn) === 0) {
                continue;
            }
            if (creepsCount[creepType.type] === undefined || creepsCount[creepType.type] < creepType.num(spawn)) {
                return creepType.type;
            }
        }
        return null;
    },

    markRefund: function(spawn) {
        let spawnCreeps = _.filter(Game.creeps, c => c.memory.home == spawn.id);
        let creepsByRole = _.groupBy(spawnCreeps, c => c.memory.role);
        for (let role in creepsByRole) {
            const creeps = creepsByRole[role];
            const type = this.getRoleType(role);

            if (!type || !type.refundable) {
              continue;
            }

            const count = creeps.length;
            const difference = count - type.num(spawn);

            for (let xx = 0; xx < count; xx++) {
                creeps[xx].memory.refund = false;
                if (xx < difference) {
                  creeps[xx].memory.refund = true;
                }
            }
        }
    },

    getRoleType(name) {
      const maybeType = _.filter(this.NUM_TYPES, t => t.type == name);
      if (maybeType.length > 0) {
        return maybeType[0];
      }
      return null;
    },
}
module.exports = loopSpawn;
