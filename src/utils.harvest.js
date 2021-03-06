const utilsLoad = require('utils.load');

let utilsHarvest = {

    getEnergyFromContainers: function(creep, force) {
        let target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: c => c.structureType === STRUCTURE_STORAGE
              && c.store[RESOURCE_ENERGY] > 0
              && (force || c.store[RESOURCE_ENERGY] >= creep.carryCapacity * (utilsLoad.getTargetCount(creep, c, "take") + 1))
        });
        if (!target) {
          target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
              filter: c => c.structureType === STRUCTURE_CONTAINER
                && c.store[RESOURCE_ENERGY] > 0
                && (force || c.store[RESOURCE_ENERGY] >= creep.carryCapacity * (utilsLoad.getTargetCount(creep, c, "take") + 1))
          });
        }
        if (!target) {
          target = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {
              filter: r => r.resourceType == RESOURCE_ENERGY
                && (force || r.amount >= creep.carryCapacity * (utilsLoad.getTargetCount(creep, r, "take") + 1))
          });
        }

        if (target) {
            utilsLoad.claimTarget(creep, target, "take");
            if (creep.pickup(target) == ERR_NOT_IN_RANGE || creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.travelTo(target);
            }
            return true;
        }

        utilsLoad.clearTarget(creep);
        if (creep.goHomeRoom()) {
          return true;
        }
        return false;
    },

    // Harvest a random energy cell.
    harvestRandom: function(creep, maxConcurrent) {
        const target = creep.pos.findClosestByPath(FIND_SOURCES, {
            filter: s => utilsLoad.getTargetCount(creep, s, "mine") < maxConcurrent
        });

        if (target) {
            if (creep.harvest(target) == ERR_NOT_IN_RANGE) {
                creep.travelTo(target);
            }
            utilsLoad.claimTarget(creep, target, "mine");
            return target;
        } else {
            utilsLoad.clearTarget(creep);
            return null;
        }
    },

    withdrawAll: function(creep, target) {
      const store = target.store;
      if (!store) {
        return creep.pickup(target);
      }

      for (let key in store) {
        let result = creep.withdraw(target, key);
        if (result != OK) {
          return result;
        }
      }

      return OK;
    }
};

module.exports = utilsHarvest;
