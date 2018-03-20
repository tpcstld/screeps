const utilsLoad = require('utils.load');
const utilsEnergy = require('utils.energy');
const utilsMovement = require('utils.movement');

const roleRunner = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if (creep.memory.working && creep.carry.energy == 0) {
            creep.memory.working = false;
            creep.say('🔄 gather');
        }
        if (!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
            creep.memory.working = true;
            creep.say('🚧 place');
        }

        if (creep.memory.working) {
            utilsEnergy.dropAtContainer(creep);
            utilsLoad.clearTarget(creep);
        } else {
            var target = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {
                filter: r => r.amount >= 40 && r.amount >= (creep.carryCapacity * utilsLoad.getTargetCount(creep, r, "take") + 1)
            });
            if (!target) {
              target = creep.pos.findClosestByPath(FIND_TOMBSTONES, {
                  filter: t => _.sum(t.store) >= 40 && _.sum(t.store) >= (creep.carryCapacity * utilsLoad.getTargetCount(creep, t, "take") + 1)
              });
            }
            if (target) {
                if (creep.pickup(target) == ERR_NOT_IN_RANGE || creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.travelTo(target);
                }
                utilsLoad.claimTarget(creep, target, "take");
            } else {
                utilsLoad.clearTarget(creep);
                creep.idle();
            }
        }
    }
};

module.exports = roleRunner;
