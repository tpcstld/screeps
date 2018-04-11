const utilsLoad = require('utils.load');
const utilsEnergy = require('utils.energy');
const utilsMovement = require('utils.movement');
const utilsHarvest = require('utils.harvest');

const roleRunner = {

  getNeed: function(creep, needs) {
    const target = creep.memory.target;

    if (_.sum(creep.carry) == creep.carryCapacity) {
      return null;
    }

    if (target) {
      return _.filter(needs, n => n.type == "gather"
        && n.target == target
        && Game.getObjectById(n.target).room.name == creep.memory.homeRoom)[0];
    }

    return _.filter(needs, n => n.type == "gather"
      && Game.getObjectById(n.target).room.name == creep.memory.homeRoom)[0];
  },

  run: function(creep, need) {
    if (creep.memory.working && _.sum(creep.carry) == 0) {
      creep.memory.working = false;
    }
    if (!creep.memory.working && _.sum(creep.carry) == creep.carryCapacity) {
      creep.memory.working = true;
    }

    if (creep.memory.working) {
      utilsEnergy.dropAtContainer(creep);
    } else {
      if (!need) {
        return;
      }

      const target = Game.getObjectById(need.target);

      if (!target) {
        creep.idle();
        return;
      }

      creep.memory.target = need.target;
      if (utilsHarvest.withdrawAll(creep, target) == ERR_NOT_IN_RANGE) {
        creep.travelTo(target);
      }
    }
  },

//     /** @param {Creep} creep **/
//     run: function(creep) {

//       const homeRoom = creep.memory.homeRoom;
//       if (creep.room.name != homeRoom) {
//         creep.travelTo(Game.rooms[homeRoom].controller);
//         return;
//       }

//         if (creep.memory.working && _.sum(creep.carry) == 0) {
//             creep.memory.working = false;
//         }
//         if (!creep.memory.working && _.sum(creep.carry) == creep.carryCapacity) {
//             creep.memory.working = true;
//         }

//         if (creep.memory.working) {
//             utilsEnergy.dropAtContainer(creep);
//             utilsLoad.clearTarget(creep);
//         } else {
//             let target = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {
//                 filter: r => r.amount >= 40 && r.amount >= (creep.carryCapacity * utilsLoad.getTargetCount(creep, r, "take"))
//             });
//             if (!target) {
//               target = creep.pos.findClosestByPath(FIND_TOMBSTONES, {
//                   filter: t => _.sum(t.store) >= Math.max(creep.carryCapacity * utilsLoad.getTargetCount(creep, t, "take"), 1)
//               });
//             }
//             if (!target) {
//               let storage = creep.room.find(FIND_STRUCTURES, {
//                   filter: s => s.structureType == STRUCTURE_STORAGE
//               });
//               let containers = creep.room.find(FIND_STRUCTURES, {
//                   filter: s => s.structureType === STRUCTURE_CONTAINER
//               });
//               if (containers.length > 0 && storage.length > 0) {
//                 containers = _.sortBy(containers, c => -(_.sum(c.store) - (creep.carryCapacity * utilsLoad.getTargetCount(creep, c, "take"))));
//                 target = containers[0];
//               }
//             }
//             if (target) {
//               if (utilsHarvest.withdrawAll(creep, target) == ERR_NOT_IN_RANGE) {
//                 creep.travelTo(target);
//               }
//               utilsLoad.claimTarget(creep, target, "take");
//             } else {
//                 utilsLoad.clearTarget(creep);
//                 creep.idle();
//             }
//         }
//     }
};

module.exports = roleRunner;
