const utilsMovement = require('utils.movement');

const INVADE_FLAG = "Invade";
const TARGET_FLAG = "Target";

const roleInvader = {

    /** @param {Creep} creep **/
    run: function(creep) {
        const flag = Game.flags[INVADE_FLAG];
        if (flag === undefined) {
          return;
        }

        if (utilsMovement.isNotInSameRoom(creep, flag)) {
          creep.travelTo(flag.pos);
          return;
        }

        // Hit target flag.
        const targetFlag = Game.flags[TARGET_FLAG];
        if (targetFlag) {
          const flagObjects = targetFlag.pos.look();
          const targets = _.filter(flagObjects,
            o => o.type == "structure" || o.type == "creep");
          if (targets.length > 0) {
            if (creep.attack(targets[0]) == ERR_NOT_IN_RANGE) {
              creep.travelTo(targets[0]);
            }
            return;
          }
        }

        // Hit Extensions
        const extension = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: s => s.structureType == STRUCTURE_EXTENSION
        });
        if (extension) {
          if (creep.attack(extension) == ERR_NOT_IN_RANGE) {
            creep.travelTo(extension);
          }
          return;
        }

        // Hit Spawns
        const spawn = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: s => s.structureType == STRUCTURE_SPAWN
        });
        if (spawn) {
          if (creep.attack(spawn) == ERR_NOT_IN_RANGE) {
            creep.travelTo(spawn);
          }
          return;
        }
    }
};

module.exports = roleInvader;
