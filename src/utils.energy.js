const utilsInfo = require('utils.info');
const utilsLoad = require('utils.load');
const constants = require('utils.constants');
const utilsFind = require('utils.find');

let utilsEnergy = {

    placeEnergy: function(creep) {
        if (this.buildConstructionSite(creep)) {
            return true;
        }

        creep.upgradeController(creep.room.controller);
        creep.travelTo(creep.room.controller, {
            stuckValue: 8
        });
        return true;
    },

    buildConstructionSite: function(creep) {
        const siteKeys = Object.keys(Game.constructionSites);
        if (siteKeys.length == 0) {
            return false;
        }

        // First check if there are construction sites in the current room.
        const constructionSite = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
        if (constructionSite) {
            if (creep.build(constructionSite) == ERR_NOT_IN_RANGE) {
                creep.travelTo(constructionSite);
            }
            return true;
        }

        const firstSite = Game.constructionSites[siteKeys[0]];
        creep.travelTo(firstSite);
        return true;
    },

    maybeRefillEnergy: function(creep) {
      if (this.maybeEnergizeSpawns(creep)
          || this.maybeEnergizeExtensions(creep)
          || this.maybeEnergizeTowers(creep)
          || this.maybeEnergizeLinks(creep)) {
        return true;
      }

      utilsLoad.clearTarget(creep);
      return false;
    },

    maybeEnergizeSpawns: function(creep) {
        const targets = utilsLoad.findAvailableTargets(creep, 1, "charge", FIND_MY_SPAWNS, {
            filter: s => s.energy < s.energyCapacity
        });

        const target = creep.pos.findClosestByPath(targets);
        if (target) {
            if (this.transferEnergyTo(creep, target)) {
                return true;
            }
        }
        return false;
    },

    maybeEnergizeExtensions: function(creep) {
        const targets = utilsLoad.findAvailableTargets(creep, 1, "charge", FIND_STRUCTURES, {
            filter: s => s.structureType === STRUCTURE_EXTENSION && s.energy < s.energyCapacity
        });

        const target = creep.pos.findClosestByPath(targets);
        if (target) {
            if (this.transferEnergyTo(creep, target)) {
                return true;
            }
        }
        return false;
    },

    maybeEnergizeTowers: function(creep) {
        const targets = utilsLoad.findAvailableTargets(creep, 1, "charge", FIND_STRUCTURES, {
            filter: s => s.structureType === STRUCTURE_TOWER && s.energy < s.energyCapacity
        });

        const target = creep.pos.findClosestByPath(targets);
        if (target) {
            if (this.transferEnergyTo(creep, target)) {
                return true;
            }
        }
        return false;
    },

    maybeEnergizeLinks: function(creep) {
        const targets = utilsLoad.findAvailableTargets(creep, 1, "charge", FIND_STRUCTURES, {
            filter: s => s.structureType == STRUCTURE_LINK
              && s.energy < s.energyCapacity
              && s.id == creep.room.memory.sourceLinkId
        });
        const target = creep.pos.findClosestByPath(targets);
        if (target) {
            if (this.transferEnergyTo(creep, target)) {
                return true;
            }
        }
        return false;
    },

    transferEnergyTo: function(creep, building) {
        if (building.energy !== undefined && building.energy < building.energyCapacity) {
            if (creep.transfer(building, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.travelTo(building);
            }
            utilsLoad.claimTarget(creep, building, "charge");
            return true;
        }
        return false;
    },

    dropAtContainer: function(creep) {
        let target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: s => s.structureType === STRUCTURE_STORAGE && _.sum(s.store) < s.storeCapacity
        });
        if (!target) {
          target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
              filter: s => s.structureType === STRUCTURE_CONTAINER && _.sum(s.store) < s.storeCapacity
          });
        }
        if (target) {
            if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.travelTo(target);
            }
            return true;
        }
        return false;
    }
};

module.exports = utilsEnergy;
