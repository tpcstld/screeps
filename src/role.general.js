const utilsHarvest = require('utils.harvest');
const utilsEnergy = require('utils.energy');
const utilsLoad = require('utils.load');
const constants = require('utils.constants');


let roleBuilder = {

    run: function(creep) {

        if (creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
        }
        if (!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
            creep.memory.building = true;
        }

        if (creep.memory.building) {
          const homeRoom = Game.rooms[creep.memory.homeRoom];
          const controller = homeRoom.controller;
          if (creep.upgradeController(controller) == ERR_NOT_IN_RANGE) {
            creep.travelTo(controller);
          }
        } else {
            if (!utilsHarvest.getEnergyFromContainers(creep)) {
                utilsHarvest.harvestRandom(creep, 4);
            }
        }
    }
};

module.exports = roleBuilder;
