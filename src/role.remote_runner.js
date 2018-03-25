const utilsEnergy = require('utils.energy');
const utilsHarvest = require('utils.harvest');

const FLAG_EXTERNAL_MINE = "ExtMine";

let roleRemoteRunner = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if (creep.memory.working && creep.carry.energy == 0) {
            creep.memory.working = false;
        }
        if (!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
            creep.memory.working = true;
        }

        if (creep.memory.working) {
          if (!creep.goHomeRoom()) {
              const container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                  filter: s => s.structureType === STRUCTURE_CONTAINER
                      && _.sum(s.store) < s.storeCapacity
                      && s.room.name == creep.memory.homeRoom
              });
              if (container) {
                  if (creep.transfer(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                      creep.travelTo(container, {visualizePathStyle: {stroke: '#ffaa00'}});
                  }
              }
          }
        } else {
            let flag = Game.flags[FLAG_EXTERNAL_MINE];
            if (flag.room === undefined || flag.room.name !== creep.room.name) {
                creep.travelTo(flag.pos, {visualizePathStyle: {stroke: '#ffaa00'}});
            } else {
                const target = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES);
                if (target) {
                    if (creep.pickup(target) == ERR_NOT_IN_RANGE) {
                        creep.travelTo(target);
                    }
                }
            }
        }
        return;


        if (creep.memory.state === undefined) {
            creep.memory.state = "toRemoteContainer";
        }

        if (creep.memory.state === "toRemoteContainer") {
            let flag = Game.flags[FLAG_EXTERNAL_MINE];
            if (flag.room === undefined || flag.room.name !== creep.room.name) {
              creep.travelTo(flag.pos);
            } else {
                const container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: s => s.structureType === STRUCTURE_CONTAINER
                });
                if (container) {
                    if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.travelTo(container, {visualizePathStyle: {stroke: '#ffaa00'}});
                    }
                }
            }

            if (creep.carry.energy >= creep.carryCapacity) {
                const container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: s => s.structureType === STRUCTURE_CONTAINER
                });

                creep.memory.state = "goBack";
            }
        }

        if (creep.memory.state === "repairContainer") {
            const container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: s => s.structureType === STRUCTURE_CONTAINER
            });

            if (creep.repair(container) == ERR_NOT_IN_RANGE) {
                creep.travelTo(container, {visualizePathStyle: {stroke: '#ffaa00'}});
            }

            if (!container || container.hits >= container.hitsMax) {
                creep.memory.state = "toRemoteContainer";
            }
        }

        if (creep.memory.state === "goBack") {
            if (!creep.goHomeRoom()) {
                const container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: s => s.structureType === STRUCTURE_CONTAINER
                        && _.sum(s.store) < s.storeCapacity
                        && s.room.name == flag.room.name
                });
                if (container) {
                    if (creep.transfer(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.travelTo(container, {visualizePathStyle: {stroke: '#ffaa00'}});
                    }
                }
            }

            if (creep.carry.energy == 0) {
                creep.memory.state = "toRemoteContainer";
            }
        }
    }
};

module.exports = roleRemoteRunner;
