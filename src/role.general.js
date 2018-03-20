const utilsHarvest = require('utils.harvest');
const utilsEnergy = require('utils.energy');
const utilsLoad = require('utils.load');
const constants = require('utils.constants');


let roleBuilder = {

    run: function(creep) {

        if (creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.say('🔄 harvest');
        }
        if (!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
            creep.memory.building = true;
            creep.say('🚧 build');
        }

        if (creep.memory.building) {
            utilsEnergy.placeEnergy(creep);
        } else {
            if (!utilsHarvest.getEnergyFromContainers(creep)) {
                utilsHarvest.harvestRandom(creep, 4);
            }
        }
    }
};

module.exports = roleBuilder;
