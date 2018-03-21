const utilsHarvest = require('utils.harvest');
const utilsEnergy = require('utils.energy');
const utilsLoad = require('utils.load');
const constants = require('utils.constants');


let roleLinkRefiller = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if (creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
        }
        if (!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
            creep.memory.building = true;
        }

        if (creep.memory.building) {
            utilsEnergy.maybeEnergizeLinks(creep);
        } else {
            utilsHarvest.getEnergyFromContainers(creep, true)
        }
    }
};

module.exports = roleLinkRefiller;
