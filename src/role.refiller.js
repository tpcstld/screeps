const utilsHarvest = require('utils.harvest');
const utilsEnergy = require('utils.energy');
const utilsLoad = require('utils.load');
const constants = require('utils.constants');


let roleRefiller = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if (creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
        }
        if (!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
            creep.memory.building = true;
        }

        if (creep.memory.building) {
            if (!utilsEnergy.maybeRefillEnergy(creep)) {
                creep.idle();
            }
        } else {
            if (utilsHarvest.getEnergyFromContainers(creep, true)) {
                return;
            }

            creep.idle();
        }
    }
};

module.exports = roleRefiller;
