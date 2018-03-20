const utilsMovement = require('utils.movement');

const INVADE_FLAG = "Invade";
const TARGET_FLAG = "Target";

const roleInvaderHealer = {

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

        const target = creep.pos.findClosestByRange(FIND_MY_CREEPS, {
            filter: c => c.hits < c.hitsMax
        });

        if (target) {
          if (creep.heal(target) == ERR_NOT_IN_RANGE) {
            creep.rangedHeal(target);
            creep.travelTo(target)
          }
          return;
        }
    }
};

module.exports = roleInvaderHealer;
