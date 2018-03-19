const utilsEnergy = require('utils.energy');
const utilsHarvest = require('utils.harvest');

const FLAG_EXTERNAL_MINE = "ExtMine";
const FLAG_HOME = "Home";

let roleRemoteMiner = {

    /** @param {Creep} creep **/
    run: function(creep) {
        // If not in correct room, move to correct room.
        let flag = Game.flags[FLAG_EXTERNAL_MINE];
        if (flag.room === undefined || flag.room.name !== creep.room.name) {
            creep.travelTo(flag.pos);
        } else {
            utilsHarvest.harvestRandom(creep, 1);
        }
        return;


        const containers = creep.room.find(FIND_STRUCTURES, {
            filter: s => s.structureType === STRUCTURE_CONTAINER
        });

        if (creep.memory.working && creep.carry.energy == 0) {
            creep.memory.working = false;
            creep.say('mining');
        }
        if (containers.length === 0 || containers[0].hits < containers[0].hitsMax) {
            if (!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
                creep.memory.working = true;
                creep.say('returning');
            }
        } else {
            creep.memory.working = false;
        }

        if (creep.memory.working) {
            if (containers.length === 0) {
                const sites = creep.room.find(FIND_CONSTRUCTION_SITES, {
                    filter: s => s.structureType === STRUCTURE_CONTAINER
                });
                if (sites.length > 0) {
                    if (creep.build(sites[0]) === ERR_NOT_IN_RANGE) {
                        creep.travelTo(sites[0]);
                    }
                }
            } else {
                if (containers[0].hits < containers[0].hitsMax) {
                    if (creep.repair(containers[0]) == ERR_NOT_IN_RANGE) {
                        creep.travelTo(containers[0]);
                    }
                }
            }
        } else {
            // If not in correct room, move to correct room.
            let flag = Game.flags[FLAG_EXTERNAL_MINE];
            if (flag.room === undefined || flag.room.name !== creep.room.name) {
                creep.travelTo(flag.pos);
            } else {
                utilsHarvest.harvestRandom(creep, 10);
            }
        }
    }
};

module.exports = roleRemoteMiner;
