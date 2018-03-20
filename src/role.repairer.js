const utilsHarvest = require('utils.harvest');
const constants = require('utils.constants');
const utilsLoad = require('utils.load');
const utilsFind = require('utils.find');

const roleRepairer = {

    run: function(creep) {

        if (creep.memory.working && creep.carry.energy == 0) {
            creep.memory.working = false;
            creep.say('🔄 harvest');
        }
        if (!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
            creep.memory.working = true;
            creep.say('🚧 repair');
        }

        if (creep.memory.working) {
            let targets = utilsFind.findInEveryRoom(FIND_STRUCTURES, {
                filter: s => (s.hits / s.hitsMax * 1.0 < 0.9 || utilsLoad.isCreepTarget(creep, s))
                    && (!constants.MAX_HP[s.structureType] || s.hits < constants.MAX_HP[s.structureType])
            });

            targets = _.sortBy(targets, t => {
                let result = t.hits * 1.0 / t.hitsMax;
                if (utilsLoad.isCreepTarget(creep, t) && result < 0.99) {
                    return 0;
                }
                return result;
            });

            if (targets.length > 0) {
                if (creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.travelTo(targets[0]);
                }
                utilsLoad.claimTarget(creep, targets[0], 'repair');
            } else {
                creep.travelTo(Game.flags["Idle"].pos, {
                    stuckValue: 8
                });
                utilsLoad.clearTarget(creep);
            }
        } else {
            utilsHarvest.getEnergyFromContainers(creep);
        }
    }
};

module.exports = roleRepairer;
