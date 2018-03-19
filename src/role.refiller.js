const utilsHarvest = require('utils.harvest');
const utilsEnergy = require('utils.energy');
const utilsLoad = require('utils.load');
const constants = require('utils.constants');


let roleRefiller = {

    /** @param {Creep} creep **/
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
            if (!utilsEnergy.maybeRefillEnergy(creep)) {
                creep.travelTo(Game.flags["Idle"].pos);
            }
        } else {
            if (!utilsHarvest.getEnergyFromContainers(creep, true)) {
                creep.travelTo(Game.flags["Idle"].pos);
            }
        }
    }
};

module.exports = roleRefiller;