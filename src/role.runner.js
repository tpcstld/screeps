const utilsLoad = require('utils.load');
const utilsEnergy = require('utils.energy');
const utilsMovement = require('utils.movement');

const roleRunner = {

    /** @param {Creep} creep **/
    run: function(creep) {

      const homeRoom = creep.memory.homeRoom;
      if (creep.room.name != homeRoom) {
        creep.travelTo(Game.getObjectById(homeRoom).controller);
        return;
      }

        if (creep.memory.working && _.sum(creep.carry) == 0) {
            creep.memory.working = false;
        }
        if (!creep.memory.working && _.sum(creep.carry) == creep.carryCapacity) {
            creep.memory.working = true;
        }

        if (creep.memory.working) {
            utilsEnergy.dropAtContainer(creep);
            utilsLoad.clearTarget(creep);
        } else {
            let target = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {
                filter: r => r.amount >= 40 && r.amount >= (creep.carryCapacity * utilsLoad.getTargetCount(creep, r, "take"))
            });
            if (!target) {
              target = creep.pos.findClosestByPath(FIND_TOMBSTONES, {
                  filter: t => _.sum(t.store) >= Math.max(creep.carryCapacity * utilsLoad.getTargetCount(creep, t, "take"), 1)
              });
            }
            if (!target) {
              let containers = creep.room.find(FIND_STRUCTURES, {
                  filter: s => s.structureType === STRUCTURE_CONTAINER
              });
              if (containers.length > 0) {
                containers = _.sortBy(containers, c => -(_.sum(c.store) - (creep.carryCapacity * utilsLoad.getTargetCount(creep, c, "take"))));
                target = containers[0];
              }
            }
            if (target) {
              // TODO: Withdraw every resource.
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
