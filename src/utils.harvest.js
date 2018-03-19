const utilsLoad = require('utils.load');

let utilsHarvest = {
    
    MINER_COUNT: {
        "59f1a2a682100e1594f3a5b6": 4,
        "59f1a2a682100e1594f3a5b7": 1
    },
    
    getEnergyFromContainers: function(creep, force) {
        // Get energy from containers.
        var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: c => c.structureType === STRUCTURE_CONTAINER && c.store[RESOURCE_ENERGY] > 0 && (force || c.store[RESOURCE_ENERGY] >= creep.carryCapacity * (utilsLoad.getTargetCount(creep, c, "take") + 1))
        });
        
        if (target) {
            utilsLoad.claimTarget(creep, target, "take");
            if (creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.travelTo(target, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
            return true;
        }
        
        utilsLoad.clearTarget(creep);
        
        let flag = Game.flags["Home"];
        if (flag.room === undefined || flag.room.name !== creep.room.name) {
            creep.travelTo(flag.pos, {visualizePathStyle: {stroke: '#ffaa00'}});
            return true;
        }
        return false;
    },
    
    // Harvest a random energy cell.
    harvestRandom: function(creep, maxConcurrent) {
        var target = creep.pos.findClosestByPath(FIND_SOURCES, {
            filter: s => utilsLoad.getTargetCount(creep, s, "mine") < maxConcurrent
        });
        
        if (target) {
            if (creep.harvest(target) == ERR_NOT_IN_RANGE) {
                creep.travelTo(target, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
            utilsLoad.claimTarget(creep, target, "mine");
            return true;
        } else {
            utilsLoad.clearTarget(creep);
            return false;
        }
    }
};

module.exports = utilsHarvest;